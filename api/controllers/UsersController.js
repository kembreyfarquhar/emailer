const Controller = require("./Controller");

class UsersController extends Controller {
  constructor() {
    super("users");
  }

  async create(user) {
    const [newUser] = await this.db(this.table).insert(user).returning("*");
    return newUser;
  }

  async update(changes, id) {
    const [updatedUser] = await this.db(this.table)
      .where({ id })
      .update(changes)
      .returning("*");
    return updatedUser;
  }
}

const usersController = new UsersController();

module.exports = usersController;
