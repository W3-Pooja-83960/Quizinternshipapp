const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const fs = require("fs");
const pool = require("../config/db"); 
const { QUESTION_BANK_TABLE } = require("../config");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { checkAuthentication, checkRoles } = require("../middlewares/checkAuthentication");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ===== Apply authentication to all routes =====
router.use(checkAuthentication);

// ===== CSV / Excel Bulk Upload =====
async function bulkInsertQuestions(rows) {
  const connection = await pool.promise().getConnection();
  try {
    await connection.beginTransaction();
    const CHUNK = 500;

    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);
      const values = chunk.map(r => [
        r.quiz_id, r.question_text, r.option_a || null,
        r.option_b || null, r.option_c || null, r.option_d || null,
        r.answer || null, r.marks || 1
      ]);
      const sql = `INSERT INTO ${QUESTION_BANK_TABLE} (quiz_id, question_text, option_a, option_b, option_c, option_d,answer, marks) VALUES ?`;
      await connection.query(sql, [values]);
    }

    await connection.commit();
    connection.release();
    return { success: true };
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw err;
  }
}

// ===== Bulk Upload Route =====
router.post("/upload", checkRoles(["admin","coordinator"]), upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send(errorResponse("No file uploaded"));

    const quizIdFromQuery = req.query.quizId ? parseInt(req.query.quizId) : null;
    const ext = (file.originalname || "").split(".").pop().toLowerCase();

    let rows = [];

    if (ext === "csv") {
      fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", row => rows.push(row))
        .on("end", async () => {
          try {
            const normalized = normalizeAndValidateRows(rows, quizIdFromQuery);
            await bulkInsertQuestions(normalized);
            fs.unlinkSync(file.path);
            return res.send(successResponse({ message: `${normalized.length} questions uploaded` }));
          } catch (err) {
            fs.unlinkSync(file.path);
            console.error(err);
            return res.status(500).send(errorResponse(err.message || "Error inserting questions"));
          }
        });
      return;
    }

    if (ext === "xls" || ext === "xlsx") {
      const workbook = xlsx.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      rows = xlsx.utils.sheet_to_json(sheet);

      try {
        const normalized = normalizeAndValidateRows(rows, quizIdFromQuery);
        await bulkInsertQuestions(normalized);
        fs.unlinkSync(file.path);
        return res.send(successResponse({ message: `${normalized.length} questions uploaded` }));
      } catch (err) {
        fs.unlinkSync(file.path);
        console.error(err);
        return res.status(500).send(errorResponse(err.message || "Error inserting questions"));
      }
    }

    fs.unlinkSync(file.path);
    return res.status(400).send(errorResponse("Unsupported file type. Use .csv or .xlsx"));
  } catch (err) {
    console.error(err);
    return res.status(500).send(errorResponse(err.message || "Upload failed"));
  }
});

// ===== Manual Add Route =====
router.post("/add",checkRoles(["admin"]), async (req, res) => {
  try {
    const { quiz_id, question_text, option_a, option_b, option_c, option_d, answer, marks } = req.body;

    if (!quiz_id || !question_text) {
      return res.status(400).send(errorResponse("quiz_id and question_text are required"));
    }

    const sql = `INSERT INTO ${QUESTION_BANK_TABLE} (quiz_id, question_text, option_a, option_b, option_c, option_d, answer, marks) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    pool.query(
      sql,
      [quiz_id, question_text, option_a || null, option_b || null, option_c || null, option_d || null, answer || null, marks || 1],
      (err, result) => {
        if (err) return res.status(500).send(errorResponse(err.message || "Failed to add question"));
        return res.send(successResponse({ message: "Question added successfully", question_id: result.insertId }));
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send(errorResponse(err.message || "Failed to add question"));
  }
});

// ===== Helper to normalize CSV/Excel rows =====
function normalizeAndValidateRows(rows, quizIdFromQuery = null) {
  return rows.map((r, idx) => {
    const qtext = (r.question_text || r.question || r.text || "").toString().trim();
    if (!qtext) throw new Error(`Missing question_text at row ${idx + 1}`);

    const quiz_id = quizIdFromQuery || (r.quiz_id ? parseInt(r.quiz_id) : null);
    if (!quiz_id) throw new Error(`Missing quiz_id for row ${idx + 1} (or pass quizId in query)`);

    return {
      quiz_id,
      question_text: qtext,
      option_a: r.option_a || r.a || null,
      option_b: r.option_b || r.b || null,
      option_c: r.option_c || r.c || null,
      option_d: r.option_d || r.d || null,
      answer: r.answer || r.answer || null,
      marks: r.marks ? parseInt(r.marks) : 1
    };
  });
}



module.exports = router;
