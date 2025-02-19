import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4CAF50", "#F44336"]; // Green for Income, Red for Expense

const Chart = ({ transactions }) => {
  // Group data by type (income vs. expense)
  const summary = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "income") {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const data = [
    { name: "Income", value: summary.income },
    { name: "Expense", value: summary.expense },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white shadow-md p-4 rounded-lg">
      <h3 className="text-xl font-semibold text-center mb-2">💹 Income vs. Expenses</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
