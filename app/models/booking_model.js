const db = require('../../config/database');

class BookingModel {
  static async createForUser(userId, params) {
    try {
      return await db.one(
        `
        INSERT INTO public.bookings (
          from_user_id,
          to_user_id,
          requester_id,
          requester_type,
          requested_id,
          requested_type,
          booking_date,
          status,
          created_at,
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now(), now())
        RETURNING *`,
        [
          userId,
          params.toUserId,
          params.requesterId,
          params.requesterType,
          params.requestedId,
          params.requestedType,
          params.bookingDate,
          params.status,
        ]
      );
    } catch (e) {
      return {error: 'Error creating a booking.'};
    }
  }
}

module.exports = BookingModel;
