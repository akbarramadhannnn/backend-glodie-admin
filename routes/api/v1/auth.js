const router = require("express").Router();
const { getToken } = require("../../../middleware/auth");
const { login, getAuth } = require("../../../controllers/auth");

router.get("/", getToken, getAuth);
router.post("/", login);

module.exports = router;
