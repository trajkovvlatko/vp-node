const db = require('../../config/database');

class YoutubeLinkModel {
  static async allForOwner(ownerId, ownerType) {
    try {
      return await db.any(`
        SELECT id, link
        FROM public.youtube_links
        WHERE owner_id = $1
        AND owner_type = $2
        ORDER BY id`, ownerId, ownerType);
    } catch (e) {
      return {error: e};
    }
  }
}

module.exports = YoutubeLinkModel;
