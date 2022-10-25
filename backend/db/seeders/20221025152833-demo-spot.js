'use strict'


module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Spots', [{
      ownerId: 1,
    address:'1 berry lane',
    city:'dairytopia',
    state: 'chocolatteia',
    country: "candyland",
    lat: 90,
    lng: 90,
    name: 'Candyland Castle',
    description:"i mean its a castle in candyland i guess",
    price: 1337
    }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Spots', {
      name: { [Op.in]: ["candyland Castle"] }
    }, {});
  }
};