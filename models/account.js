const poolConnection = require("../config/connection");

exports.insertAccount = async (name, username, email, password) => {
  const sql = `INSERT INTO account (name, username, email, password) values ("${name}", "${username}", "${email}", "${password}")`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectAccountByUsername = async (username) => {
  const sql = `SELECT * FROM account WHERE username = "${username}"`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectAccountByEmail = async (email) => {
  const sql = `SELECT * FROM account WHERE email = "${email}"`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectAllAccount = async () => {
  const sql = `SELECT account_id, name, username, email FROM account`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectAccountById = async (id) => {
  const sql = `SELECT account_id, name, username, email FROM account WHERE account_id = ${id}`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectAccountByUsernameNotById = async (username, id) => {
  const sql = `SELECT * FROM account WHERE username = "${username}" AND NOT account_id = ${id}`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectAccountByEmailNotById = async (email, id) => {
  const sql = `SELECT * FROM account WHERE email = "${email}" AND NOT account_id = ${id}`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.updateAccountData = async (id, name, username, email, password) => {
  let sql;
  if (!password) {
    sql = `UPDATE account SET name = "${name}", username = "${username}", email = "${email}" WHERE account_id = ${id}`;
  } else {
    sql = `UPDATE account SET name = "${name}", username = "${username}", email = "${email}", password = "${password}" WHERE account_id = ${id}`;
  }
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.deleteAccountById = async (id) => {
  const sql = `DELETE FROM account WHERE account_id = ${id}`;
  const result = await poolConnection.query(sql);
  return result[0];
};
