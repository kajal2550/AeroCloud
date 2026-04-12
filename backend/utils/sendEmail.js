const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using ethereal email for testing
  // Or your actual SMTP credentials (e.g., Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your email provider
    auth: {
      user: process.env.EMAIL_USER || 'test@gmail.com',
      pass: process.env.EMAIL_PASS || 'password',
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'AeroCloud'} <${process.env.FROM_EMAIL || 'test@gmail.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
