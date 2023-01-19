const nodemailer = require('nodemailer');

module.exports = transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'sigeavi.soporte@gmail.com', // generated ethereal user
      pass: 'wuhvbsqnycrlccmc', // generated ethereal password
    },
});