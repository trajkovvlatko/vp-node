function sqlGetVenue() {
  return `
    SELECT
      venues.*,
      COALESCE(prop.list, '[]'::json) AS properties_list,
      COALESCE(yt.list, '[]'::json) AS youtube_links_list,
      COALESCE(img.list, '[]'::json) AS images_list,
      COALESCE(booking.list, '[]'::json) AS bookings_list
    FROM public.venues

    JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'id'::text, images.id,
          'image'::text, images.image,
          'selected'::text, images.selected
        )
      ) AS list
      FROM public.images
      WHERE images.owner_type = 'Venue'
      AND images.owner_id = $1
    ) img ON true

    JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'id'::text, youtube_links.id,
          'link'::text, youtube_links.link
        )
      ) AS list
      FROM public.youtube_links
      WHERE youtube_links.owner_type = 'Venue'
      AND youtube_links.owner_id = $1
    ) yt ON true

    JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'id'::text, properties.id,
          'name'::text, properties.name
        )
      ) AS list
      FROM public.properties

      JOIN public.properties_venues
        ON properties_venues.venue_id = venues.id
        AND properties_venues.property_id = properties.id

      WHERE properties.id = properties_venues.property_id
      AND properties.active IS TRUE
    ) prop ON true

    JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'date'::text, bookings.booking_date,
          'performer_id'::text, performers.id,
          'performer_name'::text, performers.name
        )
      ) AS list
      FROM public.bookings

      JOIN public.performers
        ON (
          bookings.requester_id = performers.id
          AND bookings.requester_type = 'performer'
        )
        OR (
          bookings.requested_id = performers.id
          AND bookings.requested_type = 'performer'
        )

      WHERE (
        bookings.requester_id = $1
        AND bookings.requester_type = 'venue'
      )
      OR (
        bookings.requested_id = $1
        AND bookings.requested_type = 'venue'
      )
    ) booking ON true
    `;
}

module.exports = { sqlGetVenue };
