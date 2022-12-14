'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsTo(models.User,{foreignKey:"userId"})
      Booking.belongsTo(models.Spot,{foreignKey:"spotId",sourceKey:"id",onDelete:"CASCADE"})

    }
  }
  Booking.init({
    spotId: {type: DataTypes.INTEGER,foreignKey:true},
    userId: {type: DataTypes.INTEGER,foreignKey:true},
    startDate: {type : DataTypes.DATE,allowNull: true},
    endDate: {type : DataTypes.DATE,allowNull: true}
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};