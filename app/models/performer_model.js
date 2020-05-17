const {Op, DataTypes, Model, col} = require('sequelize');
const db = require('../../config/database');
const Genre = require('./genre_model');
const Booking = require('./booking_model');
const YoutubeLink = require('./youtube_link_model');
const Image = require('./image_model');

const BookingJoin = {
  [Op.or]: [
    {
      requesterId: {[Op.eq]: col('Performer.id')},
      requesterType: 'Performer',
    },
    {
      requestedId: {[Op.eq]: col('Performer.id')},
      requestedType: 'Performer',
    },
  ],
};

class Performer extends Model {
  static associate(models) {
    Performer.belongsToMany(models.Genre, {
      through: 'genres_performers',
      foreignKey: 'performerId',
    });

    Performer.hasMany(models.Image, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: {
        ownerType: 'Performer',
      },
    });

    Performer.hasMany(models.YoutubeLink, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: {
        ownerType: 'Performer',
      },
    });

    Performer.hasMany(models.Booking);
  }

  static async allActive(sorting = 'latest', limit = 5, offset = 0) {
    switch (sorting) {
      case 'latest':
        sorting = ['id', 'DESC'];
        break;
      case 'top':
        sorting = ['rating', 'DESC'];
        break;
    }
    try {
      return await Performer.findAll({
        attributes: ['id', 'name', 'rating', 'type'],
        where: {active: true},
        include: [
          {
            model: Image,
            attributes: ['image'],
            where: {
              selected: true,
            },
          },
        ],
        order: [sorting],
        limit: limit || 10,
        offset: offset || 0,
      });
    } catch (e) {
      return {error: e};
    }
  }

  static async basicFind(id, userId) {
    const wheres = {id: id};
    if (userId) {
      wheres.userId = userId;
    }
    try {
      return await Performer.findOne({where: wheres});
    } catch (e) {
      return {error: e};
    }
  }

  static async find(id, userId) {
    const wheres = {id: id, active: true};
    if (userId) {
      wheres.userId = userId;
    }
    try {
      return await Performer.findOne({
        attributes: [
          'id',
          'name',
          'active',
          'details',
          'location',
          'phone',
          'rating',
          'website',
        ],
        where: wheres,
        include: [
          {
            model: Genre,
            attributes: ['id', 'name'],
            required: false,
            through: {
              attributes: [],
            },
          },
          {
            model: Image,
            attributes: ['id', 'image', 'selected'],
            required: false,
          },
          {
            model: YoutubeLink,
            attributes: ['id', 'link'],
            required: false,
          },
          {
            model: Booking,
            attributes: ['id', ['bookingDate', 'date']],
            on: BookingJoin,
            required: false,
          },
        ],
      });
    } catch (e) {
      return {error: e};
    }
  }

  async updateImages({removeIds, newImages, userId}) {
    return await db.transaction(async (t) => {
      if (removeIds && removeIds.length > 0) {
        await Image.destroy({
          where: {
            id: removeIds,
            ownerId: this.id,
            ownerType: 'Performer',
          },
        });
      }
      if (newImages && newImages.length > 0) {
        const newRows = newImages.map((image) => {
          return {ownerId: this.id, ownerType: 'Performer', image, userId};
        });
        await Image.bulkCreate(newRows);
      }
      return await Image.findAll({
        where: {
          ownerId: this.id,
          ownerType: 'Performer',
        },
      });
    });
  }

  async updateGenres({removeIds, newGenreIds}) {
    return await db.transaction(async (t) => {
      if (removeIds && removeIds.length > 0) {
        await this.removeGenres(removeIds);
      }
      if (newGenreIds && newGenreIds.length > 0) {
        await this.addGenres(newGenreIds);
      }
      return await this.getGenres();
    });
  }

  async updateYoutubeLinks({removeIds, newLinks, userId}) {
    return await db.transaction(async (t) => {
      if (removeIds && removeIds.length > 0) {
        await YoutubeLink.destroy({
          where: {
            id: removeIds,
            ownerId: this.id,
            ownerType: 'Performer',
          },
        });
      }
      if (newLinks && newLinks.length > 0) {
        const newRows = newLinks.map((link) => {
          return {
            ownerId: this.id,
            ownerType: 'Performer',
            link,
            userId,
          };
        });
        await YoutubeLink.bulkCreate(newRows);
      }
      return await YoutubeLink.findAll({
        where: {
          ownerId: this.id,
          ownerType: 'Performer',
          userId,
        },
      });
    });
  }

  static async search(params = {}) {
    const includes = [
      {
        model: Image,
        attributes: ['id', 'image', 'selected'],
        required: true,
      },
    ];
    const wheres = {
      active: true,
      location: {
        [Op.iLike]: `%${params.location}%`,
      },
    };

    if (params.genres) {
      includes.push({
        model: Genre,
        attributes: [],
        required: true,
        through: {
          attributes: [],
        },
        where: {
          active: true,
          id: {
            [Op.in]: params.genres,
          },
        },
      });
    }

    if (params.date) {
      includes.push({
        model: Booking,
        attributes: [],
        on: BookingJoin,
        required: false,
        where: {
          bookingDate: params.date,
        },
      });
      wheres['$Bookings$'] = null;
    }

    return await Performer.findAll({
      attributes: ['id', 'name', 'rating'],
      where: wheres,
      include: includes,
    });
  }
}

Performer.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
    },
    website: {
      type: DataTypes.STRING,
    },
    rating: {
      type: DataTypes.INTEGER,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.VIRTUAL,
      get() {
        return 'performer';
      },
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: db,
    tableName: 'performers',
  },
);

module.exports = Performer;
