const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;

const { newUserSchema, signInUser } = require("../middleware/AuthMiddleware");
const { returnExistingUser } = require("../middleware/UsersMiddleware");

const generateToken = require("../utils/generateToken");
const wrappedSendMail = require("../utils/sendEmail");
const generateCode = require("../utils/generateCode");

const usersController = require("../controllers/UsersController");
const codesController = require("../controllers/CodesController");

const { BadRequestError, NotFoundError } = require("../errors");

const router = require("express").Router();

const sendCodeMailOptions = (email, code) => {
  return {
    from: process.env.YAHOO_USER,
    to: email,
    subject: "Verification Code",
    html: `<h3>Your verification code is:</h3><h4>${code}</h4>`,
  };
};

router.post("/register", newUserSchema, async (req, res, next) => {
  let createdUser = null;
  let createdCode = null;

  try {
    const user = res.locals.newUser;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    const newUser = await usersController.create(user);
    createdUser = newUser;
    delete newUser.password;
    const token = generateToken(newUser);
    const code = generateCode();

    const newCode = await codesController.create({
      user_email: newUser.email,
      code,
    });
    createdCode = newCode;

    await wrappedSendMail(sendCodeMailOptions(newUser.email, code));

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    if (createdUser) await usersController.remove(createdUser.id);
    if (createdCode) await codesController.remove(createdCode.id);
    next(err);
  }
});

router.post(
  "/resendcode/:email",
  returnExistingUser,
  async (req, res, next) => {
    try {
      const email = res.locals.user.email;
      const foundCode = await codesController.findOne({ user_email: email });
      const code = generateCode();

      if (!foundCode) {
        await codesController.create({ user_email: email, code });
      } else {
        await codesController.update({ code }, email);
      }

      await wrappedSendMail(sendCodeMailOptions(email, code));

      res.status(200).json({ message: `Email successfully sent to ${email}` });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/verify", returnExistingUser, async (req, res, next) => {
  try {
    const user = res.locals.user;
    const { code } = req.body;
    if (!code) throw new BadRequestError("Must include verification code.");
    const foundCode = await codesController.findOne({ user_email: user.email });
    if (!foundCode)
      throw new NotFoundError(`No code found for user ${user.email}`);
    if (code !== foundCode.code)
      throw new BadRequestError("Code does not match.");
    else {
      await usersController.update({ verified: true }, user.id);
      await codesController.remove(foundCode.id);
      res.status(200).json({ message: "Successfully verified user." });
    }
  } catch (err) {
    next(err);
  }
});

router.post(
  "/signin",
  returnExistingUser,
  signInUser,
  async (req, res, next) => {
    try {
      const user = res.locals.user;
      if (!user.verified) throw new BadRequestError("User not verified.");
      delete user.password;
      const token = generateToken(user);
      res.status(200).json({ user, token });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
