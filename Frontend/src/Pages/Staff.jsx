// src/Pages/Staff.jsx
import React, { useState, useEffect } from "react";
import staffService from "../Services/staffService";
import "../Styles/Staff.css";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Load all staff
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const result = await staffService.getAllStaff();
      if (result.status === "success") setStaff(result.data);
      else setStaff([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update staff
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await staffService.updateStaff(editId, form);
        setEditing(false);
        setEditId(null);
      } else {
        await staffService.addStaff(form);
      }
      setForm({ firstName: "", lastName: "", email: "", password: "", role: "" });
      loadStaff();
    } catch (err) {
      alert("Error saving staff");
      console.error(err);
    }
  };

  const startEdit = (staffData) => {
    setEditing(true);
    setEditId(staffData.staff_id);
    setForm({
      firstName: staffData.firstName,
      lastName: staffData.lastName,
      email: staffData.email,
      password: staffData.password,
      role: staffData.role,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await staffService.deleteStaff(id);
        loadStaff();
        alert("Staff deleted successfully!");
      } catch (err) {
        alert("Error deleting staff");
      }
    }
  };

  return (
    <div className="table-container">
      <h2>Staff Management</h2>

      <form onSubmit={handleSubmit} className="staff-form">
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="role"
          placeholder="Role"
          value={form.role}
          onChange={handleChange}
          required
        />
        <button type="submit">{editing ? "Update" : "Add"} Staff</button>
        {editing && <button type="button" onClick={() => { setEditing(false); setForm({ firstName: "", lastName: "", email: "", password: "", role: "" }); }}>Cancel</button>}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.staff_id}>
              <td>{s.staff_id}</td>
              <td>{s.firstName} {s.lastName}</td>
              <td>{s.email}</td>
              <td>{s.role}</td>
              <td>
                <button onClick={() => startEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.staff_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
