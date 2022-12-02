const { check } = require("express-validator");

exports.validationCreateCollections = [
  check("name").custom(async (value) => {
    if (!value) {
      throw new Error("Collection Name is Required");
    }
  }),
];
