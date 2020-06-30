--
-- PostgreSQL database dump
--

-- Dumped from database version 11.6
-- Dumped by pg_dump version 11.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: docker_pg_user
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    "fromUserId" integer NOT NULL,
    "toUserId" integer NOT NULL,
    "requesterType" text NOT NULL,
    "requesterId" integer NOT NULL,
    "requestedType" text NOT NULL,
    "requestedId" integer NOT NULL,
    status text NOT NULL,
    "bookingDate" date NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.bookings OWNER TO docker_pg_user;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: docker_pg_user
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bookings_id_seq OWNER TO docker_pg_user;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker_pg_user
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: genres; Type: TABLE; Schema: public; Owner: docker_pg_user
--

CREATE TABLE public.genres (
    id integer NOT NULL,
    name text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.genres OWNER TO docker_pg_user;

--
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: docker_pg_user
--

CREATE SEQUENCE public.genres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genres_id_seq OWNER TO docker_pg_user;

--
-- Name: genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker_pg_user
--

ALTER SEQUENCE public.genres_id_seq OWNED BY public.genres.id;


--
-- Name: genres_performers; Type: TABLE; Schema: public; Owner: docker_pg_user
--

CREATE TABLE public.genres_performers (
    "genreId" integer NOT NULL,
    "performerId" integer NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.genres_performers OWNER TO docker_pg_user;

--
-- Name: images; Type: TABLE; Schema: public; Owner: docker_pg_user
--

CREATE TABLE public.images (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "ownerId" integer NOT NULL,
    "ownerType" text NOT NULL,
    image text NOT NULL,
    selected boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.images OWNER TO docker_pg_user;

--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: docker_pg_user
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.images_id_seq OWNER TO docker_pg_user;

--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker_pg_user
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- Name: performers; Type: TABLE; Schema: public; Owner: docker_pg_user
--

CREATE TABLE public.performers (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    details text,
    website text,
    rating integer,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.performers OWNER TO docker_pg_user;

--
-- Name: performers_id_seq; Type: SEQUENCE; Schema: public; Owner: docker_pg_user
--

CREATE SEQUENCE public.performers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.performers_id_seq OWNER TO docker_pg_user;

--
-- Name: performers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker_pg_user
--

ALTER SEQUENCE public.performers_id_seq OWNED BY public.performers.id;


--
-- Name: pgmigrations; Type: TABLE; Schema: public; Owner: docker_pg_user
--

CREATE TABLE public.pgmigrations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    run_on timestamp without time zone NOT NULL
);


ALTER TABLE public.pgmigrations OWNER TO docker_pg_user;

--
-- Name: pgmigrations_id_seq; Type: SEQUENCE; Schema: public; Owner: docker_pg_user
--

CREATE SEQUENCE public.pgmigrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pgmigrations_id_seq OWNER TO docker_pg_user;

--
-- Name: pgmigrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker_pg_user
--

ALTER SEQUENCE public.pgmigrations_id_seq OWNED BY public.pgmigrations.id;


--
-- Name: properties; Type: TABLE; Schema: public; Owner: docker_pg_user
--

CREATE TABLE public.properties (
    id integer NOT NULL,
    name text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.properties OWNER TO docker_pg_user;

--
-- Name: properties_id_seq; Type: SEQUENCE; Schema: public; Owner: docker_pg_user
--

CREATE SEQUENCE public.properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.properties_id_seq OWNER TO docker_pg_user;

--
-- Name: properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker_pg_user
--

ALTER SEQUENCE public.properties_id_seq OWNED BY public.properties.id;


--
-- Name: properties_venues; Type: TABLE; Schema: public; Owner: docker_pg_user
--

CREATE TABLE public.properties_venues (
    "propertyId" integer NOT NULL,
    "venueId" integer NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.properties_venues OWNER TO docker_pg_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: docker_pg_user
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO docker_pg_user;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: docker_pg_user
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO docker_pg_user;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker_pg_user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: venues; Type: TABLE; Schema: public; Owner: docker_pg_user
--

CREATE TABLE public.venues (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    address text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    details text,
    website text,
    rating integer,
    active boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.venues OWNER TO docker_pg_user;

--
-- Name: venues_id_seq; Type: SEQUENCE; Schema: public; Owner: docker_pg_user
--

CREATE SEQUENCE public.venues_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.venues_id_seq OWNER TO docker_pg_user;

--
-- Name: venues_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker_pg_user
--

ALTER SEQUENCE public.venues_id_seq OWNED BY public.venues.id;


--
-- Name: youtube_links; Type: TABLE; Schema: public; Owner: docker_pg_user
--

CREATE TABLE public.youtube_links (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "ownerId" integer NOT NULL,
    "ownerType" text NOT NULL,
    link text NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone NOT NULL
);


ALTER TABLE public.youtube_links OWNER TO docker_pg_user;

--
-- Name: youtube_links_id_seq; Type: SEQUENCE; Schema: public; Owner: docker_pg_user
--

CREATE SEQUENCE public.youtube_links_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.youtube_links_id_seq OWNER TO docker_pg_user;

--
-- Name: youtube_links_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker_pg_user
--

ALTER SEQUENCE public.youtube_links_id_seq OWNED BY public.youtube_links.id;


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: genres id; Type: DEFAULT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.genres ALTER COLUMN id SET DEFAULT nextval('public.genres_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- Name: performers id; Type: DEFAULT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.performers ALTER COLUMN id SET DEFAULT nextval('public.performers_id_seq'::regclass);


--
-- Name: pgmigrations id; Type: DEFAULT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.pgmigrations ALTER COLUMN id SET DEFAULT nextval('public.pgmigrations_id_seq'::regclass);


--
-- Name: properties id; Type: DEFAULT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.properties ALTER COLUMN id SET DEFAULT nextval('public.properties_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: venues id; Type: DEFAULT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.venues ALTER COLUMN id SET DEFAULT nextval('public.venues_id_seq'::regclass);


--
-- Name: youtube_links id; Type: DEFAULT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.youtube_links ALTER COLUMN id SET DEFAULT nextval('public.youtube_links_id_seq'::regclass);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: performers performers_pkey; Type: CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.performers
    ADD CONSTRAINT performers_pkey PRIMARY KEY (id);


--
-- Name: pgmigrations pgmigrations_pkey; Type: CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.pgmigrations
    ADD CONSTRAINT pgmigrations_pkey PRIMARY KEY (id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: venues venues_pkey; Type: CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venues_pkey PRIMARY KEY (id);


--
-- Name: youtube_links youtube_links_pkey; Type: CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.youtube_links
    ADD CONSTRAINT youtube_links_pkey PRIMARY KEY (id);


--
-- Name: genres_name_unique_index; Type: INDEX; Schema: public; Owner: docker_pg_user
--

CREATE UNIQUE INDEX genres_name_unique_index ON public.genres USING btree (name);


--
-- Name: properties_name_unique_index; Type: INDEX; Schema: public; Owner: docker_pg_user
--

CREATE UNIQUE INDEX properties_name_unique_index ON public.properties USING btree (name);


--
-- Name: users_email_unique_index; Type: INDEX; Schema: public; Owner: docker_pg_user
--

CREATE UNIQUE INDEX users_email_unique_index ON public.users USING btree (email);


--
-- Name: bookings bookings_fromUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "bookings_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES public.users(id);


--
-- Name: bookings bookings_toUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT "bookings_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES public.users(id);


--
-- Name: genres_performers genres_performers_genreId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.genres_performers
    ADD CONSTRAINT "genres_performers_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES public.genres(id);


--
-- Name: genres_performers genres_performers_performerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.genres_performers
    ADD CONSTRAINT "genres_performers_performerId_fkey" FOREIGN KEY ("performerId") REFERENCES public.performers(id);


--
-- Name: images images_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT "images_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: performers performers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.performers
    ADD CONSTRAINT "performers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: properties_venues properties_venues_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.properties_venues
    ADD CONSTRAINT "properties_venues_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public.properties(id);


--
-- Name: properties_venues properties_venues_venueId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.properties_venues
    ADD CONSTRAINT "properties_venues_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES public.venues(id);


--
-- Name: venues venues_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT "venues_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: youtube_links youtube_links_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker_pg_user
--

ALTER TABLE ONLY public.youtube_links
    ADD CONSTRAINT "youtube_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--
