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
  const [message, setMessage] = useState({ type: "", text: "", visible: false });

  // ===== Helpers =====
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const showMessage = (type, text, duration = 3000) => {
    setMessage({ type, text, visible: true });
    setTimeout(() => {
      setMessage({ type: "", text: "", visible: false });
    }, duration);
  };

  // ===== Load Batches =====
  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setLoading(true);
    let result = await batchServices.fetchAllBatches();
    // Sort batches ascending by batch_id (oldest first)
    result = result.sort((a, b) => a.batch_id.localeCompare(b.batch_id));
    setBatches(result || []);
    setLoading(false);
  };

  // ===== Add Batch =====
  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...addForm };

      // Call API
      const newBatch = await batchServices.addBatch(payload);

      // Ensure new batch matches table structure
      const formattedBatch = {
        batch_id: newBatch.batch_id || payload.batch_id,
        batch_name: newBatch.batch_name || payload.batch_name,
        start_date: newBatch.start_date || payload.start_date,
        end_date: newBatch.end_date || payload.end_date,
      };

      // Append new batch at the end
      setBatches((prev) => [...prev, formattedBatch]);

      // Reset form
      setAddForm({ batch_id: "", batch_name: "", start_date: "", end_date: "" });
      setAdding(false);
      showMessage("success", "Batch added successfully!");
    } catch (error) {
      console.error(error);
      showMessage("error", "Failed to add batch!");
    }
  };

  // ===== Update Batch =====
  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await batchServices.updateBatch(updateForm.batch_id, updateForm);
      setBatches((prev) =>
        prev.map((b) =>
          b.batch_id === updateForm.batch_id ? updateForm : b
        )
      );
      setEditing(false);
      setUpdateForm({ batch_id: "", batch_name: "", start_date: "", end_date: "" });
      showMessage("success", "Batch updated successfully!");
    } catch {
      showMessage("error", "Failed to update batch!");
    }
  };

  const startEdit = (batch) => {
    setUpdateForm(batch);
    setEditing(true);
  };

  // ===== Delete Batch =====
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this batch?");
    if (confirmDelete) {
      try {
        await batchServices.deleteBatch(id);
        setBatches((prev) => prev.filter((b) => b.batch_id !== id));
        showMessage("success", "Batch deleted successfully!");
      } catch {
        showMessage("error", "Failed to delete batch!");
      }
    }
  };

  // ===== Render =====
  if (loading) return <p>Loading batches...</p>;

  return (
    <div className="batch-table-container">
      <h2>Batch Management</h2>

      {/* Notification */}
      {message.text && (
        <div
          className={`batch-message batch-${message.type} ${
            message.visible ? "show" : ""
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add Button */}
      {!adding && !editing && (
        <button className="batch-add-button" onClick={() => setAdding(true)}>
          Add Batch
        </button>
      )}

      {/* Add Form */}
      {adding && (
        <form onSubmit={handleAddSubmit} className="batch-form">
          <div className="batch-input-row">
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
          </div>
          <div className="batch-button-row">
            <button type="submit" className="batch-submit-button">
              Add Batch
            </button>
            <button
              type="button"
              className="batch-cancel-button"
              onClick={() => setAdding(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Update Form */}
      {editing && (
        <form onSubmit={handleUpdateSubmit} className="batch-form">
          <div className="batch-input-row">
            <input type="text" name="batch_id" value={updateForm.batch_id} disabled />
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
          </div>
          <div className="batch-button-row">
            <button type="submit" className="batch-submit-button">
              Update Batch
            </button>
            <button
              type="button"
              className="batch-cancel-button"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {batches.length === 0 ? (
        <p>No batches found.</p>
      ) : (
        <table className="batch-table">
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
                <td>{formatDate(batch.start_date)}</td>
                <td>{formatDate(batch.end_date)}</td>
                <td>
                  <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                    <button
                      className="batch-edit-button"
                      onClick={() => startEdit(batch)}
                    >
                      Edit
                    </button>
                    <button
                      className="batch-delete-button"
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
      )}
    </div>
  );
}
