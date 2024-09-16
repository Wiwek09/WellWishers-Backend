const catchAsync = (fn) => {
  return (req, res, next) =>
    fn(req, res, next).catch((err) => {
      // res.json({
      //   status: "failure",
      //   message: err.message,
      // });
      next(err);
    });
};

module.exports = catchAsync;
