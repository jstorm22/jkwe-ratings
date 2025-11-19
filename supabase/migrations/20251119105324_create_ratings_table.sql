/*
  # Create Ratings System

  1. New Tables
    - `ratings`
      - `id` (uuid, primary key) - Unique identifier for each entry
      - `title` (text) - Name of the movie or TV show
      - `type` (text) - Either 'movie' or 'tv'
      - `your_rank` (integer) - Your ranking position
      - `counterpart_rank` (integer) - Counterpart's ranking position
      - `created_at` (timestamptz) - When the entry was created
      - `updated_at` (timestamptz) - When the entry was last updated
  
  2. Security
    - Enable RLS on `ratings` table
    - Add policy for public read access (anyone can view the rankings)
    - Add policy for authenticated write access (only authenticated users can edit)
*/

CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL DEFAULT 'movie',
  your_rank integer,
  counterpart_rank integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings"
  ON ratings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert ratings"
  ON ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update ratings"
  ON ratings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete ratings"
  ON ratings
  FOR DELETE
  TO authenticated
  USING (true);