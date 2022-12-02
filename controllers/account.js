const bcryptjs = require("bcryptjs");
const {
  selectAccountByEmail,
  selectAccountByUsername,
  insertAccount,
  selectAllAccount,
  selectAccountById,
  selectAccountByUsernameNotById,
  selectAccountByEmailNotById,
  updateAccountData,
  deleteAccountById,
} = require("../models/account");
const { ReplaceToStartUpperCase } = require("../utils/replace");
const accountSchema = require("../models/schema/account");
const Response = require("../helpers/response");

exports.createAccount = async (req, res) => {
  let { name, username, email, password } = req.body;
  name = ReplaceToStartUpperCase(name);
  username = username.toLowerCase();

  try {
    if (!name) {
      return res.json(
        Response(false, 400, `Name is Required`, {
          name: "name",
        })
      );
    }

    if (!username) {
      return res.json(
        Response(false, 400, `Username is Required`, {
          name: "username",
        })
      );
    }

    if (!email) {
      return res.json(
        Response(false, 400, `Email is Required`, {
          name: "email",
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

    const resultUsername = await selectAccountByUsername(username);
    if (resultUsername.length > 0) {
      return res.json(
        Response(false, 400, `Username Already`, {
          name: "username",
        })
      );
    }

    const resultEmail = await selectAccountByEmail(email);
    if (resultEmail.length > 0) {
      return res.json(
        Response(false, 400, `Email Already`, {
          name: "email",
        })
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);
    const result = await insertAccount(name, username, email, hashPassword);
    if (result.insertId) {
      return res.json(Response(true, 201, "Added Teams Successfully", {}));
    }
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.getAllAccount = async (req, res) => {
  try {
    const result = await selectAllAccount();
    if (!result.length > 0) {
      return res.json(Response(true, 204, "Get All Account Successfully", {}));
    }

    const data = [];
    result.forEach((d) => {
      let newObj = {};
      newObj[accountSchema[Object.keys(d)[0]]] = d.account_id;
      newObj[accountSchema[Object.keys(d)[1]]] = d.name;
      newObj[accountSchema[Object.keys(d)[2]]] = d.username;
      newObj[accountSchema[Object.keys(d)[3]]] = d.email;
      data.push(newObj);
    });
    return res.json(
      Response(true, 200, "Get All Account Successfully", {
        data,
      })
    );
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.getAccountById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await selectAccountById(id);
    if (!result.length) {
      return res.json(Response(false, 400, "Get Account Not Found", {}));
    }

    let newObj = {};
    newObj[accountSchema[Object.keys(result[0])[0]]] = result[0].account_id;
    newObj[accountSchema[Object.keys(result[0])[1]]] = result[0].name;
    newObj[accountSchema[Object.keys(result[0])[2]]] = result[0].username;
    newObj[accountSchema[Object.keys(result[0])[3]]] = result[0].email;

    return res.json(Response(true, 200, "Get Account Successfully", newObj));
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.updateAccount = async (req, res) => {
  const { id } = req.params;
  let { name, username, email, password } = req.body;
  name = ReplaceToStartUpperCase(name);
  username = username.toLowerCase();

  try {
    if (!name) {
      return res.json(
        Response(false, 400, `Name is Required`, {
          name: "name",
        })
      );
    }

    if (!username) {
      return res.json(
        Response(false, 400, `Username is Required`, {
          name: "username",
        })
      );
    }

    if (!email) {
      return res.json(
        Response(false, 400, `Email is Required`, {
          name: "email",
        })
      );
    }

    const result = await selectAccountById(id);
    if (!result.length) {
      return res.json(Response(false, 400, "Get Account Not Found", {}));
    }

    const resultUsername = await selectAccountByUsernameNotById(username, id);
    if (resultUsername.length > 0) {
      return res.json(
        Response(false, 400, `Username Already`, {
          name: "username",
        })
      );
    }

    const resultEmail = await selectAccountByEmailNotById(email, id);
    if (resultEmail.length > 0) {
      return res.json(
        Response(false, 400, `Email Already`, {
          name: "email",
        })
      );
    }

    if (!password) {
      password = "";
    } else {
      const salt = await bcryptjs.genSalt(10);
      password = await bcryptjs.hash(password, salt);
    }

    const resultUpdate = await updateAccountData(
      id,
      name,
      username,
      email,
      password
    );
    if (resultUpdate.insertId === 0) {
      return res.json(Response(true, 201, "Updated Account Successfully", {}));
    }
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};

exports.deleteAccount = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await selectAccountById(id);
    if (!result.length) {
      return res.json(Response(false, 400, "Get Account Not Found", {}));
    }

    const resultDelete = await deleteAccountById(id);
    if (resultDelete.insertId === 0) {
      return res.json(Response(true, 200, `Deleted Account Successfully`, {}));
    }
  } catch (err) {
    console.log("errr", err);
    const error = JSON.stringify(err, undefined, 2);
    return res.json(Response(false, 500, `Error`, JSON.parse(error)));
  }
};
