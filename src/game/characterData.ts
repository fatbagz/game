import type { Character, Skin } from './types';

export const CHARACTERS: Character[] = [
  {
    id: 'meem_original',
    name: 'OG MEEM',
    color: '#FFD700',
    unlocked: true,
    cost: 0
  },
  {
    id: 'meem_green',
    name: 'Green MEEM',
    color: '#10B981',
    unlocked: false,
    cost: 1000
  },
  {
    id: 'meem_red',
    name: 'Red MEEM',
    color: '#EF4444',
    unlocked: false,
    cost: 1500
  },
  {
    id: 'meem_purple',
    name: 'Purple MEEM',
    color: '#A855F7',
    unlocked: false,
    cost: 2000
  },
  {
    id: 'meem_blue',
    name: 'Blue MEEM',
    color: '#3B82F6',
    unlocked: false,
    cost: 2500
  },
  {
    id: 'meem_pink',
    name: 'Pink MEEM',
    color: '#EC4899',
    unlocked: false,
    cost: 3000
  },
  {
    id: 'meem_gold',
    name: 'Gold MEEM',
    color: '#F59E0B',
    unlocked: false,
    cost: 5000
  }
];

export const SKINS: Skin[] = [
  {
    id: 'chain_gold',
    name: 'Gold Chain',
    type: 'chain',
    unlocked: false,
    cost: 500
  },
  {
    id: 'glasses_thug',
    name: 'Thug Glasses',
    type: 'glasses',
    unlocked: false,
    cost: 750
  },
  {
    id: 'hat_backwards',
    name: 'Backwards Cap',
    type: 'hat',
    unlocked: false,
    cost: 600
  },
  {
    id: 'cigar_smoke',
    name: 'Cigar',
    type: 'cigar',
    unlocked: false,
    cost: 800
  }
];
