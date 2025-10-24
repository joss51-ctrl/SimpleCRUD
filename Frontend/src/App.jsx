import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", gender: "" });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // Mode Update
      await fetch(`http://localhost:5000/users/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      // Mode Tambah
      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({ name: "", email: "", gender: "" });
    fetchUsers();
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, gender: user.gender });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", email: "", gender: "" });
  };

  // 🔹 hitung statistik pengguna
  const totalUsers = users.length;
  const maleCount = users.filter((u) => u.gender === "Male").length;
  const femaleCount = users.filter((u) => u.gender === "Female").length;

  const malePercentage = totalUsers ? ((maleCount / totalUsers) * 100).toFixed(1) : 0;
  const femalePercentage = totalUsers ? ((femaleCount / totalUsers) * 100).toFixed(1) : 0;

  // Data untuk pie chart
  const dataChart = [
    { name: "Male", value: maleCount },
    { name: "Female", value: femaleCount },
  ];
  const COLORS = ["#3b82f6", "#ec4899"];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Users Data</h1>

      {/* Dashboard */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-zinc-200 p-4 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-gray-600">Total User</h2>
          <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
        </div>
        <div className="bg-zinc-200 p-4 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-gray-600">Male</h2>
          <p className="text-3xl font-bold text-blue-500">{malePercentage}%</p>
        </div>
        <div className="bg-zinc-200 p-4 rounded-lg shadow text-center">
          <h2 className="text-lg font-semibold text-gray-600">Female</h2>
          <p className="text-3xl font-bold text-pink-500">{femalePercentage}%</p>
        </div>
      </div>

      {/*Pie Chart */}
      <div className="bg-zinc-200 p-4 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold text-gray-700 mb-4 text-center">Gender Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={dataChart}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey="value"
            >
              {dataChart.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Form Tambah / Edit User */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-zinc-200 p-4 shadow-md rounded-lg"
      >
        <h1 className="text-xl font-bold text-gray-700 mb-4 text-center">Add User</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="p-2 border rounded w-full"
            required
          >
            <option value="">Choose Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white font-semibold transition ${
              editingId
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingId ? "Update User" : "Add User"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white font-semibold px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Tabel User */}
      <h1 className="text-center bg-zinc-200 text-xl font-bold text-gray-700 py-2">User List</h1>
      <table className="w-full bg-zinc-200 shadow rounded-lg">
        <thead className="bg-blue-300">
          <tr>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Gender</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.gender}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="bg-yellow-400 text-white font-semibold px-3 py-1 rounded hover:bg-yellow-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="bg-red-500 text-white font-semibold px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-500">
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
