const router = require("express").Router();
const {
  getAllCollections,
  createCollections,
  getCollectionsById,
  updateCollections,
  deleteCollections,
} = require("../../../controllers/collections");
const { getToken } = require("../../../middleware/auth");

router.get("/", getToken, getAllCollections);
router.post("/", getToken, createCollections);
router.get("/:id", getToken, getCollectionsById);
router.put("/:id", getToken, updateCollections);
router.delete("/:id", getToken, deleteCollections);

module.exports = router;
