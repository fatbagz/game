import { Level, Platform, Enemy, Collectible } from './types';

interface DifficultyTier {
  name: string;
  levelLength: { min: number; max: number };
  platformWidth: { min: number; max: number };
  gapSize: { min: number; max: number };
  platformHeightVariation: number;
  enemyCount: { min: number; max: number };
  enemySpeed: { min: number; max: number };
  collectibleDensity: number;
  startHeight: number;
}

const DIFFICULTY_TIERS: Record<string, DifficultyTier> = {
  beginner: {
    name: 'Beginner',
    levelLength: { min: 2500, max: 3500 },
    platformWidth: { min: 250, max: 400 },
    gapSize: { min: 80, max: 150 },
    platformHeightVariation: 50,
    enemyCount: { min: 1, max: 3 },
    enemySpeed: { min: 0.8, max: 1.2 },
    collectibleDensity: 0.15,
    startHeight: 500,
  },
  easy: {
    name: 'Easy',
    levelLength: { min: 3000, max: 4000 },
    platformWidth: { min: 200, max: 350 },
    gapSize: { min: 100, max: 180 },
    platformHeightVariation: 80,
    enemyCount: { min: 2, max: 5 },
    enemySpeed: { min: 1, max: 1.5 },
    collectibleDensity: 0.18,
    startHeight: 500,
  },
  medium: {
    name: 'Medium',
    levelLength: { min: 3500, max: 4500 },
    platformWidth: { min: 150, max: 280 },
    gapSize: { min: 120, max: 200 },
    platformHeightVariation: 120,
    enemyCount: { min: 4, max: 7 },
    enemySpeed: { min: 1.2, max: 1.8 },
    collectibleDensity: 0.2,
    startHeight: 500,
  },
  hard: {
    name: 'Hard',
    levelLength: { min: 4000, max: 5000 },
    platformWidth: { min: 120, max: 220 },
    gapSize: { min: 140, max: 220 },
    platformHeightVariation: 150,
    enemyCount: { min: 6, max: 10 },
    enemySpeed: { min: 1.5, max: 2.2 },
    collectibleDensity: 0.22,
    startHeight: 500,
  },
  expert: {
    name: 'Expert',
    levelLength: { min: 4500, max: 6000 },
    platformWidth: { min: 100, max: 180 },
    gapSize: { min: 160, max: 240 },
    platformHeightVariation: 180,
    enemyCount: { min: 8, max: 14 },
    enemySpeed: { min: 1.8, max: 2.5 },
    collectibleDensity: 0.25,
    startHeight: 500,
  },
};

function getDifficultyTier(level: number): DifficultyTier {
  if (level <= 10) return DIFFICULTY_TIERS.beginner;
  if (level <= 20) return DIFFICULTY_TIERS.easy;
  if (level <= 30) return DIFFICULTY_TIERS.medium;
  if (level <= 40) return DIFFICULTY_TIERS.hard;
  return DIFFICULTY_TIERS.expert;
}

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function randomInRange(random: () => number, min: number, max: number): number {
  return min + random() * (max - min);
}

function generatePlatforms(
  levelLength: number,
  tier: DifficultyTier,
  random: () => number
): Platform[] {
  const platforms: Platform[] = [];

  platforms.push({
    x: 0,
    y: tier.startHeight,
    width: 600,
    height: 100,
  });

  let currentX = 600;
  let currentHeight = tier.startHeight;

  while (currentX < levelLength - 800) {
    const gap = randomInRange(random, tier.gapSize.min, tier.gapSize.max);
    const width = randomInRange(random, tier.platformWidth.min, tier.platformWidth.max);

    const heightChange = randomInRange(random, -tier.platformHeightVariation, tier.platformHeightVariation);
    currentHeight = Math.max(300, Math.min(550, currentHeight + heightChange));

    currentX += gap;

    platforms.push({
      x: currentX,
      y: currentHeight,
      width: width,
      height: 100,
    });

    currentX += width;
  }

  platforms.push({
    x: levelLength - 700,
    y: currentHeight,
    width: 700,
    height: 100,
  });

  return platforms;
}

function generateEnemies(
  platforms: Platform[],
  tier: DifficultyTier,
  random: () => number
): Enemy[] {
  const enemies: Enemy[] = [];
  const enemyCount = Math.floor(
    randomInRange(random, tier.enemyCount.min, tier.enemyCount.max)
  );

  const eligiblePlatforms = platforms.filter(p => p.width >= 150 && p.x > 0);

  for (let i = 0; i < enemyCount && i < eligiblePlatforms.length; i++) {
    const platformIndex = Math.floor(random() * eligiblePlatforms.length);
    const platform = eligiblePlatforms[platformIndex];

    const patrolWidth = Math.min(platform.width * 0.7, 200);
    const patrolStart = platform.x + (platform.width - patrolWidth) / 2;
    const patrolEnd = patrolStart + patrolWidth;

    const speed = randomInRange(random, tier.enemySpeed.min, tier.enemySpeed.max);

    enemies.push({
      position: {
        x: patrolStart + patrolWidth / 2,
        y: platform.y - 52,
      },
      width: 48,
      height: 48,
      velocity: { x: speed, y: 0 },
      patrolStart: patrolStart,
      patrolEnd: patrolEnd,
    });

    eligiblePlatforms.splice(platformIndex, 1);
  }

  return enemies;
}

