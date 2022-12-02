const router = require("express").Router();
const {
  createDonations,
  getAllDonations,
  getDonationsById,
  updateDonations,
  deleteDonations,
} = require("../../../controllers/donations");
const { getToken } = require("../../../middleware/auth");

router.get("/", getToken, getAllDonations);
router.post("/", getToken, createDonations);
router.get("/:id", getToken, getDonationsById);
router.put("/:id", getToken, updateDonations);
router.delete("/:id", getToken, deleteDonations);

module.exports = router;
