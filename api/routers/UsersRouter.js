const usersController = require("../controllers/UsersController");

const { returnExistingUser } = require("../middleware/UsersMiddleware");

const router = require("express").Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await usersController.findAll();
    users.forEach((user) => {
      delete user.password;
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
