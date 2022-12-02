const { validationResult } = require("express-validator");
const Response = require("../../helpers/response");

const RunValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(
      Response(false, 400, errors.array()[0].msg, {
        name: errors.array()[0].param,
      })
    );
  }
  next();
};

module.exports = RunValidation;
