const db = require('../../config/database');

class BookingModel {
  static async createForUser(userId, params) {
    try {
      return await db.one(
        `
        INSERT INTO public.bookings (
          user_id,
          performer_id,
          venue_id,
          booking_date,
          status,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, now(), now())
        RETURNING *`,
        [
          userId,
          params.performer_id,
          params.venue_id,
          params.booking_date,
          params.status,
        ],
      );
    } catch (e) {
      return {error: 'Error creating a booking.'};
    }
  }
}

module.exports = BookingModel;
