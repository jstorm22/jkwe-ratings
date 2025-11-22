/*
  # Allow anonymous write access to ratings table

  1. Security Changes
    - Update INSERT policy to allow both anonymous and authenticated users
    - Update UPDATE policy to allow both anonymous and authenticated users
    - Update DELETE policy to allow both anonymous and authenticated users
    
  This allows the application to work without requiring user authentication,
  which is appropriate for a personal movie tracking application.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can insert ratings" ON ratings;
DROP POLICY IF EXISTS "Authenticated users can update ratings" ON ratings;
DROP POLICY IF EXISTS "Authenticated users can delete ratings" ON ratings;

-- Create new policies that allow anonymous access
CREATE POLICY "Anyone can insert ratings"
  ON ratings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update ratings"
  ON ratings
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete ratings"
  ON ratings
  FOR DELETE
  TO anon, authenticated
  USING (true);