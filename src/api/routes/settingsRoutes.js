const express = require("express");
const { authController, globalErrorHandler } = require("../controllers");
const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

const router = express.Router();

router.use(authController.protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     Settings:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         userId:
 *           type: string
 *           description: "userId of created admin"
 *           example: "66d6b7df1a7a9270d7054920"
 *         languageName:
 *           type: string
 *           description: "Selected language name of user "
 *           example: "English"
 *
 *         languageCode:
 *           type: string
 *           description: " Code of selected language name of user"
 *           example: "en-us"
 *
 *         countryName:
 *           type: string
 *           description: "Selected country name of user"
 *           example: "nepal"
 *
 *         countryCode:
 *           type: string
 *           description: "Code of selected country name of user"
 *           example: "977"
 *
 *         timeformat:
 *           type: string
 *           description: "Time format to select either 12h or 24h"
 *           example: "12h"
 *
 *         timezone:
 *           type: string
 *           description: "Time zone selection"
 *           example: "Nepal-Time"
 *
 *         notification:
 *           type: boolean
 *           description: "Enable or Disable setting notification"
 *           example: "true"
 *
 *         showNotification:
 *           type: string
 *           description: "when to show the notification before the event occurs"
 *           example: "1 minute before event"
 *
 *         shareCalenders:
 *           type: string
 *           description: "Give access to share cakenders with others with: view only or can edit option"
 *           example: "view_only"
 */

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: The settings managing API
 */

/**
 * @swagger
 * /api/v1/settings/{userId}:
 *   get:
 *     summary: Retrieve the current user's settings.
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *            type: string
 *         required: true
 *         description: The registered userId
 *     responses:
 *       200:
 *         description: Successfully fetched data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "Success"
 *                 settings:
 *                   type: object
 *                   properties:
 *                     language:
 *                       type: object
 *                       properties:
 *                         languageName:
 *                           type: string
 *                           example: "German"
 *                         languageCode:
 *                           type: string
 *                           example: "Gn"
 *                     country:
 *                       type: object
 *                       properties:
 *                         countryName:
 *                           type: string
 *                           example: "India"
 *                         countryCode:
 *                           type: integer
 *                           example: 999
 *                     _id:
 *                       type: string
 *                       example: "66d81fc929971039d20cd9da"
 *                     userId:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["66d81fc829971039d20cd9d8"]
 *                     timeformat:
 *                       type: string
 *                       example: "12h"
 *                     timezone:
 *                       type: string
 *                       example: "India-Time"
 *                     notification:
 *                       type: boolean
 *                       example: false
 *                     showNotification:
 *                       type: string
 *                       example: "2 minute before"
 *                     shareCalenders:
 *                       type: string
 *                       example: "view_only"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Invalid userID
 */

router.get("/:id", getSettings);

/**
 * @swagger
 * /api/v1/settings/{userId}:
 *   patch:
 *     summary: Update the current user's settings.
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The register user ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: object
 *                 properties:
 *                   languageName:
 *                     type: string
 *                     example: "Hindi"
 *                   languageCode:
 *                     type: string
 *                     example: "Hn"
 *               country:
 *                 type: object
 *                 properties:
 *                   countryName:
 *                     type: string
 *                     example: "India"
 *                   countryCode:
 *                     type: integer
 *                     example: 999
 *               timeformat:
 *                 type: string
 *                 example: "12h"
 *               timezone:
 *                 type: string
 *                 example: "nepal-time"
 *               notification:
 *                 type: boolean
 *                 example: true
 *               showNotificationTime:
 *                 type: string
 *                 example: "1 minute before event"
 *               shareCalenders:
 *                 type: string
 *                 example: "view_only"
 *
 *     responses:
 *       200:
 *         description: Successfully Updated
 *       400:
 *         description: Invalid userID
 */

router.patch("/:id", updateSettings);

// Handle Errors
router.route("*").all(globalErrorHandler);

module.exports = router;
