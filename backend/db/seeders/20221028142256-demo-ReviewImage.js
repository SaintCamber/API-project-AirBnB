"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
await queryInterface.bulkInsert("ReviewImages", [{
  reviewId:1,
  url:'www.hergoesanimage1 .com',
},
{
  reviewId:2,
  url:'www.hergoesanimage2 .com',
},
{
  reviewId:3,
  url:'www.hergoesanimage3 .com',
},
{
  reviewId:4,
  url:'www.hergoesanimage4 .com',
},
{
  reviewId:5,
  url:'www.hergoesanimage5 .com',
}], {});
},

async down(queryInterface, Sequelize) {
/**
 * Add commands to revert seed here.
 *
 * Example:
 * await queryInterface.bulkDelete('People', null, {});
 */
 await queryInterface.bulkDelete('ReviewImages', null, {})
},
};