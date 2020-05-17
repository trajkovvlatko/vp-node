const {DataTypes, Model} = require('sequelize');
const sequelize = require('../../config/database');

class Property extends Model {
  static async allActive() {
    try {
      return await Property.findAll({
        attributes: ['id', 'name'],
        where: {
          active: true,
        },
      });
    } catch (e) {
      return {error: e};
    }
  }

  static associate(models) {
    Property.belongsToMany(models.Venue, {
      through: 'properties_venues',
      foreignKey: 'propertyId',
    });
  }
}

Property.init(
  {
    name: {
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
    tableName: 'properties',
  },
);

module.exports = Property;
