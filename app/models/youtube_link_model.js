const db = require('../../config/database');

class YoutubeLinkModel {
  static async allForOwner(ownerId, ownerType) {
    try {
      return await db.any(
        `
        SELECT id, link
        FROM public.youtube_links
        WHERE owner_id = $1
        AND owner_type = $2
        ORDER BY link`,
        [ownerId, ownerType],
      );
    } catch (e) {
      return {error: e};
    }
  }

  static async createForOwner(ownerId, ownerType, link, userId) {
    try {
      return await db.one(
        `
        INSERT INTO public.youtube_links (
          user_id,
          owner_id,
          owner_type,
          link,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, now(), now())
        RETURNING id, link`,
        [userId, ownerId, ownerType, link],
      );
    } catch (e) {
      return {error: 'Error creating a youtube link.'};
    }
  }

  static async deleteForOwner(ownerId, ownerType, ids) {
    try {
      return await db.one(
        `DELETE FROM public.youtube_links
        WHERE owner_id = $/owner_id/
        AND owner_type = $/owner_type/
        AND id IN ($/ids:csv/)`,
        {owner_id: ownerId, owner_type: ownerType, ids: ids},
      );
    } catch (e) {
      return {error: 'Error deleting youtube links.'};
    }
  }
}

module.exports = YoutubeLinkModel;
