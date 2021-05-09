const db = require("../../db/dbConfig");

const USERS = "users";

class UsersController {
  findAll() {
    return db(USERS);
  }

  findOne(queryObj) {
    return db(USERS).where(queryObj).first();
  }

  async create(user) {
    const [newUser] = await db(USERS).insert(user).returning("*");
    return newUser;
  }

  async update(changes, id) {
    const [updatedUser] = await db(USERS)
      .where({ id })
      .update(changes)
      .returning("*");
    return updatedUser;
  }

  remove(id) {
    return db(USERS).where({ id }).del();
  }
}

const usersController = new UsersController();

module.exports = usersController;
