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
    await queryInterface.bulkInsert("SpotImages", [{
      spotId:1,
      url:'www.hergoesanimage1 .com',
      preview: false
    },
    {
      spotId:1,
      url:'www.hergoesanimage2 .com',
      preview: true
    },
    {
      spotId:1,
      url:'www.hergoesanimage3 .com',
      preview: false
    }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
