const catchAsync = require("../utils/catchAsync");
const smsHandler = require("../utils/smsHandler");

exports.sendBirthdaySMS = catchAsync(async (req, res, next) => {
  const { smsBody, phone } = req.body;

  await smsHandler.sendSMS({ smsBody, phone });

  res.status(200).json({
    status: "success",
  });
});
