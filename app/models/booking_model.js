const db = require('../../config/database');

class BookingModel {
  static async createForUser(userId, params) {
    try {
      return await db.one(
        `
        INSERT INTO public.bookings (
          from_user_id,
          to_user_id,
          requester_type,
          requester_id,
          requested_type,
          requested_id,
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
          params.requesterType,
          params.requesterId,
          params.requestedType,
          params.requestedId,
          params.bookingDate,
          params.status,
        ]
      );
    } catch (e) {
      return { error: 'Error creating a booking.' };
    }
  }

  static async requestedForUser(userId) {
    try {
      return await db.any(`
        SELECT
          bookings.id,
          requester_type,
          requested_type,
          performers.name AS performer_name,
          venues.name AS venue_name
        FROM public.bookings
        JOIN performers
          ON (performers.id = requester_id AND requester_type = 'performer')
          OR (performers.id = requested_id AND requested_type = 'performer')
        JOIN venues
          ON (venues.id = requester_id AND requester_type = 'venue')
          OR (venues.id = requested_id AND requested_type = 'venue')
        WHERE to_user_id = $1
      `, [userId]);
    } catch (e) {
      return { error: 'Error fetching bookings.' };
    }
  }

  static async findForUser(userId, id) {
    try {
      return await db.one(`
        SELECT *
        FROM public.bookings
        WHERE to_user_id = $1
        AND id = $2
      `, [userId, id]);
    } catch (e) {
      return { error: 'Error fetching booking.' };
    }
  }
}

module.exports = BookingModel;
