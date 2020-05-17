const {DataTypes, Model} = require('sequelize');
const sequelize = require('../../config/database');

class YoutubeLink extends Model {
  static async allActive() {
    try {
      return await YoutubeLink.findAll({
        attributes: ['id', 'link'],
        where: {
          active: true,
        },
      });
    } catch (e) {
      return {error: e};
    }
  }

  static async allForOwner(ownerId, ownerType) {
    try {
      return await YoutubeLink.findAll({
        attributes: ['id', 'link'],
        where: {
          ownerId,
          ownerType,
        },
      });
    } catch (e) {
      console.log(e);
      return {error: e};
    }
  }
}

YoutubeLink.init(
  {
    link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ownerType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
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
    tableName: 'youtube_links',
  },
);

module.exports = YoutubeLink;
