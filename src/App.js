import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [editTransaction, setEditTransaction]= useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/transactions`);
      setTransactions(response.data);
    } catch (error) {
      console.error("❌ Error fetching transactions: ", error);
    }
  }, [token]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? "register" : "login";
    try {
      const response = await axios.post(`${API_URL}/${endpoint}`, {
        username,
        password,
      });

      if (isSignup) {
        alert("✅ Signup successful! Please log in.");
        setIsSignup(false);
      } else {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
      }
    } catch (error) {
      console.error("❌ Authentication failed: ", error);
      alert("Error: " + (error.response?.data.error || "Something went wrong"));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in first.");
      return;
    }
  
    const transactionData = {
      type: String(form.type),
      category: String(form.category),
      amount: parseFloat(form.amount),
      description: String(form.description || ""),
      date: form.date,
    };
  
    try {
      if (editTransaction) {
        // UPDATE Transaction (PUT request)
        await axios.put(`${API_URL}/transactions/${editTransaction.id}`, transactionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Transaction updated successfully!");
        setEditTransaction(null); // Exit edit mode
      } else {
        // CREATE New Transaction (POST request)
        await axios.post(`${API_URL}/transactions`, transactionData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Transaction added!");
      }
  
      setForm({ type: "expense", category: "", amount: "", description: "", date: "" });
      fetchTransactions(); // Refresh transactions after update/add
    } catch (error) {
      console.error("❌ Error saving transaction:", error.response?.data || error);
      alert("❌ Error saving transaction. Try again.");
    }
  };
  

  // Delete Transaction
  const deleteTransaction = async (id) => {
    if (!token) return alert("Please log in first.");
  
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh transactions after deletion
      fetchTransactions();
    } catch (error) {
      console.error("❌ Error deleting transaction:", error.response?.data || error);
      alert("❌ Error deleting transaction. Try again.");
    }
  };

  // Edit Transaction
  const handleEditClick = (transaction) => {
    setEditTransaction(transaction);
    setForm({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
    });
  };
  

  // ✅ Calculate Totals
  const incomeTotal = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenseTotal = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const overallTotal = incomeTotal - expenseTotal; // Final balance

  // Chart Data for Pie Chart
  const chartData = [
    { name: "Income", value: incomeTotal, color: "#10B981"},
    { name: "Expenses", value: expenseTotal, color: "#EF4444"},
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">💰 Budget Tracker</h2>

        {!token ? (
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {isSignup ? "Sign Up" : "Login"}
            </button>
            <p className="text-sm text-center text-gray-500 cursor-pointer" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? "Already have an account? Log in" : "Don't have an account? Sign up"}
            </p>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="description"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition">
                {editTransaction ? "Update Transaction" : "Add Transaction"}
              </button>
            </form>

            {/* 🏆 Display Totals & Chart */}
            <div className="mt-6 flex items-center justify-between bg-gray-200 p-4 rounded-lg">
              <div>
                <p className="text-lg font-semibold">📊 Totals:</p>
                <p className="text-green-600 font-bold">Income: ${incomeTotal.toFixed(2)}</p>
                <p className="text-red-600 font-bold">Expenses: ${expenseTotal.toFixed(2)}</p>
                <p className={`font-bold text-xl ${overallTotal >= 0 ? "text-green-700" : "text-red-700"}`}>
                  Balance: ${overallTotal.toFixed(2)}
                </p>
              </div>
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                    >
                    { chartData.map((entry, index) =>(                           <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    </Pie>
                    <Tooltip/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <h2 className="text-lg font-bold mt-6">Your Transactions</h2>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center mt-2">No Transactions Found</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {transactions.map((t) => (
                  <li key={t.id} className="bg-gray-200 p-3 rounded-lg flex justify-between items-center">
                    <span>
                      {t.category} – <strong>${t.amount}</strong> ({t.type})
                    </span>
                    <div>
                      <button
                        onClick={() => handleEditClick(t)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 transition mr-2"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <button onClick={handleLogout} className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;



