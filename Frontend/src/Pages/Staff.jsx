import React, { useState, useEffect } from "react";
import staffService from "../Services/staffServices";
import "../Styles/staff.css";

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const result = await staffService.getAllStaff();
      setStaff(result);
    } catch (err) {
      console.error("Error loading staff:", err);
      setStaff([]);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await staffService.addStaff(form);
      setAdding(false);
      setForm({ firstName: "", lastName: "", email: "", password: "", role: "" });
      setMessage({ type: "success", text: "Staff added successfully!" });
      loadStaff();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to add staff!" });
      console.error(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await staffService.updateStaff(editId, form);
      setEditing(false);
      setEditId(null);
      setForm({ firstName: "", lastName: "", email: "", password: "", role: "" });
      setMessage({ type: "success", text: "Staff updated successfully!" });
      loadStaff();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update staff!" });
      console.error(err);
    }
  };

  const startEdit = (s) => {
    setForm({
      firstName: s.firstName,
      lastName: s.lastName,
      email: s.email,
      password: s.password,
      role: s.role,
    });
    setEditId(s.staff_id);
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff?")) {
      try {
        await staffService.deleteStaff(id);
        setMessage({ type: "success", text: "Staff deleted successfully!" });
        loadStaff();
      } catch (err) {
        setMessage({ type: "error", text: "Failed to delete staff!" });
      }
    }
  };

  if (loading) return <p>Loading staff...</p>;


  
  return (
    <div className="staff-table-container">
      <h2>Staff Management</h2>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      {/* Add Button */}
      {!adding && !editing && (
        <button className="staff-btn add" onClick={() => setAdding(true)} style={{ marginBottom: "16px" }}>
          Add Staff
        </button>
      )}

      {/* Add Staff Form */}
      {adding && (
        <form onSubmit={handleAddSubmit} className="staff-form">
          <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="text" name="role" placeholder="Role" value={form.role} onChange={handleChange} required />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setAdding(false)} style={{ marginLeft: "12px", backgroundColor: "#aaa" }}>
            Cancel
          </button>
        </form>
      )}

      {/* Edit Staff Form */}
      {editing && (
        <form onSubmit={handleEditSubmit} className="staff-form">
          <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
          <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="text" name="role" placeholder="Role" value={form.role} onChange={handleChange} required />
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditing(false)} style={{ marginLeft: "12px", backgroundColor: "#aaa" }}>
            Cancel
          </button>
        </form>
      )}

      {/* Staff Table */}
      {staff.length === 0 ? (
        <p>No staff found.</p>
      ) : (
        <table className="staff-table">
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
                <td className="staff-action-buttons">
                  <button className="staff-btn edit" onClick={() => startEdit(s)}>Edit</button>
                  <button className="staff-btn delete" onClick={() => handleDelete(s.staff_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}