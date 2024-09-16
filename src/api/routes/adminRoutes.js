const express = require("express");
const passport = require("passport");
const {
  adminController,
  authController,
  globalErrorHandler,
} = require("../controllers");
const { adminValidator } = require("../validations");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - email
 *         - username
 *       properties:
 *         username:
 *           type: string
 *           description: "Unique username of the admin"
 *           example: "adminUser123"
 *         email:
 *           type: string
 *           description: "Unique email address of the admin"
 *           example: "admin@example.com"
 *         password:
 *           type: string
 *           description: "Password of the admin"
 *           example: "Pass@1234"
 *         googleId:
 *           type: string
 *           description: "Google ID if the admin signed up using Google OAuth"
 *           example: "1234567890abcdef"
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: The admin managing API
 */

/**
 * @swagger
 * /api/v1/admins/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "Pass@1234"
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       400:
 *         description: Invalid credentials
 */
router
  .route("/login")
  .post(adminValidator.checkAdminExists, adminController.loginAdmin);

/**
 * @swagger
 * /api/v1/admins/signupToken:
 *   post:
 *     summary: Request a signup token
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Signup token sent
 */
router.route("/signupToken").post(adminController.requestSignupToken);

/**
 * @swagger
 * /api/v1/admins/signup:
 *   post:
 *     summary: Admin signup
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Admin"
 *     responses:
 *       201:
 *         description: Admin successfully signed up
 *       400:
 *         description: Validation error
 */
router
  .route("/signup")
  .post(adminValidator.validateAdminDetails(), adminController.signupAdmin);

/**
 * @swagger
 * /api/v1/admins/forgotPassword:
 *   post:
 *     summary: Forgot password
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Password reset token sent
 */
router
  .route("/forgotPassword")
  .post(authController.protect, authController.forgotPassword);

/**
 * @swagger
 * /api/v1/admins/resetPassword/{token}:
 *   patch:
 *     summary: Reset password
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "NewPass@1234"
 *     responses:
 *       200:
 *         description: Password successfully reset
 *       400:
 *         description: Invalid token
 */
router
  .route("/resetPassword/:token")
  .patch(authController.protect, authController.resetPassword);

/**
 * @swagger
 * /api/v1/admins/logout:
 *   post:
 *     summary: Logout admin
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

/**
 * @swagger
 * /api/v1/admins/google:
 *   get:
 *     summary: Google OAuth login
 *     tags: [Admin]
 *     responses:
 *       302:
 *         description: Redirected to Google for authentication
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/**
 * @swagger
 * /api/v1/admins/google/redirect:
 *   get:
 *     summary: Google OAuth redirect
 *     tags: [Admin]
 *     responses:
 *       302:
 *         description: Redirected after Google authentication
 */
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/");
});

/**
 * @swagger
 * /api/v1/admins/u/{id}:
 *   get:
 *     summary: Get admin profile
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin profile data
 *       404:
 *         description: Admin not found
 *   patch:
 *     summary: Update admin profile
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Admin"
 *     responses:
 *       200:
 *         description: Admin profile updated
 *       400:
 *         description: Validation error
 */
router
  .route("/u/:id")
  .get(authController.protect, adminController.getOneAdmin)
  .patch(authController.protect, adminController.updateAdmin);

/**
 * @swagger
 * /api/v1/admins/profile:
 *   get:
 *     summary: Get admin profile (logged-in user)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin profile data
 */
router.get("/profile", authController.protect, (req, res) => {
  res.render("profile", { admin: req.user });
});

// Handle Errors
router.route("*").all(globalErrorHandler);

module.exports = router;
