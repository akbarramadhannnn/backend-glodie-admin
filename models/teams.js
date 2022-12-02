const poolConnection = require("../config/connection");

exports.insertTeams = async (name, title, twitter, linkedin, desc, path) => {
  const sql = `INSERT INTO teams (name, title, twitter_link, linkedin_link, description, path_photo_profile) values ('${name}', '${title}', '${twitter}', '${linkedin}', '${desc}', '${path}')`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectTeamsByName = async (name) => {
  const sql = `SELECT * FROM teams WHERE name = '${name}'`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectAllTeams = async () => {
  const sql = `SELECT * FROM teams`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectTeamsById = async (id) => {
  const sql = `SELECT * FROM teams WHERE teams_id = '${id}'`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.deleteTeamsById = async (id) => {
  const sql = `DELETE FROM teams WHERE teams_id = ${id}`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectTeamsByNameNotById = async (name, id) => {
  const sql = `SELECT teams_id, name FROM teams WHERE name = '${name}' AND NOT teams_id = ${id}`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.updateTeamsData = async (
  id,
  name,
  title,
  twitter,
  linkedin,
  desc,
  path
) => {
  let sql;
  if (!path) {
    sql = `UPDATE teams SET name = '${name}', title = '${title}', twitter_link = '${twitter}', linkedin_link = '${linkedin}', description = '${desc}' WHERE teams_id = ${id}`;
  } else {
    sql = `UPDATE teams SET name = '${name}', title = '${title}', twitter_link = '${twitter}', linkedin_link = '${linkedin}', description = '${desc}', path_photo_profile = '${path}' WHERE teams_id = ${id}`;
  }
  const result = await poolConnection.query(sql);
  return result[0];
};