function generateCollectibles(
  platforms: Platform[],
  enemies: Enemy[],
  tier: DifficultyTier,
  random: () => number
): Collectible[] {
  const collectibles: Collectible[] = [];

  for (const platform of platforms) {
    if (platform.x === 0) continue;

    const collectibleCount = Math.floor(platform.width * tier.collectibleDensity / 50);

    for (let i = 0; i < collectibleCount; i++) {
      const x = platform.x + randomInRange(random, 50, Math.max(50, platform.width - 50));
      const y = platform.y - randomInRange(random, 60, 120);

      const tooCloseToEnemy = enemies.some(enemy => {
        const dx = Math.abs(enemy.position.x - x);
        const dy = Math.abs(enemy.position.y - y);
        return dx < 80 && dy < 80;
      });

      if (!tooCloseToEnemy) {
        collectibles.push({
          position: { x, y },
          width: 32,
          height: 32,
          value: 10,
          assetIndex: Math.floor(random() * 5),
        });
      }
    }
  }

  return collectibles;
}

function generateFloatingPlatforms(
  levelLength: number,
  tier: DifficultyTier,
  random: () => number
): Platform[] {
  const floatingPlatforms: Platform[] = [];
  const platformCount = Math.floor(levelLength / 800);

  for (let i = 0; i < platformCount; i++) {
    const x = randomInRange(random, 800 + i * 800, 1000 + i * 800);
    const y = randomInRange(random, 200, 350);
    const width = randomInRange(random, 150, 220);

    floatingPlatforms.push({
      x,
      y,
      width,
      height: 30,
      type: 'normal',
    });
  }

  return floatingPlatforms;
}

function generateSpringboardsAndBlocks(
  mainPlatforms: Platform[],
  floatingPlatforms: Platform[],
  random: () => number
): Platform[] {
  const helpers: Platform[] = [];

  for (const floatingPlatform of floatingPlatforms) {
    let closestMainPlatform: Platform | null = null;
    let closestDistance = Infinity;

    for (const mainPlatform of mainPlatforms) {
      const verticalDistance = floatingPlatform.y - mainPlatform.y;
      const horizontalDistance = Math.abs(
        floatingPlatform.x + floatingPlatform.width / 2 -
        (mainPlatform.x + mainPlatform.width / 2)
      );

      if (verticalDistance < -80 && verticalDistance > -300 && horizontalDistance < 400) {
        const distance = Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestMainPlatform = mainPlatform;
        }
      }
    }

    if (closestMainPlatform) {
      const useSpringboard = random() < 0.5;

      if (useSpringboard) {
        const springboardX = closestMainPlatform.x + randomInRange(random, 50, closestMainPlatform.width - 100);
        helpers.push({
          x: springboardX,
          y: closestMainPlatform.y - 20,
          width: 60,
          height: 20,
          type: 'springboard',
        });
      } else {
        const blockCount = Math.floor(randomInRange(random, 3, 5));

        const startY = closestMainPlatform.y - 100;
        const targetY = floatingPlatform.y;
        const totalVerticalDistance = startY - targetY;
        const verticalStep = totalVerticalDistance / blockCount;

        const platformEdge = closestMainPlatform.x + closestMainPlatform.width;
        const floatingEdge = floatingPlatform.x;
        const direction = floatingEdge > platformEdge ? 1 : -1;

        const startX = direction > 0
          ? platformEdge + 100
          : closestMainPlatform.x - 150;

        const horizontalSpacing = randomInRange(random, 90, 130);

        for (let i = 0; i < blockCount; i++) {
          const blockX = startX + (horizontalSpacing * i * direction);
          const blockY = startY - (verticalStep * (i + 1));

          helpers.push({
            x: blockX - 25,
            y: blockY,
            width: 50,
            height: 50,
            type: 'floating_block',
          });
        }
      }
    }
  }

  return helpers;
}

