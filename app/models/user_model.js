const {DataTypes, Model, Op} = require('sequelize');
const sequelize = require('../../config/database');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Booking = require('./booking_model');

class User extends Model {
  static async findByCredentials(email, password) {
    try {
      // Must return a plain object to passport
      const u = await User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {
          email: email,
        },
      });

      if (!u) return {error: 'User not found.'};

      const match = await bcrypt.compare(password, u.password);
      if (!match) return {error: "Passwords doesn't match."};

      return u;
    } catch (e) {
      return {error: e};
    }
  }

  static async register(name, email, password) {
    const hash = await bcrypt.hash(password, saltRounds);
    const user = User.build({
      name: name,
      email: email,
      password: hash,
      active: true,
    });
    return await user.save();
  }

  static async find(id) {
    try {
      // Return a user object
      return await User.findByPk(id, {
        attributes: ['id', 'name', 'email'],
      });
    } catch (e) {
      return {error: e};
    }
  }

  static async findByEmail(email) {
    try {
      // Return a user object
      return await User.findOne({
        attributes: ['id', 'name', 'email'],
        where: {
          email: email,
        },
      });
    } catch (e) {
      return {error: e};
    }
  }

  async findBooking(id) {
    try {
      return await Booking.findOne({
        attributes: [
          'id',
          'bookingDate',
          'requesterType',
          'requesterId',
          'requestedType',
          'requestedId',
          'status',
        ],
        where: {
          id: id,
          [Op.or]: [{fromUserId: this.id}, {toUserId: this.id}],
        },
      });
    } catch (e) {
      return {error: e};
    }
  }

  async createBooking(params = {}) {
    let type = params.requesterType;
    const requesterType = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;

    type = params.requestedType;
    const requestedType = `${type.charAt(0).toUpperCase()}${type.slice(1)}`;

    return await Booking.create({
      fromUserId: this.id,
      toUserId: params.toUserId,
      requesterType,
      requesterId: params.requesterId,
      requestedType,
      requestedId: params.requestedId,
      status: 'requested',
      bookingDate: params.date,
    });
  }

  async upcomingBookings() {
    return await Booking.findAll({
      attributes: [
        'id',
        'bookingDate',
        'requesterType',
        'requesterId',
        'requestedType',
        'requestedId',
        'status',
      ],
      where: {
        [Op.and]: [
          {
            [Op.or]: [{fromUserId: this.id}, {toUserId: this.id}],
          },
          {
            [Op.or]: [{status: 'accepted'}, {status: 'canceled'}],
          },
          {
            bookingDate: {
              [Op.gt]: new Date(),
            },
          },
        ],
      },
      order: [['bookingDate', 'ASC']],
    });
  }

  static associate(models) {
    User.hasMany(models.Performer, {foreignKey: 'userId'});
    User.hasMany(models.Venue, {foreignKey: 'userId'});
    User.hasMany(models.Image, {foreignKey: 'userId'});
    User.hasMany(models.YoutubeLink, {foreignKey: 'userId'});
    User.hasMany(models.Booking, {
      foreignKey: 'fromUserId',
      as: 'RequesterBookings',
    });
    User.hasMany(models.Booking, {
      foreignKey: 'toUserId',
      as: 'RequestedBookings',
    });
  }
}
User.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'users',
  },
);

module.exports = User;
