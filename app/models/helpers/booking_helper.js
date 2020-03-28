function sqlSelectBooking() {
  return `
    SELECT 
      bookings.*,
      performers.id AS performer_id,
      performers.name AS performer_name,
      venues.id AS venue_id,
      venues.name AS venue_name
    FROM public.bookings
    JOIN performers
      ON (performers.id = requester_id AND requester_type = 'performer')
      OR (performers.id = requested_id AND requested_type = 'performer')
    JOIN venues
      ON (venues.id = requester_id AND requester_type = 'venue')
      OR (venues.id = requested_id AND requested_type = 'venue')
  `;
}

module.exports = {sqlSelectBooking};
