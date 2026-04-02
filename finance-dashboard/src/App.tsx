import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">
          Tailwind Dashboard Starter 🚀
        </h1>

        <p className="text-gray-600 mb-4">Count: {count}</p>

        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Increment
        </button>
      </div>
    </div>
  );
}

export default App;
