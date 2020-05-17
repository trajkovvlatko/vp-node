const {DataTypes, Model} = require('sequelize');
const sequelize = require('../../config/database');

class Genre extends Model {
  static async allActive() {
    try {
      return await Genre.findAll({
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
    Genre.belongsToMany(models.Performer, {
      through: 'genres_performers',
      foreignKey: 'genreId',
    });
  }
}
Genre.init(
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
    tableName: 'genres',
  },
);

module.exports = Genre;
