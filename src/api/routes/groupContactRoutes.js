const express = require("express");
const {
  createGroupContact,
  updateGroupContact,
  deleteGroupContact,
  getAllGroupContacts,
  getSingleGroupContact,
} = require("../controllers/groupContactController.js");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       required:
 *         - groupName
 *       properties:
 *         groupName:
 *           type: string
 *           description: "Name of the group"
 *           example: "Family Group"
 *         contactIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: "List of contact IDs associated with the group"
 *           example: ["60f8d8d2f2f4a35a343d8e0d", "60f8d8d2f2f4a35a343d8e0e"]
 */

/**
 * @swagger
 * tags:
 *   name: GroupContacts
 *   description: Group contact management API
 */

/**
 * @swagger
 * /api/v1/groupContact:
 *   post:
 *     summary: Create a new group contact
 *     tags: [GroupContacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Group"
 *     responses:
 *       201:
 *         description: Group contact successfully created
 *       400:
 *         description: Bad request
 */
router.post("/", createGroupContact);

/**
 * @swagger
 * /api/v1/groupContact/{id}:
 *   patch:
 *     summary: Update a group contact by ID
 *     tags: [GroupContacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group contact to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Group"
 *     responses:
 *       200:
 *         description: Group contact successfully updated
 *       404:
 *         description: Group contact not found
 */
router.patch("/:id", updateGroupContact);

/**
 * @swagger
 * /api/v1/groupContact/{id}:
 *   delete:
 *     summary: Delete a group contact by ID
 *     tags: [GroupContacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group contact to delete
 *     responses:
 *       200:
 *         description: Group contact successfully deleted
 *       404:
 *         description: Group contact not found
 */
router.delete("/:id", deleteGroupContact);

/**
 * @swagger
 * /api/v1/groupContact:
 *   get:
 *     summary: Get all group contacts
 *     tags: [GroupContacts]
 *     responses:
 *       200:
 *         description: A list of group contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Group"
 */
router.get("/", getAllGroupContacts);

/**
 * @swagger
 * /api/v1/groupContact/{id}:
 *   get:
 *     summary: Get a single group contact by ID
 *     tags: [GroupContacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group contact to retrieve
 *     responses:
 *       200:
 *         description: Group contact details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Group"
 *       404:
 *         description: Group contact not found
 */
router.get("/:id", getSingleGroupContact);

module.exports = router;
