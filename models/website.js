const poolConnection = require("../config/connection");

exports.selectWebsiteByMenuName = async (menu) => {
  const sql = `SELECT * FROM website_content WHERE menu_name = '${menu}'`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.insertMultipleWebsiteContent = async (data) => {
  var sql = "INSERT INTO website_content (menu_name, key_name, value) VALUES ?";
  const result = await poolConnection.query(sql, [data]);
  return result[0];
};

exports.updateMultipleWebsiteContent = async (data) => {
  var sql =
    "UPDATE website_content SET menu_name = ? , key_name = ? , value = ? WHERE website_content_id = ?";
  const result = await poolConnection.query(sql, data);
  return result[0];
};

exports.updateSingleWebsiteContent = async (menuName, keyName, value, id) => {
  const sql = `UPDATE website_content SET menu_name = '${menuName}', key_name = '${keyName}', value = '${value}' WHERE website_content_id = '${id}'`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.getWebsiteContentByMenuNameAndKeyName = async (menuName, keyName) => {
  const sql = `SELECT * FROM website_content WHERE menu_name = '${menuName}' AND key_name = '${keyName}'`;
  const result = await poolConnection.query(sql);
  return result[0];
};
