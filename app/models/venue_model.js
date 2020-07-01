const {Op, DataTypes, Model, fn, col, where} = require('sequelize');
const db = require('../../config/database');
const Property = require('./property_model');
const Booking = require('./booking_model');
const YoutubeLink = require('./youtube_link_model');
const Image = require('./image_model');

const BookingJoin = {
  [Op.or]: [
    {
      requesterId: {[Op.eq]: col('Venue.id')},
      requesterType: 'Venue',
    },
    {
      requestedId: {[Op.eq]: col('Venue.id')},
      requestedType: 'Venue',
    },
  ],
};

class Venue extends Model {
  static associate(models) {
    Venue.belongsToMany(models.Property, {
      through: 'properties_venues',
      foreignKey: 'venueId',
    });

    Venue.hasMany(models.Image, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: {
        ownerType: 'Venue',
      },
    });

    Venue.hasMany(models.YoutubeLink, {
      foreignKey: 'ownerId',
      constraints: false,
      scope: {
        ownerType: 'Venue',
      },
    });

    Venue.hasMany(models.Booking);
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
      return await Venue.findAll({
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
      return await Venue.findOne({where: wheres});
    } catch (e) {
      return {error: e};
    }
  }

  static async find(id, userId) {
    const wheres = {id: id};
    if (userId) {
      // if user is present, allow fetching of inactive venues
      wheres.userId = userId;
    } else {
      wheres.active = true;
    }
    try {
      return await Venue.findOne({
        attributes: [
          'id',
          'name',
          'email',
          'address',
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
            model: Property,
            attributes: ['id', 'name'],
            required: false,
            through: {
              attributes: [],
            },
          },
          {
            model: Image,
            attributes: ['id', 'image', 'imageUrl', 'selected'],
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

  async updateImages({removeIds, newImages, selectedId, userId}) {
    return await db.transaction(async () => {
      if (removeIds && removeIds.length > 0) {
        await Image.destroy({
          where: {
            id: removeIds,
            ownerId: this.id,
            ownerType: 'Venue',
          },
        });
      }
      if (newImages && newImages.length > 0) {
        const newRows = newImages.map((image) => {
          return {ownerId: this.id, ownerType: 'Venue', image, userId};
        });
        await Image.bulkCreate(newRows);
      }
      const finder = {ownerId: this.id, ownerType: 'Venue'};

      const all = await Image.findAll({where: finder});
      const currentlySelected = all.filter((img) => img.selected)[0];
      if (!currentlySelected && all.length > 0) {
        selectedId = all[0].id;
      }

      if (selectedId) {
        const selectedImage = await Image.findByPk(selectedId);
        if (selectedImage) {
          await Image.update({selected: false}, {where: finder});
          selectedImage.selected = true;
          await selectedImage.save();
        }
      }

      return await Image.findAll({where: finder, order: [['id', 'ASC']]});
    });
  }

  async updateProperties(propertyIds = []) {
    if (propertyIds.length > 0) {
      await this.setProperties(propertyIds);
    }
    return await this.getProperties();
  }

  async updateYoutubeLinks({removeIds, newLinks, userId}) {
    return await db.transaction(async (t) => {
      if (removeIds && removeIds.length > 0) {
        await YoutubeLink.destroy({
          where: {
            id: removeIds,
            ownerId: this.id,
            ownerType: 'Venue',
          },
        });
      }
      if (newLinks && newLinks.length > 0) {
        const newRows = newLinks.map((link) => {
          return {
            ownerId: this.id,
            ownerType: 'Venue',
            link,
            userId,
          };
        });
        await YoutubeLink.bulkCreate(newRows);
      }
      return await YoutubeLink.findAll({
        where: {
          ownerId: this.id,
          ownerType: 'Venue',
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

    if (params.properties) {
      includes.push({
        model: Property,
        attributes: [],
        required: true,
        through: {
          attributes: [],
        },
        where: {
          active: true,
          id: {
            [Op.in]: params.properties,
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

    return await Venue.findAll({
      attributes: ['id', 'name', 'rating'],
      where: wheres,
      include: includes,
    });
  }
}

Venue.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
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
        return 'venue';
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
    tableName: 'venues',
  },
);

module.exports = Venue;
