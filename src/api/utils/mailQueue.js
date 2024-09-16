// var amqp = require("amqplib/callback_api");
var amqplib = require("amqplib");
const { sendEMail } = require("./mailHandler");
const { sendBirthdayEmail } = require("../controllers/mailController");
// const { getBirthdayUsers } = require("../controllers/userController");

const addEmailToQueue = async function () {
  const connection = await amqplib.connect("amqp://localhost");
  console.log("addemailtoqueue");
  const queue = "mailQueue";

  const birthdayUsers = await getBirthdayUsers(); //! make it getBirthdayUsers();
  // const birthdayUsers = await User.find(); //! make it getBirthdayUsers();

  const channel = await connection.createChannel();
  // await channel.prefetch(1, false);

  for (let i = 0; i < birthdayUsers.length; i++) {
    // const info = await sendEMail({
    //   recipientEmail: "tsabudh@gmail.com",
    //   subject: "testing queue",
    //   emailTemplate: "<p>hi</>",
    // });

    const birthdayUserEmail = birthdayUsers[i].email;
    // const accepted = info.accepted[0];
    // const rejected = info.rejected[0];

    // console.log(i, accepted);

    channel.assertQueue(queue);

    channel.sendToQueue(queue, Buffer.from(birthdayUserEmail));

    console.log(" [x] Added email %s in queue '%s'", birthdayUserEmail, queue);
  }
};

const handleEmailQueue = async function () {
  const connection = await amqplib.connect("amqp://localhost");

  const channel = await connection.createChannel();

  const queue = "mailQueue";

  await channel.assertQueue(queue);

  console.log(
    " [*] Waiting for email addresses in %s. To exit press CTRL+C",
    queue
  );

  const message = await channel.consume(
    queue,
    (msg) => {
      let temp = msg.content.toString();
      console.log(temp);
      // JSON.parse(temp);
      // console.log(" [x] Received %s", msg.content.toString());
    },
    {
      noAck: true,
    }
  );
};

const sendEmailFromQueue = async function () {
  const connection = await amqplib.connect("amqp://localhost");
  const channel = await connection.createChannel();
  const queue = "mailQueue";

  await channel.assertQueue(queue);

  console.log(
    " [*] Waiting for emails to arrive in %s. To exit press CTRL+C",
    queue
  );

  await channel.prefetch(1, false);

  await channel.consume(
    queue,
    async (queueItem) => {
      let recipientEmailAddress = queueItem.content.toString();

      const info = await sendEMail({
        recipientEmail:
          // recipientEmailAddress == "tsabudh@gmail.com"
          //   ? null
          recipientEmailAddress,
        subject: "testing queues",

        emailTemplate: "<p>hi</>",
      });

      // If email is sent successfully
      if (info && info.accepted[0] == recipientEmailAddress) {
        console.log(
          "<sendEmailFromQueue>:Delay acknowledgement for free version of Mailtrap.",
          recipientEmailAddress
        );
        setTimeout(() => channel.ack(queueItem), 0);
      } else {
        // If email is not sent

        // channel.nack(queueItem);
        console.log("SEND NEGATIVE ACKNOWLEDGEMENT HERE");

        console.log("Could not sent mail to ", recipientEmailAddress);
        channel.assertQueue("rejectedMailQueue");
        channel.sendToQueue(
          "rejectedMailQueue",
          Buffer.from(recipientEmailAddress)
        );
      }
    },
    {
      noAck: false,
    }
  );
};

module.exports = { addEmailToQueue, handleEmailQueue, sendEmailFromQueue };
