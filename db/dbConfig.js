const knex = require("knex");
const config = require("../knexfile.js");
require("dotenv").config();

// Check if environment is 'production' or development
const dbEnvironment = process.env.NODE_ENV || "development";

// export db using environment
module.exports = knex(config[dbEnvironment]);
