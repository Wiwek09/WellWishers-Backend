const express = require("express");
const { eventController } = require("../controllers");
const {
  scheduleEvent,
  pastEvent,
  getAllEvent,
} = require("../controllers/eventController");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *         - messagedate
 *         - eventdate
 *       properties:
 *         name:
 *           type: string
 *           description: "Name of the event"
 *           example: "Annual Conference"
 *         invites:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: "List of contacts invited to the event"
 *           example: ["60f8d8d2f2f4a35a343d8e0d", "60f8d8d2f2f4a35a343d8e0e"]
 *         messagedate:
 *           type: string
 *           format: date
 *           description: "Date when the message was sent"
 *           example: "2024-08-25"
 *         eventdate:
 *           type: string
 *           format: date
 *           description: "Date of the event"
 *           example: "2024-09-01"
 *         message:
 *           type: string
 *           format: uuid
 *           description: "ID of the message associated with the event"
 *           example: "60f8d8d2f2f4a35a343d8e0f"
 */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management API
 */

/**
 * @swagger
 * /api/v1/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Event"
 *     responses:
 *       201:
 *         description: Event successfully created
 *       400:
 *         description: Bad request
 */
router.route("/").post(eventController.createEvent);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   delete:
 *     summary: Delete an event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the event to delete
 *     responses:
 *       200:
 *         description: Event successfully deleted
 *       404:
 *         description: Event not found
 */
router.route("/:id").delete(eventController.deleteEvent);

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Event"
 */
router.get("/", getAllEvent);

/**
 * @swagger
 * /api/v1/events/scheduled:
 *   get:
 *     summary: Get all scheduled events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of scheduled events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Event"
 */
router.get("/scheduled", scheduleEvent);

/**
 * @swagger
 * /api/v1/events/past:
 *   get:
 *     summary: Get all past events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of past events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Event"
 */
router.get("/past", pastEvent);

module.exports = router;
