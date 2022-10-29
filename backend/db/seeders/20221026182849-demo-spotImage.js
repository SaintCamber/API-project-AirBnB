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
      SpotId:1,
      url:'www.hergoesanimage1 .com',
      preview: false
    },
    {
      SpotId:1,
      url:'www.hergoesanimage2 .com',
      preview: true
    },
    {
      SpotId:1,
      url:'www.hergoesanimage3 .com',
      preview: false
    },
    {
      SpotId:1,
      url:'www.hergoesanimage4 .com',
      preview: false
    },
    {
      SpotId:1,
      url:'www.hergoesanimage5 .com',
      preview: false
    }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     *
     */
 await queryInterface.bulkDelete('SpotImages', null, {})
    
  },
};
