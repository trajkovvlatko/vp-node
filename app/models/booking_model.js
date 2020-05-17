const {DataTypes, Model} = require('sequelize');
const sequelize = require('../../config/database');

class Booking extends Model {}

Booking.init(
  {
    fromUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    toUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requesterType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requesterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requestedType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    requestedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'bookings',
  },
);

module.exports = Booking;
