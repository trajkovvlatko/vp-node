const {DataTypes, Model} = require('sequelize');
const sequelize = require('../../config/database');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const data = fs.readFileSync('./config/default.json');
const env = process.env.NODE_ENV || 'development';
const {host, dir, link} = JSON.parse(data).upload[env];

class Image extends Model {
  static upload(req, res, imagePath) {
    return new Promise((resolve, reject) => {
      const fileSize = 10000000;
      const destination = `./${dir}/${imagePath}/`;
      const newImages = [];
      const storage = multer.diskStorage({
        destination,
        filename: function (_, file, cb) {
          const ext = path.extname(file.originalname);
          const name = `/image-${Math.random()}${ext}`;
          newImages.push(`${imagePath}${name}`);
          cb(null, name);
        },
      });

      const upload = multer({
        storage: storage,
        limits: {fileSize},
      }).array('images[]');

      upload(req, res, async (err) => {
        if (!err) {
          resolve(newImages);
        } else {
          reject();
        }
      });
    });
  }
}

Image.init(
  {
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ownerType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    selected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: {
      type: new DataTypes.VIRTUAL(DataTypes.STRING, ['image']),
      get() {
        return `${host}/${link}/${this.get('image')}`;
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
    sequelize,
    tableName: 'images',
  },
);

module.exports = Image;
