import React, { useState, useEffect } from "react";
import axios from "axios";

function Dem() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: "", age: "" });

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const res = await axios.get("http://localhost:5000/api/demo");
    setEntries(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/demo", form);
    setForm({ name: "", age: "" });
    fetchEntries();
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">Demo Form - React + MongoDB</h1>
      <form onSubmit={handleSubmit} className="mb-5">
        <input
          type="text"
          placeholder="Name"
          className="form-control mb-3"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Age"
          className="form-control mb-3"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />
        <button type="submit" className="btn btn-primary w-100">Add Entry</button>
      </form>

      <h2 className="mb-3 text-center">Entries List</h2>
      <ul className="list-group">
        {entries.map((entry, idx) => (
          <li key={idx} className="list-group-item">
            {entry.name} - {entry.age} years
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dem;
