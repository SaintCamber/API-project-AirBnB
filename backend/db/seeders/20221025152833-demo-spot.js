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
    },
    {
      ownerId: 1,
    address:'2 berry lane',
    city:'dairytopia',
    state: 'chocolatteia',
    country: "candyland",
    lat: 91,
    lng: 91,
    name: 'Candyland Castle',
    description:"i mean its a castle in candyland i guess",
    price: 1337
    },
    {
    ownerId: 2,
    address:'3 berry lane',
    city:'dairytopia',
    state: 'chocolatteia',
    country: "candyland",
    lat: 92,
    lng: 92,
    name: 'Candyland Castle',
    description:"i mean its a castle in candyland i guess",
    price: 1337
    },
    {
      ownerId: 1,
    address:'4 berry lane',
    city:'dairytopia',
    state: 'chocolatteia',
    country: "candyland",
    lat: 94,
    lng: 94,
    name: 'Candyland Castle',
    description:"i mean its a castle in candyland i guess",
    price: 1337
    },
    {
      ownerId: 3,
    address:'5 berry lane',
    city:'dairytopia',
    state: 'chocolatteia',
    country: "candyland",
    lat: 95,
    lng: 95,
    name: 'Candyland Castle',
    description:"i mean its a castle in candyland i guess",
    price: 1337
    },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Spots', {
      name: { [Op.in]: ["candyland Castle"] }
    }, {});
  }
};