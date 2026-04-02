import { useState, useEffect, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import { Toaster, toast } from "react-hot-toast";

import { useRole } from "./context/RoleContext";

type Transaction = {
  id: number;
  date: string;
  amount: number;
  category: string;
  type: "income" | "expense";
};

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Salary",
  "Freelance",
];

const categoryIcons: Record<string, string> = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Bills: "📄",
  Entertainment: "🎮",
  Health: "💊",
  Salary: "💰",
  Freelance: "💻",
};

function App() {
  const { role, setRole } = useRole();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [dark, setDark] = useState(false);
  const [sortBy, setSortBy] = useState("latest");

  const chartRef = useRef<HTMLDivElement>(null);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, date: "2026-04-01", amount: 5000, category: "Salary", type: "income" },
          { id: 2, date: "2026-04-02", amount: 200, category: "Food", type: "expense" },
        ];
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "Food",
    type: "expense",
  });

  const [editId, setEditId] = useState<number | null>(null);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((a, t) => a + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.category.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" ? true : t.type === filter;
    return matchesSearch && matchesFilter;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "latest") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === "amount-high") return b.amount - a.amount;
    if (sortBy === "amount-low") return a.amount - b.amount;
    return 0;
  });

  const handleAddOrEdit = () => {
    if (!form.date || !form.amount || !form.category) return;

    if (editId) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editId
            ? {
                ...t,
                date: form.date,
                category: form.category,
                amount: Number(form.amount),
                type: form.type as "income" | "expense",
              }
            : t
        )
      );
      toast.success("Transaction updated ✅");
      setEditId(null);
    } else {
      const newTransaction: Transaction = {
        id: Date.now(),
        date: form.date,
        amount: Number(form.amount),
        category: form.category,
        type: form.type as "income" | "expense",
      };
      setTransactions([newTransaction, ...transactions]);
      toast.success("Transaction added 🎉");
    }

    setForm({ date: "", amount: "", category: "Food", type: "expense" });
  };

  const handleEdit = (t: Transaction) => {
    setForm({
      date: t.date,
      amount: String(t.amount),
      category: t.category,
      type: t.type,
    });
    setEditId(t.id);
  };

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast.error("Transaction deleted 🗑️");
  };

  const categoryMap: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.type === "expense") {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    }
  });

  const pieData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: categoryMap[key],
  }));

  const COLORS = ["#6366f1", "#ef4444", "#22c55e", "#f59e0b"];

  const monthlyMap: Record<string, number> = {};
  transactions.forEach((t) => {
    const month = t.date.slice(0, 7);
    monthlyMap[month] = (monthlyMap[month] || 0) + t.amount;
  });

  const monthlyData = Object.keys(monthlyMap).map((month) => ({
    date: month,
    amount: monthlyMap[month],
  }));

  const highestCategory =
    pieData.length > 0
      ? pieData.reduce((prev, curr) =>
          prev.value > curr.value ? prev : curr
        ).name
      : "N/A";

  const downloadChart = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement("a");
    link.download = "charts.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className={dark ? "dark bg-gray-900 text-white min-h-screen" : "bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen"}>

      <Toaster position="top-right" />

      {/* Navbar */}
      <div className="bg-white/70 backdrop-blur-md dark:bg-gray-800 shadow-md px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sticky top-0">
        <h1 className="text-xl sm:text-2xl font-bold text-indigo-600">💰 FinSight</h1>

        <div className="flex gap-2 sm:gap-3 items-center">
          <select value={role} onChange={(e) => setRole(e.target.value as "viewer" | "admin")} className="border px-2 py-1 rounded">
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>

          <button onClick={() => setDark(!dark)} className="px-3 py-1 rounded bg-indigo-500 text-white">
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg">
            💼 Balance <br /> ₹ {balance}
          </div>
          <div className="p-5 rounded-xl bg-green-500 text-white shadow-lg">
            📈 Income <br /> ₹ {totalIncome}
          </div>
          <div className="p-5 rounded-xl bg-red-500 text-white shadow-lg">
            📉 Expense <br /> ₹ {totalExpense}
          </div>
        </div>

        {/* Charts */}
        <div ref={chartRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line dataKey="amount" stroke="#6366f1" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <button onClick={downloadChart} className="mb-6 w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg shadow">
          📥 Download Charts
        </button>

        {/* Insight */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-6 text-center sm:text-left">
          🔥 Highest Spending: <b>{highestCategory}</b>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded w-full" />

          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded w-full sm:w-auto">
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded w-full sm:w-auto">
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="amount-high">High → Low</option>
            <option value="amount-low">Low → High</option>
          </select>
        </div>

        {/* Admin Form */}
        {role === "admin" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="border p-2 rounded" />
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="border p-2 rounded" />

            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="border p-2 rounded">
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>

            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border p-2 rounded">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <button onClick={handleAddOrEdit} className="bg-green-500 text-white p-2 rounded w-full">
              {editId ? "Update" : "Add"}
            </button>
          </div>
        )}

        {/* Empty State */}
        {sortedTransactions.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            😕 No transactions yet. Start adding some!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] bg-white dark:bg-gray-800 rounded-xl shadow">
              <thead className="bg-indigo-500 text-white">
                <tr>
                  <th className="p-2">Date</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Type</th>
                  {role === "admin" && <th className="p-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {sortedTransactions.map((t) => (
                  <tr key={t.id} className="text-center border-b">
                    <td className="p-2">{t.date}</td>
                    <td className="p-2">{categoryIcons[t.category]} {t.category}</td>
                    <td className="p-2">₹ {t.amount}</td>
                    <td className="p-2">{t.type}</td>
                    {role === "admin" && (
                      <td className="p-2 flex justify-center gap-2">
                        <button onClick={() => handleEdit(t)}>✏️</button>
                        <button onClick={() => handleDelete(t.id)}>🗑️</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;