import React, { useState, useEffect } from "react";
import batchServices from "../Services/batchServices";
import "../Styles/batches.css";

export default function Batches() {
  const [batches, setBatches] = useState([]);

  // Separate state for Add Form
  const [addForm, setAddForm] = useState({
    batch_id: "",
    batch_name: "",
    start_date: "",
    end_date: "",
  });

  // Separate state for Update Form
  const [updateForm, setUpdateForm] = useState({
    batch_id: "",
    batch_name: "",
    start_date: "",
    end_date: "",
  });

  const [editing, setEditing] = useState(false); // toggle update form

  // Load all batches
  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    const result = await batchServices.fetchAllBatches();
    if (result && result.status === "success") {
      setBatches(result.data);
    } else {
      setBatches([]);
    }
  };

  // ===== Add Batch Handlers =====
  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    await batchServices.addBatch(addForm);
    setAddForm({ batch_id: "", batch_name: "", start_date: "", end_date: "" });
    loadBatches();
  };

  // ===== Update Batch Handlers =====
  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    await batchServices.updateBatch(updateForm.batch_id, updateForm);
    setEditing(false);
    setUpdateForm({ batch_id: "", batch_name: "", start_date: "", end_date: "" });
    loadBatches();
  };

  const startEdit = (batch) => {
    setUpdateForm({
      batch_id: batch.batch_id,
      batch_name: batch.batch_name,
      start_date: batch.start_date,
      end_date: batch.end_date,
    });
    setEditing(true);
  };

  // ===== Delete Batch with Confirmation =====
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this batch?"
    );
    if (confirmDelete) {
      await batchServices.deleteBatch(id);
      loadBatches();
      alert("Batch deleted successfully!");
    }
  };

  return (
    <div className="table-container">
      <h2>Batch Management</h2>

      {/* Add Batch Form */}
      <form onSubmit={handleAddSubmit} className="batch-form">
        <input
          type="text"
          name="batch_id"
          placeholder="Batch ID"
          value={addForm.batch_id}
          onChange={handleAddChange}
          required
        />
        <input
          type="text"
          name="batch_name"
          placeholder="Batch Name"
          value={addForm.batch_name}
          onChange={handleAddChange}
          required
        />
        <input
          type="date"
          name="start_date"
          value={addForm.start_date}
          onChange={handleAddChange}
          required
        />
        <input
          type="date"
          name="end_date"
          value={addForm.end_date}
          onChange={handleAddChange}
          required
        />
        <button type="submit">Add Batch</button>
      </form>

      {/* Update Batch Form (only visible when editing) */}
      {editing && (
        <form onSubmit={handleUpdateSubmit} className="batch-form">
          <input
            type="text"
            name="batch_id"
            placeholder="Batch ID"
            value={updateForm.batch_id}
            onChange={handleUpdateChange}
            required
            disabled
          />
          <input
            type="text"
            name="batch_name"
            placeholder="Batch Name"
            value={updateForm.batch_name}
            onChange={handleUpdateChange}
            required
          />
          <input
            type="date"
            name="start_date"
            value={updateForm.start_date}
            onChange={handleUpdateChange}
            required
          />
          <input
            type="date"
            name="end_date"
            value={updateForm.end_date}
            onChange={handleUpdateChange}
            required
          />
          <button type="submit">Update Batch</button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            style={{ marginLeft: "12px", backgroundColor: "#aaa" }}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Batch Id</th>
            <th>Batch Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch, index) => (
            <tr key={index}>
              <td>{batch.batch_id}</td>
              <td>{batch.batch_name}</td>
              <td>{batch.start_date}</td>
              <td>{batch.end_date}</td>
              <td>
                <div className="action-buttons" style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                  <button
                    className="btn edit"
                    onClick={() => startEdit(batch)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn delete"
                    onClick={() => handleDelete(batch.batch_id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
