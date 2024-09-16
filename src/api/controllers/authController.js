const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const catchAsync = require("../utils/catchAsync");
const { Admin } = require("../models");
const { sendEMail } = require("../utils/mailHandler");

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // Check if token is available
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Throw error if token is not available
  if (!token) {
    throw new Error("Please log in first");
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  res.locals.currentAdmin = decoded.currentAdmin;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get admin based on POSTed email
  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) {
    throw new Error("Admin not found with that email.");
  }

  // Generate the random reset password token
  const resetToken = admin.createPasswordResetToken();
  await admin.save({ validateBeforeSave: false });

  // 3) Send it to admin's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/admins/resetPassword/${resetToken}`;

    await sendEMail({
      recipientEmail: req.body.email,
      subject: "Password Reset Token | Wellwisher",
      emailTemplate: `<p>Click on this link to reset your password. </p><p>${resetURL}</p>`,
    });
  } catch (error) {
    admin.passwordResetToken = undefined;
    admin.passwordResetTokenExpires = undefined;
    await admin.save({ validateBeforeSave: false });
    throw new Error("There was an error sending the email. Please try again.");
  }

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
    resetToken, //! INCLUDE IN  DEVELOPMENT PHASE ONLY
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get admin based on that token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log("Received token:", req.params.token);
  console.log("Hashed token:", hashedToken);

  const admin = await Admin.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  // Check if token is valid
  if (!admin) {
    throw new Error("Invalid or expired token.");
  }

  //validate passwords
  if (req.body.password !== req.body.passwordConfirm) {
    throw new Error("Passwords do not match.");
  }

  // Try to save passwords
  admin.password = req.body.password;
  admin.passwordConfirm = req.body.passwordConfirm;

  admin.passwordResetToken = undefined;
  admin.passwordResetTokenExpires = undefined;

  await admin.save();
  const payload = {
    currentAdmin: admin._id,
    issuedAt: Date.now(),
  };

  createSendJWTToken({ ...payload }, res);
});

const createJWTToken = (payload) => {
  const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET);
  return token;
};

const saveJWTCookie = (token, res) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true,
  };
  res.cookie("jwt", token, cookieOptions);
};

const createSendJWTToken = (payload, res) => {
  const token = createJWTToken(payload);
  saveJWTCookie(token, res);

  res.status(200).json({
    status: "success",
    token,
    id: payload._id,
  });
};
