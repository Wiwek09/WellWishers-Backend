const express = require("express");

const mailController = require("../controllers/mailController");

const sendGrid = require("../utils/sendGrid");

const router = express.Router();

router.post("/:eventId/sendmail", mailController.sendEmailForEvent);

module.exports = router;
