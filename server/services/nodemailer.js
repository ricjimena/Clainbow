const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false // Permite certificados autofirmados
}
});

const sendVerificationEmail = async (email, token) => {

  let emailVerificationTemplate = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-mail Verification</title>
  </head>
  <body>
    <h2>Welcome to Clainbow!</h2>
    <p>Click the following link to verify your email: <a href="http://localhost:5173/validateAccount/${token}">click here</a></p>
    <br>
    <br>
    <p>Many thanks,</p>
    <h4>The Clainbow Team</h4>
  </body>
  </html>`

  const mailOptions = {
    from: 'Clainbow <testclainbow@gmail.com>',
    to: email,
    subject: 'E-mail Verification',
    html: emailVerificationTemplate
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendPasswordResetEmail = async (email, newPassword) => {

  let newPasswordTemplate = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E-mail Verification</title>
  </head>
  <body>
    <h2>Welcome back to Clainbow!</h2>
    <p>Your new password is: <strong>${newPassword}</strong></p>
    <br>
    <br>
    <p>Many thanks,</p>
    <h4>The Clainbow Team</h4>
  </body>
  </html>`

  const mailOptions = {
    from: 'Clainbow <testclainbow@gmail.com>',
    to: email,
    subject: 'Password Reset',
    html: newPasswordTemplate
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = {sendVerificationEmail, sendPasswordResetEmail};