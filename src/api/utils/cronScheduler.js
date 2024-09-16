const cron = require("node-cron");
const { sendEmailForEvent } = require("../controllers/mailController");
const moment = require("moment-timezone");
const { Event } = require("../models");

const scheduleEventEmail = (event) => {
  const messagedate = moment.utc(event.messagedate);
  console.log("Event Date (UTC):", messagedate);

  const minute = messagedate.minutes();
  const hour = messagedate.hours();
  const day = messagedate.date();
  const month = messagedate.month() + 1;

  const cronExpression = `${minute} ${hour} ${day} ${month} *`;
  // const cronExpression = "* * * * *";
  console.log(cronExpression);
  try {
    cron.schedule(
      cronExpression,
      async () => {
        try {
          console.log("Executing scheduled task...");
          await sendEmailForEvent(event._id);
          console.log(`Event invitations sent for event ID: ${event._id}`);
        } catch (error) {
          console.error(
            `Failed to send emails for event ID: ${event._id}`,
            error
          );
        }
      },
      {
        timezone: "Asia/Kathmandu",
      }
    );
  } catch (error) {
    console.error("Failed to schedule the cron job:", error);
  }
};

module.exports = { scheduleEventEmail };
