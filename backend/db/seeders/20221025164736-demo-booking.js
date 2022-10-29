

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Bookings', [{
      spotId:1,
      userId:2,
      startDate:new Date(),
      endDate: new Date('December 17, 2022')
    },
    {
      spotId:1,
      userId:1,
      startDate:new Date(),
      endDate: new Date('December 17, 2022')
    },
    {
      spotId:3,
      userId:1,
      startDate:new Date(),
      endDate: new Date('December 17, 2022')
    },
    {
      spotId:3,
      userId:3,
      startDate:new Date(),
      endDate: new Date('December 17, 2022')
    },
    {
      spotId:1,
      userId:2,
      startDate:new Date(),
      endDate: new Date('December 17, 2022')
    },
    
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete('Bookings', {
      userId: 2
    }, {});
  }
};