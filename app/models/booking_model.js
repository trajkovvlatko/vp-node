const db = require('../../config/database');
const {sqlSelectBooking} = require('./helpers/booking_helper');

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
        ],
      );
    } catch (e) {
      return {error: 'Error creating a booking.'};
    }
  }

  static async requestedForUser(userId) {
    try {
      return await db.any(
        `
        ${sqlSelectBooking()}
        WHERE to_user_id = $1
        AND status = 'requested'
      `,
        [userId],
      );
    } catch (e) {
      return {error: 'Error fetching bookings.'};
    }
  }

  static async upcoming(userId) {
    try {
      return await db.any(
        `
        ${sqlSelectBooking()}
        WHERE (status = 'accepted' OR status = 'canceled')
        AND (from_user_id = $1 OR to_user_id = $1)
      `,
        [userId],
      );
    } catch (e) {
      return {error: 'Error fetching bookings.'};
    }
  }

  static async findForUser(userId, id) {
    try {
      return await db.one(
        `
        ${sqlSelectBooking()}
        WHERE to_user_id = $1
        AND bookings.id = $2
      `,
        [userId, id],
      );
    } catch (e) {
      return {error: 'Error fetching booking.'};
    }
  }

  static async updateForUser(userId, id, options = {}) {
    try {
      return await db.one(
        `
        UPDATE public.bookings
        SET status = $1
        WHERE
        id = $2
        AND (
          from_user_id = $3
          OR to_user_id = $3
        ) 
        RETURNING *
      `,
        [options.status, id, userId],
      );
    } catch (e) {
      return {error: 'Error updating booking.'};
    }
  }
}

module.exports = BookingModel;
