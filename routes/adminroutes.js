const express = require("express");
const router = express.Router();
var midway = require('../middleware');
const admincontroller = require("../controllers/admincontroller")

router.post("/getUserDetail", midway.checkToken,admincontroller.getUserDetail)
router.post("/RegisterNewUser",midway.checkToken, admincontroller.RegisterNewUser)
router.post("/updateUser/:id",midway.checkToken, admincontroller.updateUser)
router.delete("/deleteUser/:id",midway.checkToken, admincontroller.deleteUser)
router.get("/getActiveUser",midway.checkToken, admincontroller.getActiveUser)
router.get("/getInActiveUser",midway.checkToken, admincontroller.getInActiveUser)
router.patch("/toggle-status/:id",midway.checkToken, admincontroller.toggle_status)
module.exports = router;