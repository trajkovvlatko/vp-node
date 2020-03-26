function sqlGetPerformer() {
  return `
    SELECT
      performers.*,
      COALESCE(gen.list, '[]'::json) AS genres_list,
      COALESCE(yt.list, '[]'::json) AS youtube_links_list,
      COALESCE(img.list, '[]'::json) AS images_list,
      COALESCE(booking.list, '[]'::json) AS bookings_list
    FROM public.performers

    JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'id'::text, images.id,
          'image'::text, images.image,
          'selected'::text, images.selected
        )
      ) AS list
      FROM public.images
      WHERE images.owner_type = 'Performer'
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
      WHERE youtube_links.owner_type = 'Performer'
      AND youtube_links.owner_id = $1
    ) yt ON true

    JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'id'::text, genres.id,
          'name'::text, genres.name
        )
      ) AS list
      FROM public.genres

      JOIN public.genres_performers
        ON genres_performers.performer_id = performers.id
        AND genres_performers.genre_id = genres.id

      WHERE genres.id = genres_performers.genre_id
      AND genres.active IS TRUE
    ) gen ON true

    JOIN LATERAL (
      SELECT json_agg(
        json_build_object(
          'date'::text, bookings.booking_date,
          'venue_id'::text, venues.id,
          'venue_name'::text, venues.name
        )
      ) AS list
      FROM public.bookings

      JOIN public.venues
        ON (
          bookings.requester_id = venues.id
          AND bookings.requester_type = 'venue'
        )
        OR (
          bookings.requested_id = venues.id
          AND bookings.requested_type = 'venue'
        )

      WHERE (
        bookings.requester_id = $1
        AND bookings.requester_type = 'performer'
      )
      OR (
        bookings.requested_id = $1
        AND bookings.requested_type = 'performer'
      )
    ) booking ON true


    `;
}

module.exports = {sqlGetPerformer};
