const db = require("../../db/dbConfig");

class Controller {
  db = db;

  constructor(table) {
    this.table = table;
  }

  findAll() {
    return this.db(this.table);
  }

  findOne(queryObj) {
    return this.db(this.table).where(queryObj).first();
  }

  remove(id) {
    return this.db(this.table).where({ id }).del();
  }
}

module.exports = Controller;
