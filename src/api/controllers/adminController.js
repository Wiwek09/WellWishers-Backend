const Admin = require("../models/adminModel");
const validator = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ejs = require("ejs");
const path = require("path");
const catchAsync = require("../utils/catchAsync");
const OTP = require("../models/otpModel");
const { sendMail } = require("../utils/mailHandler");
const createUserSettings = require("../utils/createUserSettings");

exports.requestSignupToken = catchAsync(async (req, res, next) => {
  // Check if email is valid imperatively
  await validator
    .body("email")
    .isEmail()
    .custom(async (value) => {
      const admin = await Admin.findOne({ email: value });
      if (admin) {
        throw new Error("This email is already in use.");
      }
    })
    .run(req);

  // Respond with error if email is invalid
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const email = req.body.email;

  // Get all OTPs
  const otpResult = await OTP.find();

  function createOTP() {
    let otp = Math.floor(10000 + Math.random() * 90000);

    // Make sure that the OTP is unique
    while (otpResult.some((otpDoc) => otpDoc.otp === otp)) {
      otp = Math.floor(10000 + Math.random() * 90000);
    }
    return otp;
  }

  const otp = createOTP();

  const otpExpiration = new Date();
  otpExpiration.setMinutes(otpExpiration.getMinutes() + 1);

  const otpTemplate = await ejs.renderFile(
    path.join(__dirname, "../../../views/signupOTPTemplate.ejs"),
    {
      otp,
    }
  );
  const subject = "Verify | Wellwisher";
  await sendMail({
    recipientEmail: email,
    subject,
    emailTemplate: otpTemplate,
  });
  const OTPDoc = await OTP.create({
    email,
    otp,
    expiresAt: otpExpiration,
    type: "signup",
  });

  res.status(200).json({
    status: "Building",
    data: OTPDoc,
  });
});

exports.signupAdmin = catchAsync(async (req, res, next) => {
  // Check for express-validator errors
  const errors = validator.validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, otp } = req.body;

  // Find the OTP document
  const matchedEmailOTP = await OTP.findOne({ email, otp, type: "signup" });

  // Check if OTP exists
  if (!matchedEmailOTP) {
    throw new Error("OTP not found or expired.");
  }

  // Check if OTP is expired
  if (matchedEmailOTP.expiresAt < new Date()) {
    throw new Error("OTP expired.");
  }

  // Create the admin
  const newAdmin = await Admin.create({
    email,
    password,
    username,
  });

  // Create default settings for the new admin using the utility function
  let newSettings;
  try {
    newSettings = await createUserSettings(newAdmin._id);
  } catch (error) {
    res.status(400).json({message: "Error fetching"})
    next(error)

    // If settings creation fails, you might want to delete the created admin
    await Admin.findByIdAndDelete(newAdmin._id);
    throw new Error("Failed to create user settings");
  }

  // Mark the OTP as used
  matchedEmailOTP.isUsed = true;
  await matchedEmailOTP.save();

  res.json({
    status: "success",
    data: { admin: newAdmin, settings: newSettings },
  });
});

exports.checkAdminExists = [
  validator
    .body("email")
    .notEmpty()
    .withMessage("Please enter your email to log in.")
    .isEmail()
    .withMessage("Please enter your valid email.")
    .custom(async (value) => {
      const admin = await Admin.findOne({ email: value });
      if (!admin) {
        throw new Error("This email is not registered as Admin.");
      }
    }),
  validator.body("password").notEmpty().withMessage("Please provide password."),
];

exports.loginAdmin = catchAsync(async (req, res, next) => {
  // Checking errors from Express validator
  const validationErrors = validator.validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .json({ status: "failure", errors: validationErrors.array() });
  }

  // Checking if admin exists and corresponding password matches
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    throw new Error("Incorrect email or password!");
  }

  // Remove password from admin variable
  admin.password = undefined;

  // If everything is OK send token to client
  const payload = {
    currentAdmin: admin._id,
    issuedAt: Date.now(),
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  if (!token) throw new Error();

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
  };
  res.cookie("jwt", token, cookieOptions);
  res.send({
    status: "success",
    token,
    data: { admin },
  });
});

exports.getOneAdmin = catchAsync(async (req, res, next) => {
  let query = Admin.findById(req.params.id);
  const admin = await query;

  if (!admin) {
    throw new Error("Could not find admin of that ID");
  }
  res.status(200).json({
    status: "Success",
    data: {
      admin,
    },
  });
});

exports.updateAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!admin) {
    throw new Error("Could not find admin of that ID");
  }
  res.status(200).json({
    status: "Success",
    data: {
      admin,
    },
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  res
    .status(200)
    .cookie("jwt", "", {
      expires: new Date(0),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "You have been logged out",
    });
});
