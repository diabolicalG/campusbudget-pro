import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { saveAs } from 'file-saver';
import { Chart as ChartJS, ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default function Dashboard(
) {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({ food: 200, books: 100, transport: 80 });
  const [form, setForm] = useState({ amount: '', description: '', category: 'food', type: 'expense' });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async (
) => {
    const q = query(collection(db, 'transactions'), where('userId', '==', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    const txns = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTransactions(txns);
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    const newTxn = {
      userId: auth.currentUser.uid,
      amount: parseFloat(form.amount),
      description: form.description,
      category: form.category,
      type: form.type,
      date: new Date().toISOString().split('T')[0]
    };
    await addDoc(collection(db, 'transactions'), newTxn);
    setTransactions([...transactions, newTxn]);
    setForm({ amount: '', description: '', category: 'food', type: 'expense' });
  };

  const exportCSV = (
) => {
    const csv = [
      ['Date', 'Description', 'Amount', 'Category', 'Type'],
      ...transactions.map(t => [t.date, t.description, t.amount, t.category, t.type])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'campusbudget-export.csv');
  };

  const balance = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);

  const spendingByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const chartData = {
    labels: Object.keys(spendingByCategory),
    datasets: [{
      label: 'Spending by Category',
      data: Object.values(spendingByCategory),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
    }]
  };

  const lineData = {
    labels: transactions.slice(-6).map(t => t.date),
    datasets: [{
      label: 'Balance Over Time',
      data: transactions.slice(-6).map((_, i, arr) => {
        return arr.slice(0, i + 1).reduce((sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount), 0);
      }),
      borderColor: '#36A2EB',
      tension: 0.4
}]
  };

  return (
    <div className="dashboard">
      <h1>🎓 CampusBudget Pro</h1>
      <p><strong>Hi, {auth.currentUser.email}!</strong></p>

      <div className="stats">
        <div className="card">
          <h3>💰 Balance</h3>
          <p>${balance.toFixed(2)}</p>
        </div>
      </div>

      <form onSubmit={addTransaction} className="add-form">
        <input
          type="number" step="0.01" placeholder="Amount"
          value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          type="text" placeholder="Description"
          value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
          required
        />
        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          <option value="food">Food</option>
          <option value="books">Books</option>
          <option value="transport">Transport</option>
          <option value="fun">Fun</option>
          <option value="rent">Rent</option>
        </select>
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit">➕ Add</button>
      </form>

      <div className="charts">
        <div className="chart-card">
          <h3>📊 Spending by Category</h3>
          <Pie data={chartData} />
        </div>
        <div className="chart-card">
          <h3>📈 Balance Over Time</h3>
          <Line data={lineData} />
        </div>
      </div>

      <button onClick={exportCSV} className="export-btn">📤 Export to CSV</button>
    </div>
  );
}
