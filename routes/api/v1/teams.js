const router = require("express").Router();
const {
  createTeams,
  getAllTeams,
  getTeamsById,
  updateTeams,
  deleteTeams,
} = require("../../../controllers/teams");
const { getToken } = require("../../../middleware/auth");

router.get("/", getToken, getAllTeams);
router.post("/", getToken, createTeams);
router.get("/:id", getToken, getTeamsById);
router.put("/:id", getToken, updateTeams);
router.delete("/:id", getToken, deleteTeams);

module.exports = router;
