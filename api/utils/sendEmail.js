const nodemailer = require("nodemailer");
require("dotenv").config();

async function wrappedSendMail(mailOptions) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host: "stmp.mail.yahoo.com",
      port: 465,
      service: "yahoo",
      secure: false,
      auth: {
        user: process.env.YAHOO_USER,
        pass: process.env.YAHOO_PASSWORD,
      },
      debug: false,
      logger: true,
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) resolve(false);
      else resolve(true);
    });
  });
}

module.exports = wrappedSendMail;
