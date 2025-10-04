// import React, { useState, useEffect } from "react";
// import "../Styles/module.css";
// import moduleServices from "../Services/course_moduleService";
// import courseService from "../Services/courseServices";

// export default function Modules() {
//   const [modules, setModules] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [selectedCourse, setSelectedCourse] = useState("");
//   const [loading, setLoading] = useState(true);

//   const [addForm, setAddForm] = useState({ module_id: "", module_name: "", course_id: "", course_name: "" });
//   const [updateForm, setUpdateForm] = useState({ module_id: "", module_name: "", course_id: "", course_name: "" });

//   const [adding, setAdding] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [message, setMessage] = useState({ type: "", text: "" });

//   // Load courses
//   useEffect(() => {
//     async function loadCourses() {
//       const data = await courseService.fetchAllCourses();
//       setCourses(data || []);
//     }
//     loadCourses();
//   }, []);

//   // Load all modules
//   useEffect(() => {
//     async function loadModules() {
//       setLoading(true);
//       const data = await moduleServices.fetchAllCourseModules();
//       setModules(data || []);
//       setLoading(false);
//     }
//     loadModules();
//   }, []);

//   // Handle course selection
//   const handleCourseChange = async (e) => {
//     const courseId = e.target.value;
//     setSelectedCourse(courseId);

//     const data = !courseId
//       ? await moduleServices.fetchAllCourseModules()
//       : await moduleServices.fetchModulesByCourse(courseId);
//     setModules(data || []);

//     const selected = courses.find(c => c.course_id === courseId);
//     setAddForm(prev => ({
//       ...prev,
//       course_id: selected?.course_id || "",
//       course_name: selected?.course_name || "",
//     }));
//   };

//   // Add module
//   const handleAddChange = (e) => setAddForm({ ...addForm, [e.target.name]: e.target.value });
//   const handleAddSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await moduleServices.addCourseModule(addForm);
//       setAdding(false);
//       setMessage({ type: "success", text: "Module added!" });
//       const data = selectedCourse
//         ? await moduleServices.fetchModulesByCourse(selectedCourse)
//         : await moduleServices.fetchAllCourseModules();
//       setModules(data || []);
//     } catch {
//       setMessage({ type: "error", text: "Add failed!" });
//     }
//   };

//   // Edit module
//   const startEdit = (mod) => { setUpdateForm({ ...mod }); setEditing(true); };
//   const handleUpdateChange = (e) => setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await moduleServices.updateCourseModule(updateForm);
//       setEditing(false);
//       setMessage({ type: "success", text: "Module updated!" });
//       const data = selectedCourse
//         ? await moduleServices.fetchModulesByCourse(selectedCourse)
//         : await moduleServices.fetchAllCourseModules();
//       setModules(data || []);
//     } catch {
//       setMessage({ type: "error", text: "Update failed!" });
//     }
//   };

//   // Delete module
//   const handleDelete = async (module_id) => {
//     if (!window.confirm("Delete this module?")) return;
//     try {
//       await moduleServices.deleteCourseModule(selectedCourse, module_id);
//       setMessage({ type: "success", text: "Module deleted!" });
//       const data = selectedCourse
//         ? await moduleServices.fetchModulesByCourse(selectedCourse)
//         : await moduleServices.fetchAllCourseModules();
//       setModules(data || []);
//     } catch {
//       setMessage({ type: "error", text: "Delete failed!" });
//     }
//   };

//   if (loading) return <p className="module-loading">Loading modules...</p>;

//   return (
//     <div className="module-container">
//       <h2>Module Management</h2>

//       {message.text && <div className={`module-message ${message.type}`}>{message.text}</div>}

//       {/* Course selection */}
//       <div className="module-dropdown">
//         <select
//           className="module-course-dropdown"
//           value={selectedCourse}
//           onChange={handleCourseChange}
//         >
//           <option value="">All Courses</option>
//           {courses.map(c => (
//             <option key={c.course_id} value={c.course_id}>
//               {c.course_name} - {c.course_id}
//             </option>
//           ))}
//         </select>

//         {!adding && !editing && (
//           <button className="module-add-button" onClick={() => setAdding(true)}>Add Module</button>
//         )}
//       </div>

//       {/* Add Form */}
//       {adding && (
//         <form onSubmit={handleAddSubmit} className="module-form-add">
//           <input className="module-input module-id" type="text" name="module_id" placeholder="Module ID" value={addForm.module_id} onChange={handleAddChange} required />
//           <input className="module-input module-name" type="text" name="module_name" placeholder="Module Name" value={addForm.module_name} onChange={handleAddChange} required />
//           <input className="module-input course-id" type="text" name="course_id" placeholder="Course ID" value={addForm.course_id} readOnly />
//           <input className="module-input course-name" type="text" name="course_name" placeholder="Course Name" value={addForm.course_name} readOnly />
//           <button type="submit" className="module-submit-button">Add</button>
//           <button type="button" className="module-cancel-button" onClick={() => setAdding(false)}>Cancel</button>
//         </form>
//       )}

//       {/* Edit Form */}
//       {editing && (
//         <form onSubmit={handleUpdateSubmit} className="module-form-edit">
//           <input className="module-input module-id" type="text" name="module_id" value={updateForm.module_id} disabled />
//           <input className="module-input module-name" type="text" name="module_name" value={updateForm.module_name} onChange={handleUpdateChange} required />
//           <input className="module-input course-id" type="text" name="course_id" value={updateForm.course_id} readOnly />
//           <input className="module-input course-name" type="text" name="course_name" value={updateForm.course_name} readOnly />
//           <button type="submit" className="module-submit-button">Update</button>
//           <button type="button" className="module-cancel-button" onClick={() => setEditing(false)}>Cancel</button>
//         </form>
//       )}

