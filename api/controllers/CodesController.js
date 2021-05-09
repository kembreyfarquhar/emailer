const db = require("../../db/dbConfig");

const CODES = "codes";

class CodesController {
  findAll() {
    return db(CODES);
  }

  findOne(queryObj) {
    return db(CODES).where(queryObj).first();
  }

  async create(code) {
    const [newCode] = await db(CODES).insert(code).returning("*");
    return newCode;
  }

  async update(changes, user_email) {
    const [updatedCode] = await db(CODES)
      .where({ user_email })
      .update(changes)
      .returning("*");
    return updatedCode;
  }

  remove(id) {
    return db(CODES).where({ id }).del();
  }
}

const codesController = new CodesController();

module.exports = codesController;
