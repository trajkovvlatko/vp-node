const db = require('../../config/database');
const path = require('path');
const multer = require('multer');

class ImageModel {
  static async createForUser(userId, params = {}) {
    try {
      return await db.one(
        `INSERT INTO public.images (
          owner_id,
          owner_type,
          image,
          selected,
          user_id,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, now(), now())
        RETURNING id, image, selected`,
        [
          params.owner_id,
          params.owner_type,
          params.image,
          params.selected,
          userId,
        ],
      );
    } catch (e) {
      return {error: 'Error creating an image.'};
    }
  }

  static async deleteForUser(userId, ids = {}) {
    try {
      return await db.one(
        `DELETE FROM public.images
        WHERE user_id = $/user_id/ AND id IN ($/ids:csv/)`,
        {user_id: userId, ids: ids},
      );
    } catch (e) {
      return {error: 'Error deleting images.'};
    }
  }

  static upload(req, res, success, error) {
    const FILE_SIZE = 10000000;
    const DESTINATION = './public/uploads/';

    const newImages = [];
    const storage = multer.diskStorage({
      destination: DESTINATION,
      filename: function(req, file, cb) {
        const name = 'IMAGE-' + Math.random() + path.extname(file.originalname);
        newImages.push(name);
        cb(null, name);
      },
    });

    const upload = multer({
      storage: storage,
      limits: {fileSize: FILE_SIZE},
    }).array('images[]');

    upload(req, res, async err => {
      if (!err) {
        success(newImages);
      } else {
        error();
      }
    });
  }
}

module.exports = ImageModel;
