// const dotenv = require("dotenv");

// dotenv.config({ path: "./config.env" });

// const accountSID = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

// const twilioClient = require("twilio")(accountSID, authToken);

// exports.sendSMS = async ({ smsBody, phone }) => {
//   try {
//     const messageConfigurations = {
//       body: smsBody,
//       to: "+977" + phone,
//       from: twilioPhone,
//     };

//     console.log("sending message");
//     await twilioClient.messages.create(messageConfigurations);
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.sendBirthdaySMS = async (users) => {
//   try {
//     users.forEach(async (user) => {
//       const smsBody = `Happy Birthday Dear ${user.name}`;
//       const phone = user.phone;
//       let isMessageSent = await this.sendSMS({ smsBody, phone });
//       if (!isMessageSent) return;
//       console.log("sent sms to", user.name);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
