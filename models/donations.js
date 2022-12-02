const poolConnection = require("../config/connection");

exports.insertDonations = async (title, sertificate, glodie) => {
  const sql = `INSERT INTO donations (title, sertificate_image_path, glodie_image_path) values ("${title}", "${sertificate}", "${glodie}")`;
  const result = await poolConnection.query(sql);
  return result[0];
};

// exports.selectDonationsByName = async (name) => {
//   const sql = `SELECT * FROM teams WHERE name = '${name}'`;
//   const result = await poolConnection.query(sql);
//   return result[0];
// };

exports.selectAllDonations = async () => {
  const sql = `SELECT * FROM donations`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectDonationsById = async (id) => {
  const sql = `SELECT * FROM donations WHERE donations_id = ${id}`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.deleteDonationsById = async (id) => {
  const sql = `DELETE FROM donations WHERE donations_id = ${id}`;
  const result = await poolConnection.query(sql);
  return result[0];
};

// exports.selectDonationsByNameNotById = async (name, id) => {
//   const sql = `SELECT teams_id, name FROM teams WHERE name = '${name}' AND NOT teams_id = ${id}`;
//   const result = await poolConnection.query(sql);
//   return result[0];
// };

exports.updateDonationsData = async (id, title, sertificate, glodie) => {
  const sql = `UPDATE donations SET title = "${title}", sertificate_image_path = "${sertificate}", glodie_image_path = "${glodie}" WHERE donations_id = ${id}`;
  const result = await poolConnection.query(sql);
  return result[0];
};
