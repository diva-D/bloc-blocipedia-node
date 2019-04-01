'use strict';

const faker = require("faker");
const bcrypt = require("bcryptjs");

let users = [];

for (let i = 1; i <= 5; i++) {
  
  let salt = bcrypt.genSaltSync();
  let hashedPassword = bcrypt.hashSync(faker.internet.password(), salt);

  users.push({
    email: faker.internet.email(),
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Users", users, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
