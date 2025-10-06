import React, { useState, useEffect } from "react";
import moduleServices from "../Services/course_moduleService";
import courseServices from "../Services/courseServices";
import "../Styles/module.css";

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modulesByCourse, setModulesByCourse] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);

  const [addForm, setAddForm] = useState({ module_name: "" });
  const [updateForm, setUpdateForm] = useState({ module_id: "", module_name: "" });
  const [assignForm, setAssignForm] = useState({ course_id: "", module_id: "" });

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const [message, setMessage] = useState({ type: "", text: "", visible: false });

  const showMessage = (type, text, duration = 3000) => {
    setMessage({ type, text, visible: true });
    setTimeout(() => setMessage({ type: "", text: "", visible: false }), duration);
  };

  // ===== Load Modules & Courses =====
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const allModules = await moduleServices.fetchAllModules();
      const allCourses = await courseServices.fetchAllCourses();
      setModules(allModules || []);
      setCourses(allCourses || []);
      setLoading(false);
    };
    loadData();
  }, []);

  // ===== CRUD Operations =====
  const handleAddChange = (e) => setAddForm({ ...addForm, [e.target.name]: e.target.value });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await moduleServices.addModule(addForm);
      if (res.status === "success" && res.data) {
        setModules((prev) => [...prev, res.data]);
      }
      setAddForm({ module_name: "" });
      setAdding(false);
      showMessage("success", "Module added!");
    } catch {
      showMessage("error", "Failed to add module!");
    }
  };

  const startEdit = (module) => {
    setUpdateForm(module);
    setEditing(true);
  };

  const handleUpdateChange = (e) => setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await moduleServices.updateModule(updateForm.module_id, updateForm);
      setModules((prev) =>
        prev.map((m) => (m.module_id === updateForm.module_id ? updateForm : m))
      );
      setEditing(false);
      showMessage("success", "Module updated!");
    } catch {
      showMessage("error", "Failed to update module!");
    }
  };

  const handleDelete = async (module_id) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      await moduleServices.deleteModule(module_id);
      setModules((prev) => prev.filter((m) => m.module_id !== module_id));
      showMessage("success", "Module deleted!");
    } catch {
      showMessage("error", "Failed to delete module!");
    }
  };

  // ===== Assign / Unassign Modules to Course =====
  const handleAssignChange = (e) => setAssignForm({ ...assignForm, [e.target.name]: e.target.value });
const handleAssignSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      module_id: parseInt(assignForm.module_id),
      course_id: parseInt(assignForm.course_id),
    };

    const res = await moduleServices.assignModuleToCourse(payload);
    console.log("Assign module response:", res);

    if (res?.status === "success" && res?.data) {
      const { module_name, course_name } = res.data || {};
      if (selectedCourse && selectedCourse === payload.course_id.toString()) {
        setModulesByCourse((prev) => [
          ...prev,
          { module_id: payload.module_id, module_name },
        ]);
      }
      showMessage(
        "success",
        `Module "${module_name || "Unknown"}" assigned to "${course_name || "Unknown"}"!`
      );
      setAssignForm({ module_id: "", course_id: "" });
      setAssigning(false);
    } else {
      showMessage(
        "error",
        typeof res?.error === "string"
          ? res.error
          : "Assignment failed! Please check backend route or payload."
      );
    }
  } catch (err) {
    console.error("Assign error:", err);
    showMessage("error", "Something went wrong!");
  }
};


  const handleUnassign = async (module_id) => {
    if (!selectedCourse) return;
    try {
      await moduleServices.unassignModuleFromCourse({
        module_id,
        course_id: parseInt(selectedCourse),
      });
      showMessage("success", "Module unassigned!");
      fetchModulesByCourse(selectedCourse);
    } catch {
      showMessage("error", "Failed to unassign module!");
    }
  };

  // ===== Fetch Modules by Selected Course =====
  const fetchModulesByCourse = async (courseId) => {
    try {
      const data = await moduleServices.fetchModulesByCourse(parseInt(courseId));
      setModulesByCourse(data || []);
    } catch {
      showMessage("error", "Failed to load modules for course!");
    }
  };

  const handleCourseSelect = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    if (!courseId) setModulesByCourse([]);
    else fetchModulesByCourse(courseId);
  };

  if (loading) return <p>Loading modules...</p>;

  return (
    <div className="module-table-container">
      <h2>Module Management</h2>

      {message.text && (
        <div
          className={`module-message module-${message.type} ${
            message.visible ? "show" : ""
          }`}
        >
       {typeof message.text === "string" ? message.text : JSON.stringify(message.text)}

        </div>
      )}

      {/* Action Buttons */}
      {!adding && !editing && !assigning && (
        <div className="module-action-buttons">
          <button onClick={() => setAdding(true)}>Add Module</button>
          <button onClick={() => setAssigning(true)}>Assign Module to Course</button>
        </div>
      )}

      {/* Add Form */}
      {adding && (
        <form onSubmit={handleAddSubmit} className="module-form">
          <input
            name="module_name"
            placeholder="Module Name"
            value={addForm.module_name}
            onChange={handleAddChange}
            required
          />
          <button type="submit">Add</button>
          <button type="button" onClick={() => setAdding(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Edit Form */}
      {editing && (
        <form onSubmit={handleUpdateSubmit} className="module-form">
          <input name="module_id" value={updateForm.module_id} disabled />
          <input
            name="module_name"
            value={updateForm.module_name}
            onChange={handleUpdateChange}
            required
          />
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Assign Form */}
      {assigning && (
        <form onSubmit={handleAssignSubmit} className="module-form">
          <select
            name="course_id"
            value={assignForm.course_id}
            onChange={handleAssignChange}
            required
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.course_id} value={c.course_id}>
                {c.course_name}
              </option>
            ))}
          </select>
          <select
            name="module_id"
            value={assignForm.module_id}
            onChange={handleAssignChange}
            required
          >
            <option value="">Select Module</option>
            {modules.map((m) => (
              <option key={m.module_id} value={m.module_id}>
                {m.module_name}
              </option>
            ))}
          </select>
          <button type="submit">Assign</button>
          <button type="button" onClick={() => setAssigning(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Course Dropdown */}
      <div style={{ margin: "20px 0" }}>
        <label>Select Course: </label>
        <select value={selectedCourse} onChange={handleCourseSelect}>
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c.course_id} value={c.course_id}>
              {c.course_name}
            </option>
          ))}
        </select>
      </div>

      {/* Modules by Selected Course */}
      {selectedCourse && (
        <>
          <h4>Modules for Selected Course</h4>
          <table className="module-table">
            <thead>
              <tr>
                <th>Module ID</th>
                <th>Module Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modulesByCourse.length > 0 ? (
                modulesByCourse.map((m) => (
                  <tr key={m.module_id}>
                    <td>{m.module_id}</td>
                    <td>{m.module_name}</td>
                    <td>
                      <button onClick={() => startEdit(m)}>Edit</button>
                      <button onClick={() => handleUnassign(m.module_id)}>
                        Unassign
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">No modules assigned to this course</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {/* All Modules Table */}
      <h4>All Modules</h4>
      <table className="module-table">
        <thead>
          <tr>
            <th>Module ID</th>
            <th>Module Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {modules.map((m) => (
            <tr key={m.module_id}>
              <td>{m.module_id}</td>
              <td>{m.module_name}</td>
              <td>
                <button onClick={() => startEdit(m)}>Edit</button>
                <button onClick={() => handleDelete(m.module_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
