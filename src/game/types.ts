export interface Vector2 {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameAssets {
  player: {
    idle?: HTMLImageElement;
    run?: HTMLImageElement;
    jump?: HTMLImageElement;
    fall?: HTMLImageElement;
    hurt?: HTMLImageElement;
    win?: HTMLImageElement;
  };
  collectibles: HTMLImageElement[];
  enemies: HTMLImageElement[];
  backgrounds: HTMLImageElement[];
  environment: HTMLImageElement[];
  luxuryItems: Record<string, HTMLImageElement>;
  donut?: HTMLImageElement;
}

export interface PlayerState {
  position: Vector2;
  velocity: Vector2;
  width: number;
  height: number;
  grounded: boolean;
  facing: 'left' | 'right';
  state: 'idle' | 'run' | 'jump' | 'fall' | 'hurt' | 'win';
  invulnerable: boolean;
  invulnerableTimer: number;
}

export interface Enemy {
  id: string;
  position: Vector2;
  width: number;
  height: number;
  velocity: Vector2;
  patrolStart: number;
  patrolEnd: number;
  active: boolean;
}

export interface Collectible {
  id: string;
  position: Vector2;
  width: number;
  height: number;
  collected: boolean;
  value: number;
  assetIndex: number;
  animationTimer: number;
  type?: 'coin' | 'donut';
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'normal' | 'springboard' | 'floating_block';
}

export interface Level {
  id: number;
  name: string;
  platforms: Platform[];
  enemies: Omit<Enemy, 'id' | 'active'>[];
  collectibles: Omit<Collectible, 'id' | 'collected' | 'animationTimer'>[];
  donuts?: Omit<Collectible, 'id' | 'collected' | 'animationTimer'>[];
  startPosition: Vector2;
  goalPosition: Vector2;
  backgroundIndex: number;
  width: number;
  height: number;
}

export interface GameState {
  currentLevel: number;
  score: number;
  lives: number;
  screen: 'menu' | 'playing' | 'levelComplete' | 'gameOver' | 'levelSelect' | 'howToPlay' | 'leaderboard' | 'characterSelect';
  levelUnlocked: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  jumpPressed: boolean;
}

export interface Character {
  id: string;
  name: string;
  color: string;
  unlocked: boolean;
  cost: number;
}

export interface Skin {
  id: string;
  name: string;
  type: 'chain' | 'glasses' | 'hat' | 'cigar';
  unlocked: boolean;
  cost: number;
}

export interface PlayerCustomization {
  characterId: string;
  equippedSkins: string[];
}

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  score: number;
  level_reached: number;
  created_at: string;
}
