require("dotenv").config();
const { SendMailClient } = require("zeptomail");

const url = "https://api.zeptomail.com/";
const token = process.env.ZEPTO_API_TOKEN;

const client = new SendMailClient({ url, token });

const sendMail = async ({
  recipientEmail,
  subject,
  emailTemplate,
  attachments,
}) => {
  try {
    const messageConfigurations = {
      from: {
        address: process.env.EMAIL_FROM,
        name: process.env.EMAIL_FROM_NAME,
      },
      to: [
        {
          email_address: {
            address: recipientEmail,
            name: recipientEmail,
          },
        },
      ],
      subject: subject || "Untitled",
      htmlbody: emailTemplate || "TemplateNotFound",
      attachments: attachments,
    };

    const response = await client.sendMail(messageConfigurations);
    console.log(`Email sent to ${recipientEmail}`);
    // console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.error && error.error.details) {
      error.error.details.forEach((detail) => {
        console.error(
          `Sub-code: ${detail.sub_code}, Message: ${detail.message}`
        );
      });
    }
    throw error;
  }
};

module.exports = { sendMail };
