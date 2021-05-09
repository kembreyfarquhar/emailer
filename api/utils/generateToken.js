require("dotenv").config();
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

/**
 *
 * @param {object} user User object
 * @returns Signed JWT token containing stored information about the user
 */
function generateToken(user) {
  const payload = {
    subject: user.id,
    email: user.email,
  };
  const options = { expiresIn: "3d" };
  return jwt.sign(payload, secret, options);
}

module.exports = generateToken;
