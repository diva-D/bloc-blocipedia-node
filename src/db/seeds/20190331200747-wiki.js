'use strict';

const faker = require("faker");

let wikis = [];

for (let i = 1; i <= 15; i++) {
  wikis.push({
    title: faker.hacker.noun(),
    body: faker.lorem.paragraphs(3),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: randomNumber(5, 1)
  });
}

function randomNumber(max, min){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Wikis", wikis, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Wikis", null, {});
  }
};
