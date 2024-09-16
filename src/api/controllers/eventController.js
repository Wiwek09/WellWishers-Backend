const express = require("express");
const { Event } = require("../models");
const catchAsync = require("../utils/catchAsync");
const handleFactory = require("./handlerFactory");
const { Message } = require("../models");
const { scheduleEventEmail } = require("../utils/cronScheduler");
const moment = require("moment-timezone");
const AppError = require("../utils/appError.js");

const createEvent = catchAsync(async (req, res, next) => {
  const { name, invites, messagedate, eventdate, messageContent } = req.body;
  
  try {
    const messageDate = moment.utc(messagedate).tz("Asia/Kathmandu");
    const eventDate = moment.utc(eventdate).tz("Asia/Kathmandu");
    
    const message = await Message.create({ content: messageContent });

    const event = await Event.create({
      name,
      invites,
      messagedate: messageDate,
      eventdate: eventDate,
      message: message._id,
    });

    console.log("Created event:", event);

    res.status(201).json({
      status: "success",
      data: {
        event,
      },
    });
  } catch (err) {
    console.error("Error creating event:", err);
    return res.status(500).json({
      status: "failure",
      message: err.message,
    });
  }
});


const getAllEvent = catchAsync(async (req, res, next) => {
  const event = await Event.find();
  if (!event) return next(new AppError("No Events found", 404));
  res.status(200).json({
    success: true,
    event,
  });
});

//get future events
const scheduleEvent = catchAsync(async (req, res, next) => {
  const cursor = req.query.cursor || null;
  const perPage = parseInt(req.query.limit) || 3;

  let query = { eventdate: { $gt: new Date() } };

  if (cursor) {
    query = {
      ...query,
      _id: { $gt: cursor },
    };
  }

  let events = await Event.find(query)
    .sort({ _id: 1 })
    .limit(perPage + 1);

  const hasNextPage = events.length > perPage;

  if (hasNextPage) {
    events.pop();
  }

  res.status(200).json({
    success: true,
    events,
    nextCursor: hasNextPage ? events[events.length - 1]._id : null,
  });
});

//get past events
const pastEvent = catchAsync(async (req, res, next) => {
  const cursor = req.query.cursor || null;
  const perPage = parseInt(req.query.limit) || 3;

  let query = { eventdate: { $lt: new Date() } };

  if (cursor) {
    query = {
      ...query,
      _id: { $lt: cursor },
    };
  }

  let events = await Event.find(query)
    .sort({ _id: -1 })
    .limit(perPage + 1);

  const hasNextPage = events.length > perPage;

  if (hasNextPage) {
    events.pop();
  }

  res.status(200).json({
    success: true,
    events,
    nextCursor: hasNextPage ? events[events.length - 1]._id : null,
  });
});

const deleteEvent = handleFactory.deleteOne(Event);

module.exports = {
  createEvent,
  deleteEvent,
  scheduleEvent,
  pastEvent,
  getAllEvent,
};
