const nodemailer = require('nodemailer');

const sendMsg = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  const mailOptions = {
    from: 'Flux Tours <flux@tours.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendMsg;
