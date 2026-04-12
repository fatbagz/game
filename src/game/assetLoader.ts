import { GameAssets } from './types';

const ASSET_BASE_PATH = '/meem-game-items';

function loadImage(src: string, crossOrigin = false): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function createDoodleCanvas(width: number, height: number, color: string, isCircle = false): HTMLImageElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;
  ctx.fillStyle = color;

  if (isCircle) {
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width / 2 - 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillRect(3, 3, width - 6, height - 6);
    ctx.strokeRect(3, 3, width - 6, height - 6);
  }

  const img = new Image();
  img.src = canvas.toDataURL();
  return img;
}

async function loadPlayerAssets(): Promise<GameAssets['player']> {
  try {
    const mainPlayer = await loadImage(`${ASSET_BASE_PATH}/assets/character/game_meem.png`);

    return {
      idle: mainPlayer,
      run: mainPlayer,
      jump: mainPlayer,
      fall: mainPlayer,
      hurt: mainPlayer,
      win: mainPlayer,
    };
  } catch (error) {
    console.warn('Failed to load game_meem.png, using fallback');
    const fallback = createDoodleCanvas(64, 64, '#4A90E2', true);
    return {
      idle: fallback,
    };
  }
}

async function loadCollectibles(): Promise<HTMLImageElement[]> {
  const collectibles: HTMLImageElement[] = [];
  const collectibleIds = ['19', '20', '26', '30', '33'];

  for (const id of collectibleIds) {
    try {
      const img = await loadImage(`${ASSET_BASE_PATH}/game-items/${id}.png`);
      collectibles.push(img);
    } catch {
      console.warn(`Collectible ${id} not found`);
    }
  }

  if (collectibles.length === 0) {
    collectibles.push(createDoodleCanvas(32, 32, '#FFD700', true));
  }

  return collectibles;
}

async function loadEnemies(): Promise<HTMLImageElement[]> {
  const enemies: HTMLImageElement[] = [];
  const enemyIds = ['25', '35', '37'];

  for (const id of enemyIds) {
    try {
      const img = await loadImage(`${ASSET_BASE_PATH}/game-items/${id}.png`);
      enemies.push(img);
    } catch {
      console.warn(`Enemy ${id} not found`);
    }
  }

  if (enemies.length === 0) {
    enemies.push(createDoodleCanvas(32, 32, '#E74C3C', true));
  }

  return enemies;
}

const SUPABASE_STORAGE_URL = 'https://nttpiddjkjkkyglusfga.supabase.co/storage/v1/object/public/assets';

const BACKGROUND_INDICES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function loadBackgrounds(): Promise<HTMLImageElement[]> {
  const backgrounds: HTMLImageElement[] = [];

  for (const idx of BACKGROUND_INDICES) {
    try {
      const img = await loadImage(`${SUPABASE_STORAGE_URL}/Game-backround-assets/Level%20(${idx}).png`, true);
      backgrounds.push(img);
    } catch {
      console.warn(`Background ${idx} failed to load`);
    }
  }

  if (backgrounds.length === 0) {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = canvas.toDataURL();
    backgrounds.push(img);
  }

  return backgrounds;
}

async function loadEnvironment(): Promise<HTMLImageElement[]> {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 40;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#4A90E2';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;

  ctx.fillRect(3, 3, canvas.width - 6, canvas.height - 6);
  ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);

  const img = new Image();
  img.src = canvas.toDataURL();
  return [img];
}

async function loadLuxuryItems(): Promise<Record<string, HTMLImageElement>> {
  const items: Record<string, HTMLImageElement> = {};
  const itemPaths = {
    lambo: '/meem-game-items/assets/character -items/lambo.png',
    ferrari: '/meem-game-items/assets/character -items/ferrari.png',
    chain: '/meem-game-items/assets/character -items/chain2.png',
    chopper: '/meem-game-items/assets/character -items/chopper.png',
  };

  for (const [key, path] of Object.entries(itemPaths)) {
    try {
      items[key] = await loadImage(path);
    } catch (error) {
      console.warn(`Failed to load ${key} at ${path}`);
    }
  }

  return items;
}

async function loadDonut(): Promise<HTMLImageElement | undefined> {
  try {
    return await loadImage('https://nttpiddjkjkkyglusfga.supabase.co/storage/v1/object/public/assets/donut%20.gif');
  } catch (error) {
    console.warn('Failed to load donut gif');
    return undefined;
  }
}

export async function loadGameAssets(): Promise<GameAssets> {
  try {
    const [player, collectibles, enemies, backgrounds, environment, luxuryItems, donut] = await Promise.all([
      loadPlayerAssets(),
      loadCollectibles(),
      loadEnemies(),
      loadBackgrounds(),
      loadEnvironment(),
      loadLuxuryItems(),
      loadDonut(),
    ]);

    return {
      player,
      collectibles,
      enemies,
      backgrounds,
      environment,
      luxuryItems,
      donut,
    };
  } catch (error) {
    console.error('Error loading game assets:', error);

    return {
      player: {
        idle: createDoodleCanvas(64, 64, '#4A90E2', true),
      },
      collectibles: [createDoodleCanvas(32, 32, '#FFD700', true)],
      enemies: [createDoodleCanvas(32, 32, '#E74C3C', true)],
      backgrounds: [createDoodleCanvas(1600, 900, '#87CEEB')],
      environment: [createDoodleCanvas(100, 40, '#4A90E2')],
      luxuryItems: {},
    };
  }
}
