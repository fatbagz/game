import { Vector2 } from './types';

export class Camera {
  x: number;
  y: number;
  width: number;
  height: number;
  levelWidth: number;
  levelHeight: number;
  private targetX: number;
  private smoothing: number;

  constructor(width: number, height: number, levelWidth: number, levelHeight: number) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.levelWidth = levelWidth;
    this.levelHeight = levelHeight;
    this.targetX = 0;
    this.smoothing = 0.1;
  }

  follow(playerPos: Vector2, playerWidth: number): void {
    this.targetX = playerPos.x + playerWidth / 2 - this.width / 3;

    const dx = this.targetX - this.x;
    this.x += dx * this.smoothing;

    this.x = Math.max(0, Math.min(this.x, this.levelWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, this.levelHeight - this.height));
  }

  updateDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  setLevelBounds(levelWidth: number, levelHeight: number): void {
    this.levelWidth = levelWidth;
    this.levelHeight = levelHeight;
  }

  reset(): void {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
  }
}
