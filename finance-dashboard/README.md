# 💰 FinSight – Personal Finance Dashboard

## 📌 Overview

**FinSight** is a modern personal finance dashboard built using **React + TypeScript**. It helps users track income and expenses, visualize spending patterns, and manage transactions efficiently.

The application supports role-based access (Admin & Viewer), interactive charts, and a clean responsive UI optimized for all devices.

---

## 🚀 Features

### 💼 Core Features

* Add, edit, and delete transactions
* Track **Income vs Expenses**
* Real-time balance calculation
* Persistent data using **localStorage**

### 📊 Data Visualization

* Pie chart for category-wise expense distribution
* Line chart for monthly trends
* Download charts as image (PNG)

### 🔍 Filtering & Sorting

* Search transactions by category
* Filter by:

  * All
  * Income
  * Expense
* Sort by:

  * Latest / Oldest
  * Amount (High → Low / Low → High)

### 👤 Role-Based Access

* **Admin**

  * Can add, edit, delete transactions
* **Viewer**

  * Read-only access

### 🎨 UI/UX Enhancements

* Fully responsive (mobile, tablet, desktop)
* Dark mode toggle 🌙
* Category icons (🍔 🚗 🛍️ etc.)
* Toast notifications for actions
* Empty state handling

---

## 🛠️ Tech Stack

* **Frontend:** React + TypeScript
* **Charts:** Recharts
* **Styling:** Tailwind CSS
* **Notifications:** react-hot-toast
* **Utilities:** html2canvas

---

## 📂 Project Structure

```
src/
│── components/
│── context/
│   └── RoleContext.tsx
│── App.tsx
│── main.tsx
│── index.css
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd finance-dashboard
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Install Required Libraries

```bash
npm install recharts html2canvas react-hot-toast
```

### 4️⃣ Run the Project

```bash
npm run dev
```

---

## 🧠 Approach & Design Decisions

### 🔹 State Management

* Used React hooks (`useState`, `useEffect`)
* Local storage ensures persistence across reloads

### 🔹 Data Handling

* Transactions stored as an array of objects
* Derived values:

  * Total Income
  * Total Expense
  * Balance

### 🔹 Charts

* **Pie Chart:** Aggregates expense categories
* **Line Chart:** Groups data by month

### 🔹 Responsiveness

* Tailwind responsive utilities:

  * `grid-cols-1`, `sm`, `lg`
  * Flexbox for adaptive layouts
* Table becomes scrollable on small screens

### 🔹 UX Enhancements

* Toast feedback for user actions
* Icons improve visual recognition
* Empty state improves usability

---

## 📸 Screenshots (Optional)

*Add screenshots here if needed*

---

## 🔮 Future Improvements

* Backend integration (Spring Boot / Node.js)
* Authentication (Login/Signup)
* Budget tracking & alerts
---

## 🙌 Acknowledgements

* Recharts for visualization
* Tailwind CSS for styling
* React ecosystem

---

## 📬 Contact

For any queries or suggestions, feel free to reach out!

---

⭐ If you like this project, consider giving it a star!

])
```
