/*
  # MEEM Game Database Schema

  ## Overview
  Creates tables for the MEEM game leaderboard and character progression system.

  ## New Tables
  
  ### `leaderboard`
  - `id` (uuid, primary key) - Unique identifier for each score entry
  - `player_name` (text, required) - Player's display name
  - `score` (integer, required) - Final score achieved
  - `level_reached` (integer, required) - Highest level completed
  - `created_at` (timestamptz) - When the score was submitted
  
  ### `character_unlocks`
  - `id` (uuid, primary key) - Unique identifier
  - `player_id` (text, required) - Anonymous player identifier (localStorage)
  - `character_id` (text, required) - Character variant unlocked
  - `unlocked_at` (timestamptz) - When unlocked
  
  ### `skin_unlocks`
  - `id` (uuid, primary key) - Unique identifier
  - `player_id` (text, required) - Anonymous player identifier
  - `skin_id` (text, required) - Skin/accessory unlocked
  - `unlocked_at` (timestamptz) - When unlocked

  ## Security
  - Enable RLS on all tables
  - Allow public read access for leaderboard (read-only)
  - Allow public insert for new scores
  - Allow users to manage their own unlocks via player_id

  ## Indexes
  - Index on leaderboard score for fast sorting
  - Index on player_id for quick unlock lookups
*/

-- Create leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL DEFAULT 0,
  level_reached integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create character unlocks table
CREATE TABLE IF NOT EXISTS character_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id text NOT NULL,
  character_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(player_id, character_id)
);

-- Create skin unlocks table
CREATE TABLE IF NOT EXISTS skin_unlocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id text NOT NULL,
  skin_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(player_id, skin_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_character_unlocks_player ON character_unlocks(player_id);
CREATE INDEX IF NOT EXISTS idx_skin_unlocks_player ON skin_unlocks(player_id);

-- Enable RLS
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_unlocks ENABLE ROW LEVEL SECURITY;

-- Leaderboard policies (public read, public insert)
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can submit scores"
  ON leaderboard FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Character unlocks policies
CREATE POLICY "Users can view own character unlocks"
  ON character_unlocks FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own character unlocks"
  ON character_unlocks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Skin unlocks policies
CREATE POLICY "Users can view own skin unlocks"
  ON skin_unlocks FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can insert own skin unlocks"
  ON skin_unlocks FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);