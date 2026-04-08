import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getPlayerId(): string {
  let playerId = localStorage.getItem('meem_player_id');
  if (!playerId) {
    playerId = `player_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem('meem_player_id', playerId);
  }
  return playerId;
}
