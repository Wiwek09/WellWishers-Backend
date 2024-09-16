const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./src/app");
const { Event } = require("./src/api/models");
const { scheduleEventEmail } = require("./src/api/utils/cronScheduler");

dotenv.config({ path: ".env" });

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

const connect = async () => {
  try {
    await mongoose.connect(
      process.env.DATABASE_STRING || "mongodb://127.0.0.1:27017/wellwisher"
    );
    console.log("Connected to WellWisher Database!");

    // Schedule emails for existing events
    const events = await Event.find();
    events.forEach((event) => {
      scheduleEventEmail(event);
    });
  } catch (error) {
    console.log(error);
  }
};

const port = process.env.PORT || 6000;

app.listen(port, () => {
  connect();
  console.log(`Server is working on port ${port}`);
});

// Start cron scheduler
// (Assuming you have a function to start it in your cronScheduler)
// startCronScheduler();

// Listen for warnings
process.on("warning", (e) => console.warn(e.stack));
