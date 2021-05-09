// Third party packages
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Environment Variables
require("dotenv").config();
const secret = process.env.JWT_SECRET;

// Middleware
const { newUserSchema, signInUser } = require("../middleware/AuthMiddleware");
const { returnExistingUser } = require("../middleware/UsersMiddleware");

// Utility functions
const generateToken = require("../utils/generateToken");
const wrappedSendMail = require("../utils/sendEmail");
const generateCode = require("../utils/generateCode");

// Controllers
const usersController = require("../controllers/UsersController");
const codesController = require("../controllers/CodesController");

// Custom Errors
const { BadRequestError, NotFoundError } = require("../errors");

// Initialize Router
const router = require("express").Router();

// Returns mail options object for sending verification code
const sendCodeMailOptions = (email, code) => {
  return {
    from: process.env.YAHOO_USER,
    to: email,
    subject: "Verification Code",
    html: `<h3>Your verification code is:</h3><h4>${code}</h4>`,
  };
};

// Register endpoint
router.post("/register", newUserSchema, async (req, res, next) => {
  // Set both variables to null for checking in catch block
  let createdUser = null;
  let createdCode = null;

  try {
    const user = res.locals.newUser; // pull user from res.locals
    const hash = bcrypt.hashSync(user.password, 10); // create hash for user password
    user.password = hash;
    const newUser = await usersController.create(user); // create the new user
    createdUser = newUser; // set createdUser equal to newUser just made
    delete newUser.password; // remove user password to safely send user back in response
    const code = generateCode(); // generate verification code

    // create new code in database
    const newCode = await codesController.create({
      user_email: newUser.email,
      code,
    });
    createdCode = newCode; // set createdCode equal to newCode just made

    // send email with mail options containing user email and code
    await wrappedSendMail(sendCodeMailOptions(newUser.email, code));

    res.status(201).json({ user: newUser }); // send back newly created user after all is successfull
  } catch (err) {
    // check values for createdUser and createdCode
    // if they are not null, we must delete the rows in the database
    // since the rest of the endpoint/function was unsuccsessfull
    if (createdUser) await usersController.remove(createdUser.id);
    if (createdCode) await codesController.remove(createdCode.id);
    next(err);
  }
});

// Resend Verification Code endpoint
router.post(
  "/resendcode/:email",
  returnExistingUser,
  async (req, res, next) => {
    try {
      const email = res.locals.user.email; // Pull email from res.locals.user
      // check for existing code in database using user email
      const foundCode = await codesController.findOne({ user_email: email });
      const code = generateCode(); // generate verification code

      if (!foundCode) {
        // if no foundCode, create a new one
        await codesController.create({ user_email: email, code });
      } else {
        // else, update existing one
        await codesController.update({ code }, email);
      }

      // send email with mail options containing user email and code
      await wrappedSendMail(sendCodeMailOptions(email, code));

      // send back success message
      res.status(200).json({ message: `Email successfully sent to ${email}` });
    } catch (err) {
      next(err);
    }
  }
);

// Verify User and via Code endpoint
router.post("/verify", returnExistingUser, async (req, res, next) => {
  try {
    const user = res.locals.user; // pull user from res.locals.user
    const { code } = req.body; // pull code from req.body
    // if no code throw error
    if (!code) throw new BadRequestError("Must include verification code.");
    // check for existing code in database using user email
    const foundCode = await codesController.findOne({ user_email: user.email });
    if (!foundCode)
      // if no foundCode throw error
      throw new NotFoundError(`No code found for user ${user.email}`);
    if (code !== foundCode.code)
      // if code does not match foundCode throw error
      throw new BadRequestError("Code does not match.");
    else {
      // update user verified column
      await usersController.update({ verified: true }, user.id);
      // remove code from database
      await codesController.remove(foundCode.id);
      // send back success message
      res.status(200).json({ message: "Successfully verified user." });
    }
  } catch (err) {
    next(err);
  }
});

// Sign In endpoint
router.post(
  "/signin",
  returnExistingUser,
  signInUser,
  async (req, res, next) => {
    try {
      const user = res.locals.user; // pull user from res.locals.user
      // if user is not verified throw error
      if (!user.verified) throw new BadRequestError("User not verified.");
      delete user.password; // delete user password to safely send user back in response
      const token = generateToken(user); // generate token to send back in response
      res.status(200).json({ user, token }); // send back user and token
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
