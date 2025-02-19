import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Chart from "./components/Chart";

const API_URL = "http://localhost:5001";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    date: "",
  });
  const [filter, setFilter] = useState({ category: "", date: "" });
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error("❌ Error fetching transactions: ", error);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transactionData = {
      type: form.type,
      category: form.category,
      amount: parseFloat(form.amount), // ✅ Convert amount to a number
      description: form.description || "", // ✅ Ensure description is a string
      date: form.date, // ✅ Ensure it's in 'YYYY-MM-DD' format
    };

    console.log("🚀 Sending transaction:", transactionData);

    try {
      const response = await axios.post(`${API_URL}/transactions`, transactionData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Transaction added:", response.data);
      setForm({ type: "expense", category: "", amount: "", description: "", date: "" });
      fetchTransactions();
    } catch (error) {
      console.error("❌ Error adding transaction:", error.response?.data || error);
      alert("Failed to add transaction. Please check your inputs.");
    }
  };

  // ✅ Calculate Total Income, Total Expenses, and Running Balance
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 dark:text-white shadow-lg rounded-lg p-6">
        
        {/* Dark Mode Toggle */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">💰 Budget Tracker</h2>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* ✅ Running Total Section */}
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
          <h3 className="text-xl font-bold">💰 Summary</h3>
          <p className="text-green-500 font-semibold">Total Income: ${totalIncome.toFixed(2)}</p>
          <p className="text-red-500 font-semibold">Total Expenses: ${totalExpenses.toFixed(2)}</p>
          <p className={`text-lg font-bold mt-2 ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
            Balance: ${balance.toFixed(2)}
          </p>
        </div>

        {/* Transaction Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="text"
            placeholder="Category"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Amount"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />

          <input
            type="date"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Transaction
          </button>
        </form>
      {/* Transactions List */}
      <h3 className="text-xl font-semibold mt-6">Transaction List</h3>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-500">No transactions found.</p>
        ) : (
          <table className="w-full mt-4 border-collapse border border-gray-300 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-2 border border-gray-300 dark:border-gray-700">Type</th>
                <th className="p-2 border border-gray-300 dark:border-gray-700">Category</th>
                <th className="p-2 border border-gray-300 dark:border-gray-700">Amount</th>
                <th className="p-2 border border-gray-300 dark:border-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr
                  key={t.id}
                  className={`${
                    t.type === "income"
                      ? "bg-green-100 dark:bg-green-700"
                      : "bg-red-100 dark:bg-red-700"
                  }`}
                >
                  <td className="p-2 border border-gray-300 dark:border-gray-700">
                    {t.type}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-700">
                    {t.category}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-700">
                    ${t.amount}
                  </td>
                  <td className="p-2 border border-gray-300 dark:border-gray-700">
                    {t.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;