// Custom errors
const { BadRequestError, NotFoundError } = require("../errors");

// Controllers
const usersController = require("../controllers/UsersController");

// Returns existing user, if found, otherwise error
async function returnExistingUser(req, res, next) {
  try {
    const { id } = req.params;
    let email;
    if (Object.keys(req.params).includes("email")) email = req.params.email;
    if (Object.keys(req.body).includes("email")) email = req.body.email;

    if (!email && !id)
      throw new BadRequestError("Must include user email or id.");

    let queryObj;

    if (email) queryObj = { email };
    if (id) queryObj = { id };

    const foundUser = await usersController.findOne(queryObj);

    if (!foundUser) throw new NotFoundError("User not found.");
    else {
      res.locals.user = foundUser;
      next();
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { returnExistingUser };