function generateFloatingPlatformEnemies(
  floatingPlatforms: Platform[],
  random: () => number
): Enemy[] {
  const enemies: Enemy[] = [];

  for (const platform of floatingPlatforms) {
    const enemy1X = platform.x + platform.width * 0.25;
    const enemy2X = platform.x + platform.width * 0.75;

    enemies.push({
      position: { x: enemy1X, y: platform.y - 52 },
      width: 48,
      height: 48,
      velocity: { x: 1.2, y: 0 },
      patrolStart: platform.x + 20,
      patrolEnd: platform.x + platform.width - 20,
    });

    enemies.push({
      position: { x: enemy2X, y: platform.y - 52 },
      width: 48,
      height: 48,
      velocity: { x: -1.2, y: 0 },
      patrolStart: platform.x + 20,
      patrolEnd: platform.x + platform.width - 20,
    });
  }

  return enemies;
}

function generateFloatingPlatformCoins(
  floatingPlatforms: Platform[],
  random: () => number
): Collectible[] {
  const collectibles: Collectible[] = [];

  for (const platform of floatingPlatforms) {
    const coinCount = Math.floor(randomInRange(random, 3, 6));

    for (let i = 0; i < coinCount; i++) {
      const x = platform.x + (platform.width / (coinCount + 1)) * (i + 1);
      const y = platform.y - randomInRange(random, 50, 80);

      collectibles.push({
        position: { x, y },
        width: 32,
        height: 32,
        value: 20,
        assetIndex: Math.floor(random() * 5),
      });
    }
  }

  return collectibles;
}

function generateObstacles(
  platforms: Platform[],
  random: () => number
): Platform[] {
  const obstacles: Platform[] = [];

  for (const platform of platforms) {
    if (platform.x === 0) continue;
    if (platform.width < 200) continue;

    if (random() < 0.3) {
      const obstacleX = platform.x + randomInRange(random, platform.width * 0.2, platform.width * 0.8);
      const obstacleWidth = randomInRange(random, 30, 50);
      const obstacleHeight = randomInRange(random, 40, 80);

      obstacles.push({
        x: obstacleX,
        y: platform.y - obstacleHeight,
        width: obstacleWidth,
        height: obstacleHeight,
      });
    }
  }

  return obstacles;
}

function generateDonuts(
  floatingPlatforms: Platform[],
  levelLength: number,
  random: () => number
): Omit<Collectible, 'id' | 'collected' | 'animationTimer'>[] {
  const donuts: Omit<Collectible, 'id' | 'collected' | 'animationTimer'>[] = [];

  const donutCount = Math.floor(levelLength / 1500);

  for (let i = 0; i < donutCount; i++) {
    if (floatingPlatforms.length === 0) break;

    const platformIndex = Math.floor(random() * floatingPlatforms.length);
    const platform = floatingPlatforms[platformIndex];

    const x = platform.x + platform.width / 2 - 20;
    const y = platform.y - randomInRange(random, 100, 150);

    donuts.push({
      position: { x, y },
      width: 40,
      height: 40,
      value: 0,
      assetIndex: 0,
      type: 'donut',
    });
  }

  return donuts;
}

export function generateLevel(levelNumber: number): Level {
  const tier = getDifficultyTier(levelNumber);
  const random = seededRandom(levelNumber * 1000);

  const levelLength = Math.floor(
    randomInRange(random, tier.levelLength.min, tier.levelLength.max)
  );

  const platforms = generatePlatforms(levelLength, tier, random);
  const floatingPlatforms = generateFloatingPlatforms(levelLength, tier, random);
  const obstacles = generateObstacles(platforms, random);
  const helpersForFloating = generateSpringboardsAndBlocks(platforms, floatingPlatforms, random);

  const allPlatforms = [...platforms, ...floatingPlatforms, ...obstacles, ...helpersForFloating];

  const enemies = generateEnemies(platforms, tier, random);
  const floatingEnemies = generateFloatingPlatformEnemies(floatingPlatforms, random);
  const allEnemies = [...enemies, ...floatingEnemies];

  const collectibles = generateCollectibles(platforms, enemies, tier, random);
  const floatingCoins = generateFloatingPlatformCoins(floatingPlatforms, random);
  const allCollectibles = [...collectibles, ...floatingCoins];

  const donuts = generateDonuts(floatingPlatforms, levelLength, random);

  const finalPlatform = platforms[platforms.length - 1];
  const goalX = finalPlatform.x + finalPlatform.width - 100;
  const goalY = finalPlatform.y - 60;

  const backgroundIndex = Math.floor(random() * 3);

  return {
    id: levelNumber,
    name: `Level ${levelNumber}`,
    width: levelLength,
    height: 600,
    startPosition: { x: 100, y: 400 },
    goalPosition: { x: goalX, y: goalY },
    backgroundIndex,
    platforms: allPlatforms,
    enemies: allEnemies,
    collectibles: allCollectibles,
    donuts,
  };
}

export function generateAllLevels(count: number = 50): Level[] {
  const levels: Level[] = [];

  for (let i = 1; i <= count; i++) {
    levels.push(generateLevel(i));
  }

  return levels;
}
