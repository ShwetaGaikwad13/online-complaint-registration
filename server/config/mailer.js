const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, text }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return;
  }
  await transporter.sendMail({
    from: `"Complaint System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;