//       {/* Modules Table */}
//       {modules.length === 0 ? (
//         <p className="module-no-data">No modules found.</p>
//       ) : (
//         <table className="module-table">
//         <thead>
//           <tr>
//             <th className="col-id">Module ID</th>
//             <th className="col-name">Module Name</th>
//             <th className="col-course-id">Course ID</th>
//             <th className="col-course-name">Course Name</th>
//             <th className="col-actions">Actions</th>
//           </tr>
//         </thead>

//           <tbody>
//             {modules.map(mod => (
//               <tr key={mod.module_id}>
//                 <td>{mod.module_id}</td>
//                 <td>{mod.module_name}</td>
//                 <td>{mod.course_id}</td>
//                 <td>{mod.course_name}</td>
//                 <td className="module-action-buttons">
//                   <button className="module-edit-button" onClick={() => startEdit(mod)}>Edit</button>
//                   <button className="module-delete-button" onClick={() => handleDelete(mod.module_id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load courses
  useEffect(() => {
    async function loadCourses() {
      const data = await courseService.fetchAllCourses();
      setCourses(data || []);
    }
    loadCourses();
  }, []);

  // Load modules
  useEffect(() => {
    loadModules();
  }, [selectedCourse]);

  const loadModules = async () => {
    setLoading(true);
    const data = !selectedCourse
      ? await moduleServices.fetchAllCourseModules()
      : await moduleServices.fetchModulesByCourse(selectedCourse);
    setModules(data || []);
    setLoading(false);
  };

  // Handle course selection
  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);

    const selected = courses.find(c => c.course_id === courseId);
    setAddForm(prev => ({
      ...prev,
      course_id: selected?.course_id || "",
      course_name: selected?.course_name || "",
    }));

    setCurrentPage(1); // Reset to first page on course change
  };

  // Add module
  const handleAddChange = (e) => setAddForm({ ...addForm, [e.target.name]: e.target.value });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await moduleServices.addCourseModule(addForm);
      setAdding(false);
      setMessage({ type: "success", text: "Module added!" });
      loadModules();
    } catch {
      setMessage({ type: "error", text: "Add failed!" });
    }
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
      loadModules();
    } catch {
      setMessage({ type: "error", text: "Update failed!" });
    }
  };

  // Delete module
  const handleDelete = async (module_id) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      await moduleServices.deleteCourseModule(selectedCourse, module_id);
      setMessage({ type: "success", text: "Module deleted!" });
      loadModules();
    } catch {
      setMessage({ type: "error", text: "Delete failed!" });
    }
  };

  if (loading) return <p className="module-loading">Loading modules...</p>;

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentModules = modules.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(modules.length / itemsPerPage);

  return (
    <div className="module-container">
      <h2>Module Management</h2>

      {message.text && <div className={`module-message ${message.type}`}>{message.text}</div>}

      {/* Course selection */}
      <div className="module-dropdown">
        <select
          className="module-course-dropdown"
          value={selectedCourse}
          onChange={handleCourseChange}
        >
          <option value="">All Courses</option>
          {courses.map(c => (
            <option key={c.course_id} value={c.course_id}>
              {c.course_name} - {c.course_id}
            </option>
          ))}
        </select>

        {!adding && !editing && (
          <button className="module-add-button" onClick={() => setAdding(true)}>Add Module</button>
        )}
      </div>

      {/* Add Form */}
      {adding && (
        <form onSubmit={handleAddSubmit} className="module-form-add">
          <input className="module-input module-id" type="text" name="module_id" placeholder="Module ID" value={addForm.module_id} onChange={handleAddChange} required />
          <input className="module-input module-name" type="text" name="module_name" placeholder="Module Name" value={addForm.module_name} onChange={handleAddChange} required />
          <input className="module-input course-id" type="text" name="course_id" placeholder="Course ID" value={addForm.course_id} readOnly />
          <input className="module-input course-name" type="text" name="course_name" placeholder="Course Name" value={addForm.course_name} readOnly />
          <button type="submit" className="module-submit-button">Add</button>
          <button type="button" className="module-cancel-button" onClick={() => setAdding(false)}>Cancel</button>
        </form>
      )}

      {/* Edit Form */}
      {editing && (
        <form onSubmit={handleUpdateSubmit} className="module-form-edit">
          <input className="module-input module-id" type="text" name="module_id" value={updateForm.module_id} disabled />
          <input className="module-input module-name" type="text" name="module_name" value={updateForm.module_name} onChange={handleUpdateChange} required />
          <input className="module-input course-id" type="text" name="course_id" value={updateForm.course_id} readOnly />
          <input className="module-input course-name" type="text" name="course_name" value={updateForm.course_name} readOnly />
          <button type="submit" className="module-submit-button">Update</button>
          <button type="button" className="module-cancel-button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      )}

      {/* Modules Table */}
      {modules.length === 0 ? (
        <p className="module-no-data">No modules found.</p>
      ) : (
        <table className="module-table">
          <thead>
            <tr>
              <th className="col-id">Module ID</th>
              <th className="col-name">Module Name</th>
              <th className="col-course-id">Course ID</th>
              <th className="col-course-name">Course Name</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentModules.map(mod => (
              <tr key={mod.module_id}>
                <td>{mod.module_id}</td>
                <td>{mod.module_name}</td>
                <td>{mod.course_id}</td>
                <td>{mod.course_name}</td>
                <td className="module-action-buttons">
                  <button className="module-edit-button" onClick={() => startEdit(mod)}>Edit</button>
                  <button className="module-delete-button" onClick={() => handleDelete(mod.module_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {modules.length > itemsPerPage && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
