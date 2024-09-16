const validator = require("express-validator");

const validateUserDetails = (isUpdateRequest = false) => {
  const processIfUpdating = (req, field) => {
    if (isUpdateRequest) {
      return req.body[field];
    } else return true;
  };

  return [
    validator
      .body("name")
      .if((value, { req }) => processIfUpdating(req, "name"))
      .notEmpty()
      .withMessage("Please provide a name.")
      .bail()
      .matches(/^(?![\s]+$)[a-zA-Z\s]*$/)
      .withMessage("Please provide a valid name."),
    validator
      .body("email")
      .if((value, { req }) => processIfUpdating(req, "email"))
      .notEmpty()
      .withMessage("Please provide an email address.")
      .bail()
      .isEmail()
      .withMessage("Please provide a valid email address."),
    validator
      .body("phone")
      .if((value, { req }) => processIfUpdating(req, "phone"))
      .notEmpty()
      .withMessage("Please provide a phone number.")
      .bail()
      .isMobilePhone(["ne-NP"])
      .withMessage("Please provide a valid phone number of Nepal"),
    validator
      .body("dob")
      .if((value, { req }) => processIfUpdating(req, "dob"))
      .notEmpty()
      .isDate()
      .withMessage("Please provide a correct Date in format YYYY/MM/DD"),
  ];
};

const checkValidationErrors = (req, res, next) => {
  const validationErrors = validator.validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .json({ status: "failure", errors: validationErrors.array() });
  }
  next();
};

module.exports = { validateUserDetails, checkValidationErrors };
