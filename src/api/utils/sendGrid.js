const sgMail = require("@sendgrid/mail");

exports.sendGridMail = function () {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: "tsabudh@gmail.com",
    from: "verifiedSender@sendgrid.com", // Verify sender from sendgrid.com
    subject: "Gmail serviceTEST ",
    text: "Happy Birthday",
    html: "<strong>USING GMAIL</strong>",
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
