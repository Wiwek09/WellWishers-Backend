const express = require("express");
const {
  createContact,
  deleteContact,
  updateContact,
  getSingleContact,
  getAllContacts,
} = require("../controllers/contactController.js");
const upload = require("../utils/multer.js");

const { authController } = require("../controllers/index.js");
const { contactValidator } = require("../validations/index.js");

const router = express.Router();

// Middleware to protect routes
router.use(authController.protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - email
 *         - fullname
 *         - phone
 *         - dob
 *       properties:
 *         email:
 *           type: string
 *           description: "Unique email address of the contact"
 *           example: "contact@example.com"
 *         fullname:
 *           type: string
 *           description: "Full name of the contact"
 *           example: "John Doe"
 *         phone:
 *           type: string
 *           description: "Unique phone number of the contact"
 *           example: "1234567890"
 *         gender:
 *           type: string
 *           enum: ["male", "female", "other"]
 *           description: "Gender of the contact"
 *           example: "male"
 *         dob:
 *           type: string
 *           format: date
 *           description: "Date of birth of the contact"
 *           example: "1990-01-01"
 *         image:
 *           type: string
 *           description: "URL of the contact's image"
 *           example: "http://example.com/image.jpg"
 */

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: The contact managing API
 */

/**
 * @swagger
 * /api/v1/contact:
 *   get:
 *     summary: Returns the list of all the contacts
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: The list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Contact"
 */
router.get("/", getAllContacts);

/**
 * @swagger
 * /api/v1/contact:
 *   post:
 *     summary: Create a new contact
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/Contact"
 *     responses:
 *       201:
 *         description: The contact was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Contact"
 */
router.post("/", upload.single("image"), createContact);

/**
 * @swagger
 * /api/v1/contact/{id}:
 *   delete:
 *     summary: Delete a contact
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: The contact was successfully deleted
 *       404:
 *         description: The contact was not found
 */
router.delete("/:id", deleteContact);

/**
 * @swagger
 * /api/v1/contact/{id}:
 *   patch:
 *     summary: Update a contact
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Contact"
 *     responses:
 *       200:
 *         description: The contact was successfully updated
 *       404:
 *         description: The contact was not found
 */
router.patch(
  "/:id",
  contactValidator.validateContactDetails(true),
  updateContact
);

/**
 * @swagger
 * /api/v1/contact/{id}:
 *   get:
 *     summary: Get a single contact by ID
 *     tags: [Contact]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The contact ID
 *     responses:
 *       200:
 *         description: The contact details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Contact"
 *       404:
 *         description: The contact was not found
 */
router.get("/:id", getSingleContact);

module.exports = router;
