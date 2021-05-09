const bcrypt = require("bcryptjs");

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");

const usersController = require("../controllers/UsersController");

async function newUserSchema(req, res, next) {
  try {
    const { email, password, confirmPassword } = req.body;
    const keys = Object.keys(req.body);
    // Check for req.body length, if empty send error
    if (keys.length === 0)
      throw new BadRequestError(
        "Must include user email, password, and confirmPassword."
      );
    // checks for required fields
    else if (!email) throw new BadRequestError("Must include user email.");
    else if (!password)
      throw new BadRequestError("Must include user password.");
    else if (!confirmPassword)
      throw new BadRequestError("Must include confirmPassword.");
    // checks that fields meet criteria
    else if (typeof email !== "string" || email.length > 32)
      throw new BadRequestError(
        "User email must be a string less than 32 characters."
      );
    else if (password.length < 8)
      throw new BadRequestError("User password must be at least 8 characters.");
    else if (confirmPassword.length < 8)
      throw new BadRequestError(
        "User confirmPassword must be at least 8 characters."
      );
    else if (password !== confirmPassword)
      throw new BadRequestError("Password and confirmPassword must match.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new BadRequestError("Invalid email.");
    else {
      // set user in res.locals
      const user = { email, password };
      user.email = email.trim();
      res.locals.newUser = user;
      next();
    }
  } catch (err) {
    next(err);
  }
}

async function signInUser(req, res, next) {
  try {
    const { password } = req.body;
    if (!password) throw new BadRequestError("Must include user password.");
    const user = res.locals.user;
    if (bcrypt.compareSync(password, user.password)) next();
    else throw new UnauthorizedError("Invalid credentials.");
  } catch (err) {
    next(err);
  }
}

module.exports = { newUserSchema, signInUser };
