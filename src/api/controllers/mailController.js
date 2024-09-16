const ejs = require("ejs");
const path = require("path");
const moment = require("moment");
const mailHandler = require("../utils/mailHandler");
const { Event } = require("../models");

const sendEmailForEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId)
      .populate("invites")
      .populate("message");

    if (!event) {
      console.log("Event not found");
      return;
    }

    // console.log("Found event:", event);
    // console.log("Event date:", event.messagedate);

    const formattedDate = moment
      .utc(event.eventdate)
      .format("dddd, MMMM Do YYYY, h:mm:ss a");

    // console.log("Formatted Date:", formattedDate);

    const emailTemplate = `
      <h1>Event Invitation: ${event.name}</h1>
      <p>${event.message.content}</p>
      <p>Event Date:${formattedDate}</p>
    `;

    // console.log("Email Template:", emailTemplate);

    for (const invitee of event.invites) {
      console.log("Sending email to:", invitee.email);
      await mailHandler.sendMail({
        recipientEmail: invitee.email,
        subject: `Event Invitation: ${event.name}`,
        emailTemplate,
      });
    }

    console.log("Event invitations sent successfully");
  } catch (error) {
    console.error("Error in sendEmailForEvent:", error);
  }
};

module.exports = { sendEmailForEvent };
