
// Hash existing passwords in the STAFF_TABLE
const getStaffSQL = `SELECT email, password FROM ${STAFF_TABLE}`;

pool.query(getStaffSQL, (err, results) => {
  if (err) {
    console.error("Error fetching staff:", err);
    process.exit(1);
  }

  results.forEach((staff) => {
    const { email, password } = staff;

    // Skip if already hashed
    if (password.startsWith("$2a$") || password.startsWith("$2b$") || password.startsWith("$2y$")) {
      console.log(`Already hashed: ${email}`);
      return;
    }

    const key = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, key);

    const updateSQL = `UPDATE ${STAFF_TABLE} SET password = ? WHERE email = ?`;
    pool.query(updateSQL, [hashPassword, email], (err, result) => {
      if (err) {
        console.error(`Error updating ${email}:`, err);
      } else {
        console.log(`Password hashed for ${email}`);
      }
    });
  });
});



/* run separate file 

filename-HashPassword.js

on terminal - node HashPassword.js

this will hash all previous stored plain password.

later u can delete it. no use. 


*/
