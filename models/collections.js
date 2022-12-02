const poolConnection = require("../config/connection");

exports.selectAllCollections = async () => {
  const sql = `SELECT * FROM collections`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.insertCollections = async (name, slug, urlLink, pathImage) => {
  const sql = `INSERT INTO collections (name, slug, url_link, path_image) values ("${name}", "${slug}", "${urlLink}", "${pathImage}")`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectCollectionsByName = async (name) => {
  const sql = `SELECT name FROM collections WHERE name = "${name}"`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectCollectionsById = async (id) => {
  const sql = `SELECT * FROM collections WHERE collections_id = ${id}`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.selectCollectionsByNameNotById = async (name, id) => {
  const sql = `SELECT collections_id, name FROM collections WHERE name = "${name}" AND NOT collections_id = ${id}`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.updateCollectionsData = async (id, name, slug, urlLink, pathImage) => {
  const sql = `UPDATE collections SET name = "${name}", slug = "${slug}", url_link = "${urlLink}", path_image = "${pathImage}" WHERE collections_id = ${id}`;
  const result = await poolConnection.query(sql);
  return result[0];
};

exports.deleteCollectionsDataById = async (id) => {
  const sql = `DELETE FROM collections WHERE collections_id = ${id}`;
  const result = await poolConnection.query(sql);
  return result[0];
};
