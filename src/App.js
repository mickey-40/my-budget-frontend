import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

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

  // 1) Whenever the token changes, set or remove a default Axios header:
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // 2) Fetch Transactions (no need to manually add headers now):
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

  // Handle User Authentication (Login/Register)
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
        // Store token in localStorage and in state
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
      }
    } catch (error) {
      console.error("❌ Authentication failed: ", error);
      alert("Error: " + (error.response?.data.error || "Something went wrong"));
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  // Handle Transaction Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in or sign up first.");
      return;
    }
    const transactionData = {
      type: String(form.type),
      category: String(form.category),
      amount: parseFloat(form.amount),
      description: String(form.description || ""),
      date: form.date,
    };
    console.log("🚀 Sending transaction:", transactionData);

    try {
      // No need to manually add headers anymore; it's in axios defaults
      const response = await axios.post(`${API_URL}/transactions`, transactionData);
      console.log("✅ Transaction added:", response.data);

      // Reset the form
      setForm({
        type: "expense",
        category: "",
        amount: "",
        description: "",
        date: "",
      });

      // Refresh the list of transactions
      fetchTransactions();
    } catch (error) {
      console.error("❌ Error adding transaction:", error.response?.data || error);
      if (error.response) {
        alert("❌ Backend Error: " + JSON.stringify(error.response?.data));
      } else {
        alert("❌ Network error: Check Flask server.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold">💰 Budget Tracker</h2>

        {!token ? (
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
            <p onClick={() => setIsSignup(!isSignup)}>
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
              />
              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <button type="submit">Add Transaction</button>
            </form>

            <h2>Your Transactions</h2>
            {transactions.length === 0 ? (
              <p>No Transactions Found</p>
            ) : (
              <ul>
                {transactions.map((t) => (
                  <li key={t.id}>
                    {t.category} – ${t.amount} ({t.type})
                  </li>
                ))}
              </ul>
            )}

            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;


