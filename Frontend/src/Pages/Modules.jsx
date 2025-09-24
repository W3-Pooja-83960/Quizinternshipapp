// Modules.jsx
import React, { useState, useEffect } from "react";
import "../Styles/module.css";
import moduleServices from "../Services/course_moduleService";
import courseService from "../Services/courseServices";

export default function Modules() {
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);

  const [addForm, setAddForm] = useState({ module_id: "", module_name: "", course_id: "", course_name: "" });
  const [updateForm, setUpdateForm] = useState({ module_id: "", module_name: "", course_id: "", course_name: "" });

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load courses
  useEffect(() => {
    async function loadCourses() {
      const data = await courseService.fetchAllCourses();
      setCourses(data || []);
    }
    loadCourses();
  }, []);

  // Load all modules on mount
  useEffect(() => {
    async function loadModules() {
      setLoading(true);
      const data = await moduleServices.fetchAllCourseModules();
      setModules(data || []);
      setLoading(false);
    }
    loadModules();
  }, []);

  // Handle course selection
  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);

    const data = !courseId
      ? await moduleServices.fetchAllCourseModules()
      : await moduleServices.fetchModulesByCourse(courseId);
    setModules(data || []);

    const selected = courses.find(c => c.course_id === courseId);
    setAddForm(prev => ({
      ...prev,
      course_id: selected?.course_id || "",
      course_name: selected?.course_name || "",
    }));
  };

  // Add module
  const handleAddChange = (e) => setAddForm({ ...addForm, [e.target.name]: e.target.value });
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await moduleServices.addCourseModule(addForm);
      setAdding(false);
      setMessage({ type: "success", text: "Module added!" });
      const data = selectedCourse
        ? await moduleServices.fetchModulesByCourse(selectedCourse)
        : await moduleServices.fetchAllCourseModules();
      setModules(data || []);
    } catch { setMessage({ type: "error", text: "Add failed!" }); }
  };

  // Edit module
  const startEdit = (mod) => { setUpdateForm({ ...mod }); setEditing(true); };
  const handleUpdateChange = (e) => setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await moduleServices.updateCourseModule(updateForm);
      setEditing(false);
      setMessage({ type: "success", text: "Module updated!" });
      const data = selectedCourse
        ? await moduleServices.fetchModulesByCourse(selectedCourse)
        : await moduleServices.fetchAllCourseModules();
      setModules(data || []);
    } catch { setMessage({ type: "error", text: "Update failed!" }); }
  };

  // Delete module
  const handleDelete = async (module_id) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      await moduleServices.deleteCourseModule(selectedCourse, module_id);
      setMessage({ type: "success", text: "Module deleted!" });
      const data = selectedCourse
        ? await moduleServices.fetchModulesByCourse(selectedCourse)
        : await moduleServices.fetchAllCourseModules();
      setModules(data || []);
    } catch { setMessage({ type: "error", text: "Delete failed!" }); }
  };

  if (loading) return <p className="modules-loading">Loading modules...</p>;

  return (
    <div className="modules-container">
      <h2 className="modules-title">Module Management</h2>

      {message.text && <div className={`modules-message ${message.type}`}>{message.text}</div>}

      {/* Course selection */}
      <div className="modules-dropdown">
        <select className="modules-course-dropdown" value={selectedCourse} onChange={handleCourseChange}>
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.course_name} - {c.course_id}</option>)}
        </select>
           
        {/*  Add button */}
        {!adding && !editing && <button className="modules-btn-add" onClick={() => setAdding(true)}>Add Module</button>}
      </div>

      {/* Add Form */}
      {adding && (
        <form onSubmit={handleAddSubmit} className="modules-form-add">
          <input className="modules-input module-id" type="text" name="module_id" placeholder="Module ID" value={addForm.module_id} onChange={handleAddChange} required />
          <input className="modules-input module-name" type="text" name="module_name" placeholder="Module Name" value={addForm.module_name} onChange={handleAddChange} required />
          <input className="modules-input course-id" type="text" name="course_id" placeholder="Course ID" value={addForm.course_id} readOnly />
          <input className="modules-input course-name" type="text" name="course_name" placeholder="Course Name" value={addForm.course_name} readOnly />
          <button type="submit" className="modules-btn-submit">Add</button>
          <button type="button" className="modules-btn-cancel" onClick={() => setAdding(false)}>Cancel</button>
        </form>
      )}

      {/* Edit Form */}
      {editing && (
        <form onSubmit={handleUpdateSubmit} className="modules-form-edit">
          <input className="modules-input module-id" type="text" name="module_id" value={updateForm.module_id} disabled />
          <input className="modules-input module-name" type="text" name="module_name" value={updateForm.module_name} onChange={handleUpdateChange} required />
          <input className="modules-input course-id" type="text" name="course_id" value={updateForm.course_id} readOnly />
          <input className="modules-input course-name" type="text" name="course_name" value={updateForm.course_name} readOnly />
          <button type="submit" className="modules-btn-submit">Update</button>
          <button type="button" className="modules-btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}

      {/* Modules Table */}
      {modules.length === 0 ? (
        <p className="modules-no-data">No modules found.</p>
      ) : (
        <table className="modules-table">
          <thead>
            <tr>
              <th>Module ID</th>
              <th>Module Name</th>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {modules.map(mod => (
              <tr key={mod.module_id}>
                <td>{mod.module_id}</td>
                <td>{mod.module_name}</td>
                <td>{mod.course_id}</td>
                <td>{mod.course_name}</td>
                <td>
                  <div className="modules-action-buttons">
                    <button className="modules-btn-edit" onClick={() => startEdit(mod)}>Edit</button>
                    <button className="modules-btn-delete" onClick={() => handleDelete(mod.module_id)}>Delete</button>
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
