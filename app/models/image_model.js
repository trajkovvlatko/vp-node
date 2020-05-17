const {DataTypes, Model} = require('sequelize');
const sequelize = require('../../config/database');
const path = require('path');
const multer = require('multer');

class Image extends Model {
  static upload(req, res) {
    return new Promise((resolve, reject) => {
      if (typeof req.files === 'undefined' || req.files.length === 0) {
        resolve([]);
      }

      const FILE_SIZE = 10000000;
      const DESTINATION = './public/uploads/';
      const newImages = [];
      const storage = multer.diskStorage({
        destination: DESTINATION,
        filename: function (_, file, cb) {
          const name =
            'IMAGE-' + Math.random() + path.extname(file.originalname);
          newImages.push(name);
          cb(null, name);
        },
      });

      const upload = multer({
        storage: storage,
        limits: {fileSize: FILE_SIZE},
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
