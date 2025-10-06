const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");

router.use(checkAuthentication);

// ===== Get all modules with assigned courses =====
router.get("/get-all-modules", checkRoles(["admin","coordinator"]), (req,res)=>{
    const sql = `
        SELECT m.module_id, m.module_name, GROUP_CONCAT(c.course_name) AS courses
        FROM module m
        LEFT JOIN course_module cm ON m.module_id = cm.module_id
        LEFT JOIN course c ON cm.course_id = c.course_id
        GROUP BY m.module_id, m.module_name
        ORDER BY m.module_id
    `;
    pool.query(sql, (err, results)=>{
        if(err) return res.send(errorResponse(err));
        return res.send(successResponse(results));
    });
});


// ===== Add Module =====
router.post("/add-module", checkRoles(["admin"]), async (req, res) => {
    const { module_id, module_name } = req.body;

    if (!module_id || !module_name)
        return res.send(errorResponse("Module ID and Module Name are required"));

    const sql = `INSERT INTO module (module_id, module_name) VALUES (?, ?)`;

    try {
        await pool.execute(sql, [module_id, module_name]);
        res.send(successResponse({ module_id, module_name }));
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY")
            return res.send(errorResponse("Module ID already exists"));
        res.send(errorResponse(err));
    }
});


// ===== Update a module =====
router.put("/update-module/:module_id", checkRoles(["admin"]), (req,res)=>{
    const { module_name } = req.body;
    const { module_id } = req.params;
    const sql = `UPDATE module SET module_name=? WHERE module_id=?`;
    pool.execute(sql, [module_name, module_id], (err,result)=>{
        if(err) return res.send(errorResponse(err));
        if(result.affectedRows===0) return res.send(errorResponse("Module not found"));
        return res.send(successResponse({ module_id, module_name }));
    });
});


// ===== Delete a module =====
router.delete("/delete-module/:module_id", checkRoles(["admin"]), (req,res)=>{
    const { module_id } = req.params;
    const deleteCourseModule = `DELETE FROM course_module WHERE module_id=?`;
    const deleteModule = `DELETE FROM module WHERE module_id=?`;

    pool.execute(deleteCourseModule, [module_id], (err)=>{
        if(err) return res.send(errorResponse(err));
        pool.execute(deleteModule, [module_id], (err2,result)=>{
            if(err2) return res.send(errorResponse(err2));
            if(result.affectedRows===0) return res.send(errorResponse("Module not found"));
            return res.send(successResponse("Module deleted successfully"));
        });
    });
});


// ===== Assign module to course =====
router.post("/assign-module-to-course", checkRoles(["admin"]), (req, res) => {
    const { module_id, course_id } = req.body;

    if (!module_id || !course_id)
        return res.send(errorResponse("Module ID or Course ID missing"));

    // Get module name
    pool.query("SELECT module_name FROM module WHERE module_id=?", [module_id], (err, moduleResult) => {
        if (err) return res.send(errorResponse(err.message));
        if (!moduleResult.length) return res.send(errorResponse("Module not found"));

        const module_name = moduleResult[0].module_name;

        // Get course name
        pool.query("SELECT course_name FROM course WHERE course_id=?", [course_id], (err2, courseResult) => {
            if (err2) return res.send(errorResponse(err2.message));
            if (!courseResult.length) return res.send(errorResponse("Course not found"));

            const course_name = courseResult[0].course_name;

            // Insert into course_module
            const sql = `INSERT INTO course_module (course_id, module_id, course_name, module_name) VALUES (?, ?, ?, ?)`;
            pool.execute(sql, [course_id, module_id, course_name, module_name], (err3) => {
                if (err3) {
                    if (err3.code === "ER_DUP_ENTRY") {
                        return res.send(errorResponse("Module already assigned to this course"));
                    }
                    return res.send(errorResponse(err3.message));
                }

                res.send(successResponse({ course_id, module_id, course_name, module_name }));
            });
        });
    });
});


// ===== Remove module from a course =====
router.delete("/delete-assigned-module", checkRoles(["admin"]), (req,res)=>{
    const { module_id, course_id } = req.body;
    const sql = `DELETE FROM course_module WHERE course_id=? AND module_id=?`;
    pool.execute(sql,[course_id,module_id],(err,result)=>{
        if(err) return res.send(errorResponse(err));
        if(result.affectedRows===0) return res.send(errorResponse("Assignment not found"));
        return res.send(successResponse("Module removed from course"));
    });
});


// ===== Get modules by course =====
router.get("/course/:course_id/modules", checkRoles(["admin","coordinator"]), (req, res) => {
    const { course_id } = req.params;
    const sql = `
        SELECT m.module_id, m.module_name
        FROM module m
        JOIN course_module cm ON m.module_id = cm.module_id
        WHERE cm.course_id = ?
    `;
    pool.query(sql, [course_id], (err, results)=>{
        if(err) return res.send(errorResponse(err));
        return res.send(successResponse(results));
    });
});



module.exports = router;
