const router = require("express").Router();
const {
  createAccount,
  getAllAccount,
  getAccountById,
  updateAccount,
  deleteAccount,
} = require("../../../controllers/account");
const { getToken } = require("../../../middleware/auth");

router.get("/", getToken, getAllAccount);
router.post("/", createAccount);
router.get("/:id", getToken, getAccountById);
router.put("/:id", getToken, updateAccount);
router.delete("/:id", getToken, deleteAccount);

module.exports = router;
