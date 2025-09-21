import React, { useState, useEffect } from "react";
import batchServices from "../Services/batchServices";
import "../Styles/batches.css";

export default function Batches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Form state
  const [addForm, setAddForm] = useState({
    batch_id: "",
    batch_name: "",
    start_date: "",
    end_date: "",
  });

  // Update Form state
  const [updateForm, setUpdateForm] = useState({
    batch_id: "",
    batch_name: "",
    start_date: "",
    end_date: "",
  });

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);

  // Notification state
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load all batches
  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setLoading(true);
    const result = await batchServices.fetchAllBatches();
    setBatches(result || []);
    setLoading(false);
  };

  // ===== Add Batch Handlers =====
  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await batchServices.addBatch(addForm);
      setAddForm({ batch_id: "", batch_name: "", start_date: "", end_date: "" });
      setAdding(false);
      setMessage({ type: "success", text: "Batch added successfully!" });
      loadBatches();
    } catch {
      setMessage({ type: "error", text: "Failed to add batch!" });
    }
  };

  // ===== Update Batch Handlers =====
  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await batchServices.updateBatch(updateForm.batch_id, updateForm);
      setEditing(false);
      setUpdateForm({ batch_id: "", batch_name: "", start_date: "", end_date: "" });
      setMessage({ type: "success", text: "Batch updated successfully!" });
      loadBatches();
    } catch {
      setMessage({ type: "error", text: "Failed to update batch!" });
    }
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

  // ===== Delete Batch =====
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this batch?");
    if (confirmDelete) {
      try {
        await batchServices.deleteBatch(id);
        setMessage({ type: "success", text: "Batch deleted successfully!" });
        loadBatches();
      } catch {
        setMessage({ type: "error", text: "Failed to delete batch!" });
      }
    }
  };

  // ===== Render =====
  if (loading) return <p>Loading batches...</p>;

  return (
    <div className="table-container">
      <h2>Batch Management</h2>

      {/* Notification */}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

     

      {/* Add Batch Form */}
      {adding && (
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
          <button
            type="button"
            onClick={() => setAdding(false)}
            style={{ marginLeft: "12px", backgroundColor: "#aaa" }}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Update Batch Form */}
      {editing && (
        <form onSubmit={handleUpdateSubmit} className="batch-form">
          <input
            type="text"
            name="batch_id"
            value={updateForm.batch_id}
            disabled
          />
          <input
            type="text"
            name="batch_name"
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

      {/* Batches Table */}
      {batches.length === 0 ? (
        <p>No batches found.</p>
      ) : (
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
            {batches.map((batch) => (
              <tr key={batch.batch_id}>
                <td>{batch.batch_id}</td>
                <td>{batch.batch_name}</td>
                <td>{batch.start_date}</td>
                <td>{batch.end_date}</td>
                <td>
                  <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                    {!adding && !editing && (
                    <button className="btn add" onClick={() => setAdding(true)}>
                      Add
                    </button>
                  )}
                    <button className="btn edit" onClick={() => startEdit(batch)}>
                      Edit
                    </button>
                    <button className="btn delete" onClick={() => handleDelete(batch.batch_id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
