const express = require("express");
const smsController = require("../controllers/smsController");

const router = express.Router();

router.route("/sendbirthdaysms").get(smsController.sendBirthdaySMS);

module.exports = router;
