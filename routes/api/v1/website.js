const router = require("express").Router();
const {
  getWebsiteByMenuName,
  createWebsiteByMenuName,
  updateWebsiteByMenuName,
} = require("../../../controllers/website");
const { getToken } = require("../../../middleware/auth");

router.get("/:menuName", getToken, getWebsiteByMenuName);
router.post("/:menuName", getToken, createWebsiteByMenuName);
router.put("/:menuName", getToken, updateWebsiteByMenuName);

module.exports = router;
