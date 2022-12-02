const jwt = require("jsonwebtoken");
const fs = require("fs");
const privateKey = fs.readFileSync("key/private.key", "utf8");
const publicKey = fs.readFileSync("key/public.key", "utf8");
const Response = require("../helpers/response");

exports.signJWT = (payload) => {
  const token = jwt.sign(payload, privateKey, {
    expiresIn: "1h", //Hours
    // expiresIn: "60s", //1 menit
    // expiresIn: "3s", // Seconds
    algorithm: "RS256",
  });
  return token;
};

exports.getToken = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) return res.json(Response(false, 401, "No Authenticate", {}));

  token = token.replace("Bearer ", "");

  jwt.verify(token, publicKey, (err, decode) => {
    if (err) return res.json(Response(false, 401, "No Authenticate", {}));
    req.userData = decode;
    next();
  });
};
