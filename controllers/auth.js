const bcryptjs = require("bcryptjs");
const {
  selectAccountByEmail,
  selectAccountByUsername,
} = require("../models/account");
const accountSchema = require("../models/schema/account");
const Response = require("../helpers/response");
const { signJWT } = require("../middleware/auth");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username) {
      return res.json(
        Response(false, 400, `Username is Required`, {
          name: "username",
        })
      );
    }

    if (!password) {
      return res.json(
        Response(false, 400, `Password is Required`, {
          name: "password",
        })
      );
    }

    let isUsername = false;
    let userData;
    const resultUsername = await selectAccountByUsername(username);
    if (resultUsername.length > 0) {
      isUsername = true;
      userData = resultUsername[0];
    }

    const resultEmail = await selectAccountByEmail(username);
    if (resultEmail.length > 0) {
      isUsername = true;
      userData = resultEmail[0];
    }

    if (!isUsername) {
      return res.json(Response(false, 400, `Username / Password Salah`, {}));
    }

    const isUserPassword = await bcryptjs.compare(password, userData.password);

    if (!isUserPassword) {
      return res.json(Response(false, 400, `Username / Password Salah`, {}));
    }

    let payload = {};
    payload[accountSchema[Object.keys(userData)[0]]] = userData.account_id;
    payload[accountSchema[Object.keys(userData)[1]]] = userData.name;
    payload[accountSchema[Object.keys(userData)[2]]] = userData.username;
    payload[accountSchema[Object.keys(userData)[3]]] = userData.email;

    const token = signJWT(payload);
    return res.json(
      Response(true, 200, "Sign in Successfully", {
        token: token,
      })
    );
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.getAuth = async (req, res) => {
  const userData = req.userData;
  return res.json(Response(true, 200, "Authentication Successfully", userData));
};
