import { Vector2, Rectangle, Platform } from './types';

export const GRAVITY = 0.6;
export const MAX_FALL_SPEED = 15;
export const PLAYER_SPEED = 5;
export const JUMP_POWER = -12;
export const FRICTION = 0.8;

export function checkCollision(rect1: Rectangle, rect2: Rectangle): boolean {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export function checkPlatformCollision(
  playerPos: Vector2,
  playerVel: Vector2,
  playerWidth: number,
  playerHeight: number,
  platforms: Platform[]
): { grounded: boolean; position: Vector2; velocity: Vector2 } {
  let newPos = { ...playerPos };
  let newVel = { ...playerVel };
  let grounded = false;

  for (const platform of platforms) {
    const playerRect = {
      x: newPos.x,
      y: newPos.y,
      width: playerWidth,
      height: playerHeight,
    };

    const platformRect = {
      x: platform.x,
      y: platform.y,
      width: platform.width,
      height: platform.height,
    };

    if (checkCollision(playerRect, platformRect)) {
      const overlapLeft = playerRect.x + playerRect.width - platformRect.x;
      const overlapRight = platformRect.x + platformRect.width - playerRect.x;
      const overlapTop = playerRect.y + playerRect.height - platformRect.y;
      const overlapBottom = platformRect.y + platformRect.height - playerRect.y;

      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

      if (minOverlap === overlapTop && newVel.y > 0) {
        newPos.y = platformRect.y - playerHeight;
        newVel.y = 0;
        grounded = true;
      } else if (minOverlap === overlapBottom && newVel.y < 0) {
        newPos.y = platformRect.y + platformRect.height;
        newVel.y = 0;
      } else if (minOverlap === overlapLeft) {
        newPos.x = platformRect.x - playerRect.width;
        newVel.x = 0;
      } else if (minOverlap === overlapRight) {
        newPos.x = platformRect.x + platformRect.width;
        newVel.x = 0;
      }
    }
  }

  return { grounded, position: newPos, velocity: newVel };
}

export function applyGravity(velocity: Vector2): Vector2 {
  const newVelY = Math.min(velocity.y + GRAVITY, MAX_FALL_SPEED);
  return { ...velocity, y: newVelY };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
