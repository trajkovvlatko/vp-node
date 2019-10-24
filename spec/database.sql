--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: youplay; Tablespace: 
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    user_id integer NOT NULL,
    venue_id integer NOT NULL,
    performer_id integer NOT NULL,
    status text NOT NULL,
    booking_date date NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.bookings OWNER TO youplay;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: youplay
--

CREATE SEQUENCE public.bookings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bookings_id_seq OWNER TO youplay;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: youplay
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: genres; Type: TABLE; Schema: public; Owner: youplay; Tablespace: 
--

CREATE TABLE public.genres (
    id integer NOT NULL,
    name text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.genres OWNER TO youplay;

--
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: youplay
--

CREATE SEQUENCE public.genres_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genres_id_seq OWNER TO youplay;

--
-- Name: genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: youplay
--

ALTER SEQUENCE public.genres_id_seq OWNED BY public.genres.id;


--
-- Name: genres_performers; Type: TABLE; Schema: public; Owner: youplay; Tablespace: 
--

CREATE TABLE public.genres_performers (
    genre_id integer NOT NULL,
    performer_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.genres_performers OWNER TO youplay;

--
-- Name: images; Type: TABLE; Schema: public; Owner: youplay; Tablespace: 
--

CREATE TABLE public.images (
    id integer NOT NULL,
    user_id integer NOT NULL,
    owner_id integer NOT NULL,
    owner_type text NOT NULL,
    image text NOT NULL,
    selected boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.images OWNER TO youplay;

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: youplay
--

CREATE SEQUENCE public.images_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.images_id_seq OWNER TO youplay;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: youplay
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- Name: performers; Type: TABLE; Schema: public; Owner: youplay; Tablespace: 
--

CREATE TABLE public.performers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    phone text NOT NULL,
    details text,
    website text,
    rating integer,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.performers OWNER TO youplay;

--
-- Name: performers_id_seq; Type: SEQUENCE; Schema: public; Owner: youplay
--

CREATE SEQUENCE public.performers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.performers_id_seq OWNER TO youplay;

--
-- Name: performers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: youplay
--

ALTER SEQUENCE public.performers_id_seq OWNED BY public.performers.id;


--
-- Name: pgmigrations; Type: TABLE; Schema: public; Owner: youplay; Tablespace: 
--

CREATE TABLE public.pgmigrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);


ALTER TABLE public.pgmigrations OWNER TO youplay;

--
-- Name: pgmigrations_id_seq; Type: SEQUENCE; Schema: public; Owner: youplay
--

CREATE SEQUENCE public.pgmigrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pgmigrations_id_seq OWNER TO youplay;

--
-- Name: pgmigrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: youplay
--

ALTER SEQUENCE public.pgmigrations_id_seq OWNED BY public.pgmigrations.id;


--
-- Name: properties; Type: TABLE; Schema: public; Owner: youplay; Tablespace: 
--

CREATE TABLE public.properties (
    id integer NOT NULL,
    name text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.properties OWNER TO youplay;

--
-- Name: properties_id_seq; Type: SEQUENCE; Schema: public; Owner: youplay
--

CREATE SEQUENCE public.properties_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.properties_id_seq OWNER TO youplay;

--
-- Name: properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: youplay
--

ALTER SEQUENCE public.properties_id_seq OWNED BY public.properties.id;


--
-- Name: properties_venues; Type: TABLE; Schema: public; Owner: youplay; Tablespace: 
--

CREATE TABLE public.properties_venues (
    property_id integer NOT NULL,
    venue_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.properties_venues OWNER TO youplay;

--
-- Name: users; Type: TABLE; Schema: public; Owner: youplay; Tablespace: 
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO youplay;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: youplay
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO youplay;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: youplay
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: venues; Type: TABLE; Schema: public; Owner: youplay; Tablespace: 
--

CREATE TABLE public.venues (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    phone text NOT NULL,
    details text,
    website text,
    rating integer,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.venues OWNER TO youplay;

--
-- Name: venues_id_seq; Type: SEQUENCE; Schema: public; Owner: youplay
--

CREATE SEQUENCE public.venues_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.venues_id_seq OWNER TO youplay;

--
-- Name: venues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: youplay
--

ALTER SEQUENCE public.venues_id_seq OWNED BY public.venues.id;


--
-- Name: youtube_links; Type: TABLE; Schema: public; Owner: youplay; Tablespace: 
--

CREATE TABLE public.youtube_links (
    id integer NOT NULL,
    user_id integer NOT NULL,
    owner_id integer NOT NULL,
    owner_type text NOT NULL,
    link text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.youtube_links OWNER TO youplay;

--
-- Name: youtube_links_id_seq; Type: SEQUENCE; Schema: public; Owner: youplay
--

CREATE SEQUENCE public.youtube_links_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.youtube_links_id_seq OWNER TO youplay;

--
-- Name: youtube_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: youplay
--

ALTER SEQUENCE public.youtube_links_id_seq OWNED BY public.youtube_links.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.genres ALTER COLUMN id SET DEFAULT nextval('public.genres_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.performers ALTER COLUMN id SET DEFAULT nextval('public.performers_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.pgmigrations ALTER COLUMN id SET DEFAULT nextval('public.pgmigrations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.properties ALTER COLUMN id SET DEFAULT nextval('public.properties_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.venues ALTER COLUMN id SET DEFAULT nextval('public.venues_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.youtube_links ALTER COLUMN id SET DEFAULT nextval('public.youtube_links_id_seq'::regclass);


--
-- Name: bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: youplay; Tablespace: 
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: genres_pkey; Type: CONSTRAINT; Schema: public; Owner: youplay; Tablespace: 
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: images_pkey; Type: CONSTRAINT; Schema: public; Owner: youplay; Tablespace: 
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: performers_pkey; Type: CONSTRAINT; Schema: public; Owner: youplay; Tablespace: 
--

ALTER TABLE ONLY public.performers
    ADD CONSTRAINT performers_pkey PRIMARY KEY (id);


--
-- Name: pgmigrations_pkey; Type: CONSTRAINT; Schema: public; Owner: youplay; Tablespace: 
--

ALTER TABLE ONLY public.pgmigrations
    ADD CONSTRAINT pgmigrations_pkey PRIMARY KEY (id);


--
-- Name: properties_pkey; Type: CONSTRAINT; Schema: public; Owner: youplay; Tablespace: 
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: youplay; Tablespace: 
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: venues_pkey; Type: CONSTRAINT; Schema: public; Owner: youplay; Tablespace: 
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_pkey PRIMARY KEY (id);


--
-- Name: youtube_links_pkey; Type: CONSTRAINT; Schema: public; Owner: youplay; Tablespace: 
--

ALTER TABLE ONLY public.youtube_links
    ADD CONSTRAINT youtube_links_pkey PRIMARY KEY (id);


--
-- Name: genres_name_unique_index; Type: INDEX; Schema: public; Owner: youplay; Tablespace: 
--

CREATE UNIQUE INDEX genres_name_unique_index ON public.genres USING btree (name);


--
-- Name: properties_name_unique_index; Type: INDEX; Schema: public; Owner: youplay; Tablespace: 
--

CREATE UNIQUE INDEX properties_name_unique_index ON public.properties USING btree (name);


--
-- Name: users_email_unique_index; Type: INDEX; Schema: public; Owner: youplay; Tablespace: 
--

CREATE UNIQUE INDEX users_email_unique_index ON public.users USING btree (email);


--
-- Name: bookings_performer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_performer_id_fkey FOREIGN KEY (performer_id) REFERENCES public.performers(id);


--
-- Name: bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: bookings_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id);


--
-- Name: genres_performers_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.genres_performers
    ADD CONSTRAINT genres_performers_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id);


--
-- Name: genres_performers_performer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.genres_performers
    ADD CONSTRAINT genres_performers_performer_id_fkey FOREIGN KEY (performer_id) REFERENCES public.performers(id);


--
-- Name: images_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: performers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.performers
    ADD CONSTRAINT performers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: properties_venues_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.properties_venues
    ADD CONSTRAINT properties_venues_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: properties_venues_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.properties_venues
    ADD CONSTRAINT properties_venues_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id);


--
-- Name: venues_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: youtube_links_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: youplay
--

ALTER TABLE ONLY public.youtube_links
    ADD CONSTRAINT youtube_links_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

