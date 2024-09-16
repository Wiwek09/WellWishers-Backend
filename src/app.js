const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const upload = require("./api/utils/multer.js");
const { globalErrorHandler } = require("./api/controllers");
const AppError = require("./api/utils/appError");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const {
  addEmailToQueue,
  sendEmailFromQueue,
} = require("./api/utils/mailQueue");

// Import Routers
const {
  adminRouter,
  mailRouter,
  contactRouter,
  eventRouter,
  groupContactRouter,
  settingsRouter,
} = require("./api/routes/");

require("./api/config/passport-setup");

const app = express();

// Set up session cookies
app.use(
  session({
    secret: process.env.Cookie_Session || "hehehe",
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Set up CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

// Set up a view engine
app.set("view engine", "ejs");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "WellWishers",
      description: "Invitation ",
      contact: {
        name: "BrandBuilder",
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
  },
  // ['.routes/*.js']
  apis: ["./src/api/routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use Routers
app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/mails", mailRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/groupContact", groupContactRouter);
app.use("/api/v1/settings", settingsRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// Export the app module
module.exports = app;
