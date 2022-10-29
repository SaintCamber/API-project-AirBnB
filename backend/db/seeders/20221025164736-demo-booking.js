

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Bookings', [{
      SpotId:1,
      userId:2,
      startDate:new Date(),
      endDate: new Date('December 17, 2022')
    },
    {
      SpotId:1,
      userId:1,
      startDate:new Date(),
      endDate: new Date('December 17, 2022')
    },
    {
      SpotId:3,
      userId:1,
      startDate:new Date(),
      endDate: new Date('December 17, 2022')
    },
    {
      SpotId:3,
      userId:3,
      startDate:new Date(),
      endDate: new Date('December 17, 2022')
    },
    {
      SpotId:1,
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