const Controller = require("./Controller");

class CodesController extends Controller {
  constructor() {
    super("codes");
  }

  async create(code) {
    const [newCode] = await this.db(this.table).insert(code).returning("*");
    return newCode;
  }

  async update(changes, user_email) {
    const [updatedCode] = await this.db(this.table)
      .where({ user_email })
      .update(changes)
      .returning("*");
    return updatedCode;
  }
}

const codesController = new CodesController();

module.exports = codesController;
