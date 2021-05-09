// Third party packages
const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 *
 * @param {object} mailOptions Object containing mail options
 * @returns Promise<boolean>
 */
async function wrappedSendMail(mailOptions) {
  return new Promise((resolve, _reject) => {
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

    transporter.sendMail(mailOptions, (error, _info) => {
      if (error) resolve(false);
      else resolve(true);
    });
  });
}

module.exports = wrappedSendMail;
