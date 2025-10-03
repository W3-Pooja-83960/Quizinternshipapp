// src/pages/Students/Students.js
import React, { useEffect, useState, useCallback } from "react";

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getCourses,
  getBatches,
} from "../Services/studentsServices";
import "../Styles/students.css";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courseFilter, setCourseFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  // modal / editing
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Fetch from API
  const fetchAll = async () => {
    try {
      setLoading(true);
      const studentsData = await getStudents(); // expected: array or wrapper
      const list = Array.isArray(studentsData) ? studentsData : [];
      setStudents(list);

      // try to fetch courses & batches; if backend doesn't have these endpoints,
      // derive them from students list
      try {
        const c = await getCourses();
        setCourses(Array.isArray(c) ? c : deriveCourses(list));
      } catch {
        setCourses(deriveCourses(list));
      }
      try {
        const token = localStorage.getItem("token");
        const b = await getBatches(token);
        setBatches(Array.isArray(b) ? b : deriveBatches(list));
      } catch {
        setBatches(deriveBatches(list));
      }

      setLoading(false);
    } catch (err) {
      console.error("fetchAll error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derive helpers (if no separate endpoints)
  const deriveCourses = (list) =>
    [...new Set(list.map((s) => s.courseName || s.course_id).filter(Boolean))].map((c) =>
      typeof c === "object" ? c : { course_id: c, courseName: c }
    );

  const deriveBatches = (list) =>
    [...new Set(list.map((s) => s.batchName || s.batch_id).filter(Boolean))].map((b) =>
      typeof b === "object" ? b : { batch_id: b, batchName: b }
    );

  // filter + search logic
  const applyFilters = useCallback(() => {
    let res = students;
    if (courseFilter) {
      res = res.filter((s) => (s.courseName || `${s.course_id}`) === courseFilter);
    }
    if (batchFilter) {
      res = res.filter((s) => (s.batchName || `${s.batch_id}`) === batchFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(
        (s) =>
          (s.firstName || "").toLowerCase().includes(q) ||
          (s.lastName || "").toLowerCase().includes(q) ||
          (s.prnNo || "").toString().toLowerCase().includes(q)
      );
    }
    setFiltered(res);
    setCurrentPage(1);
  }, [students, courseFilter, batchFilter, search]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Pagination slice
  const totalPages = Math.ceil(filtered.length / perPage);
  const currentList = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    try {
      await deleteStudent(id);
      // refresh list
      await fetchAll();
    } catch (err) {
      console.error("delete error:", err);
      alert("Failed to delete — see console");
    }
  };

  // open add modal
  const openAdd = () => {
    setEditStudent(null);
    setShowModal(true);
  };

  // open edit modal
  const openEdit = (s) => {
    setEditStudent(s);
    setShowModal(true);
  };

  // Save (Add or Update)
  const handleSave = async (formValues) => {
    try {
      if (editStudent) {
        await updateStudent(editStudent.student_id, formValues);
      } else {
        await createStudent(formValues);
      }
      setShowModal(false);
      await fetchAll();
    } catch (err) {
      console.error("save error:", err);
      alert("Save failed — check console");
    }
  };

  if (loading) return <div className="loading">Loading students...</div>;

  return (
    <div className="students-page">
    
      <div className="header-row">
        <h2>Students ({filtered.length})</h2>
        <div>
          <button className="btn-primary" onClick={openAdd}>+ Add Student</button>
        </div>
      </div>

      <div className="controls">
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.course_id ?? c.courseName} value={c.courseName ?? c.course_id}>
              {c.courseName ?? c.course_id}
            </option>
          ))}
        </select>

        <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}>
          <option value="">All Batches</option>
          {batches.map((b) => (
            <option key={b.batch_id ?? b.batchName} value={b.batchName ?? b.batch_id}>
              {b.batchName ?? b.batch_id}
            </option>
          ))}
        </select>

        <input
          className="search"
          placeholder="Search by name or PRN"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th><th>First</th><th>Last</th><th>Email</th><th>PRN</th><th>Course</th><th>Batch</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentList.length ? (
              currentList.map((s) => (
                <tr key={s.student_id}>
                  <td>{s.student_id}</td>
                  <td>{s.firstName}</td>
                  <td>{s.lastName}</td>
                  <td>{s.email}</td>
                  <td>{s.prnNo}</td>
                  <td>{s.courseName ?? s.course_id}</td>
                  <td>{s.batchName ?? s.batch_id}</td>
                  <td>
                    <button className="btn-edit" onClick={() => openEdit(s)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(s.student_id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8" style={{ textAlign: "center" }}>No students found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>Prev</button>
          <span>{currentPage} / {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <StudentModal
          onClose={() => { setShowModal(false); setEditStudent(null); }}
          onSave={handleSave}
          student={editStudent}
          courses={courses}
          batches={batches}
        />
      )}
    </div>
  );
}

/* ---------------------------
   StudentModal component
   --------------------------- */
function StudentModal({ onClose, onSave, student, courses, batches }) {
  const [firstName, setFirstName] = useState(student?.firstName || "");
  const [lastName, setLastName] = useState(student?.lastName || "");
  const [email, setEmail] = useState(student?.email || "");
  const [prnNo, setPrnNo] = useState(student?.prnNo || "");
  const [course_id, setCourseId] = useState(student?.course_id ?? student?.courseName ?? "");
  const [batch_id, setBatchId] = useState(student?.batch_id ?? student?.batchName ?? "");
  const [password, setPassword] = useState(""); // set only when creating/updating if needed

  const submit = (e) => {
    e.preventDefault();
    const payload = { firstName, lastName, email, prnNo, course_id, password };
    // backend expects course_id (not courseName) — if your derived courses contain course_id use that
    onSave(payload);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>{student ? "Edit Student" : "Add Student"}</h3>
        <form onSubmit={submit} className="modal-form">
          <div className="row">
            <input required placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <input required placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required placeholder="PRN" value={prnNo} onChange={(e) => setPrnNo(e.target.value)} />

          <div className="row">
            <select value={course_id} onChange={(e) => setCourseId(e.target.value)} required>
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.course_id ?? c.courseName} value={c.course_id ?? c.courseName}>
                  {c.courseName ?? c.course_id}
                </option>
              ))}
            </select>

            <select value={batch_id} onChange={(e) => setBatchId(e.target.value)} required>
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b.batch_id ?? b.batchName} value={b.batch_id ?? b.batchName}>
                  {b.batchName ?? b.batch_id}
                </option>
              ))}
            </select>
          </div>

          {/* optionally show password input for create or reset */}
          <input placeholder="Password (leave empty to keep unchanged)" value={password} onChange={(e) => setPassword(e.target.value)} />

          <div className="modal-actions">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}