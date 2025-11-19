/*
  # Update Cinema Sage Movie Database Schema

  1. Schema Changes
    - Add comprehensive movie metadata fields:
      - `poster_url` (text) - Movie poster image URL
      - `year` (integer) - Release year
      - `franchise` (text) - Series/franchise name
      - `synopsis` (text) - Movie description/blurb
      - `runtime` (integer) - Runtime in minutes
      - `genre` (text) - Movie genre
      - `director` (text) - Director name
      - `producers` (text) - Producer names
      - `budget` (text) - Production budget
      - `distributed_by` (text) - Distribution company
      - `imdb_url` (text) - IMDb URL for the movie
      - `episode_url` (text) - Podcast episode URL
      - `sort_order` (integer) - For manual ordering
      - `jonathan_rank` (integer) - Jonathan's ranking position
      - `karl_rank` (integer) - Karl's ranking position
    
    - Rename existing columns:
      - `your_rank` → `jonathan_rating` (for clarity)
      - `counterpart_rank` → `karl_rating` (for clarity)
    
    - Remove `type` column (not needed for movies-only site)

  2. Security
    - Maintain existing RLS policies
    - Keep table publicly readable
*/

-- Add new columns for movie metadata
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'poster_url') THEN
    ALTER TABLE ratings ADD COLUMN poster_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'year') THEN
    ALTER TABLE ratings ADD COLUMN year integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'franchise') THEN
    ALTER TABLE ratings ADD COLUMN franchise text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'synopsis') THEN
    ALTER TABLE ratings ADD COLUMN synopsis text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'runtime') THEN
    ALTER TABLE ratings ADD COLUMN runtime integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'genre') THEN
    ALTER TABLE ratings ADD COLUMN genre text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'director') THEN
    ALTER TABLE ratings ADD COLUMN director text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'producers') THEN
    ALTER TABLE ratings ADD COLUMN producers text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'budget') THEN
    ALTER TABLE ratings ADD COLUMN budget text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'distributed_by') THEN
    ALTER TABLE ratings ADD COLUMN distributed_by text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'imdb_url') THEN
    ALTER TABLE ratings ADD COLUMN imdb_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'episode_url') THEN
    ALTER TABLE ratings ADD COLUMN episode_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'sort_order') THEN
    ALTER TABLE ratings ADD COLUMN sort_order integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'jonathan_rank') THEN
    ALTER TABLE ratings ADD COLUMN jonathan_rank integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'karl_rank') THEN
    ALTER TABLE ratings ADD COLUMN karl_rank integer;
  END IF;
END $$;

-- Rename columns for clarity
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'your_rank') THEN
    ALTER TABLE ratings RENAME COLUMN your_rank TO jonathan_rating;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'counterpart_rank') THEN
    ALTER TABLE ratings RENAME COLUMN counterpart_rank TO karl_rating;
  END IF;
END $$;