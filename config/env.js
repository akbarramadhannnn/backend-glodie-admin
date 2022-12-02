const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  base_url:
    NODE_ENV === "local"
      ? "http://localhost:2022"
      : NODE_ENV === "stagging"
      ? "http://103.181.183.117:3022"
      : "http://103.181.183.117:4022",
  server: {
    port: NODE_ENV === "local" ? 2022 : NODE_ENV === "stagging" ? 3022 : 4022,
  },
  mysql: {
    host: NODE_ENV === "local" ? "localhost" : "103.181.183.117",
    port: 3306,
    user: NODE_ENV === "local" ? "root" : "pitik",
    password: NODE_ENV === "local" ? "123pitik" : "123pitik",
    database:
      NODE_ENV === "local"
        ? "dev_glodie"
        : NODE_ENV === "stagging"
        ? "stagging_glodie"
        : "prod_glodie",
  },
};
