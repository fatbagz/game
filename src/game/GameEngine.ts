import {
  GameAssets,
  PlayerState,
  Enemy,
  Collectible,
  Level,
  GameState,
  InputState,
  Vector2,
} from './types';
import { Camera } from './camera';
import { InputHandler } from './input';
import {
  GRAVITY,
  PLAYER_SPEED,
  JUMP_POWER,
  FRICTION,
  checkCollision,
  checkPlatformCollision,
  applyGravity,
} from './physics';
import { generateLevel } from './levelGenerator';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private assets: GameAssets;
  private camera: Camera;
  private input: InputHandler;

  private player: PlayerState;
  private enemies: Enemy[];
  private collectibles: Collectible[];
  private currentLevel: Level;
  private gameState: GameState;

  private animationFrame: number | null;
  private lastTime: number;
  private levelScore: number;

  private onStateChange: (state: GameState) => void;

  private chartOffset: number;
  private candlesticks: Array<{open: number, close: number, high: number, low: number}>;
  private currentQuote: string;
  private quoteTimer: number;
  private quoteDisplay: boolean;
  private playerAnimFrame: number;

  constructor(
    canvas: HTMLCanvasElement,
    assets: GameAssets,
    gameState: GameState,
    onStateChange: (state: GameState) => void
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.assets = assets;
    this.gameState = gameState;
    this.onStateChange = onStateChange;

    this.camera = new Camera(canvas.width, canvas.height, 3200, 600);
    this.input = new InputHandler();

    this.player = this.createPlayer({ x: 100, y: 400 });
    this.enemies = [];
    this.collectibles = [];
    this.currentLevel = { platforms: [], enemies: [], collectibles: [] } as Level;

    this.animationFrame = null;
    this.lastTime = 0;
    this.levelScore = 0;

    this.chartOffset = 0;
    this.candlesticks = this.generateCandlesticks();
    this.currentQuote = this.getRandomQuote();
    this.quoteTimer = 0;
    this.quoteDisplay = false;
    this.playerAnimFrame = 0;

    this.gameLoop = this.gameLoop.bind(this);
  }

  private cryptoQuotes = [
    "TO THE MOON! 🚀",
    "WEN LAMBO?",
    "HODL STRONG 💎",
    "BUY THE DIP",
    "NOT FINANCIAL ADVICE",
    "GM EVERYONE ☀️",
    "WAGMI 🤝",
    "DIAMOND HANDS 💎🙌",
    "THIS IS THE WAY",
    "BULLISH AF 📈",
    "NGMI WITHOUT MEEM",
    "PROBABLY NOTHING",
    "FEW UNDERSTAND",
    "REKT BUT LEARNING",
    "1 MEEM = 1 MEEM"
  ];

  private getRandomQuote(): string {
    return this.cryptoQuotes[Math.floor(Math.random() * this.cryptoQuotes.length)];
  }

  private generateCandlesticks(): Array<{open: number, close: number, high: number, low: number}> {
    const candles: Array<{open: number, close: number, high: number, low: number}> = [];
    let lastClose = 50;
    for (let i = 0; i < 30; i++) {
      const open = lastClose;
      const change = (Math.random() - 0.45) * 20;
      const close = Math.max(20, Math.min(80, open + change));
      const high = Math.max(open, close) + Math.random() * 10;
      const low = Math.min(open, close) - Math.random() * 10;
      candles.push({ open, close, high, low });
      lastClose = close;
    }
    return candles;
  }

  private createPlayer(position: Vector2): PlayerState {
    return {
      position: { ...position },
      velocity: { x: 0, y: 0 },
      width: 50,
      height: 50,
      grounded: false,
      facing: 'right',
      state: 'idle',
      invulnerable: false,
      invulnerableTimer: 0,
    };
  }

  private initLevel(level: Level): void {
    this.currentLevel = level;
    this.player = this.createPlayer(level.startPosition);

    this.enemies = level.enemies.map((e, i) => ({
      ...e,
      id: `enemy-${i}`,
      active: true,
    }));

    const allCollectibles = [...level.collectibles];

    if (level.donuts && this.gameState.lives <= 2) {
      allCollectibles.push(...level.donuts);
    }

    this.collectibles = allCollectibles.map((c, i) => ({
      ...c,
      id: `collectible-${i}`,
      collected: false,
      animationTimer: 0,
    }));

    this.camera.setLevelBounds(level.width, level.height);
    this.camera.reset();
    this.camera.follow(this.player.position, this.player.width);
    this.levelScore = 0;
  }

  start(levelId: number): void {
    const level = this.getLevelById(levelId);
    if (!level) return;

    this.initLevel(level);
    this.input.init();

    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    this.lastTime = performance.now();
    this.animationFrame = requestAnimationFrame(this.gameLoop);
  }

  stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.input.cleanup();
  }

  private getLevelById(id: number): Level | null {
    if (id < 1 || id > 50) return null;
    return generateLevel(id);
  }

  private gameLoop(currentTime: number): void {
    if (!this.animationFrame) return;

    const deltaTime = Math.min((currentTime - this.lastTime) / 16.67, 2);
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    if (this.animationFrame) {
      this.animationFrame = requestAnimationFrame(this.gameLoop);
    }
  }

  private update(deltaTime: number): void {
    this.playerAnimFrame++;

    const input = this.input.update();

    this.updatePlayer(input, deltaTime);
    this.updateEnemies(deltaTime);
    this.updateCollectibles();
    this.checkGoal();
    this.camera.follow(this.player.position, this.player.width);

    if (this.player.position.y > this.currentLevel.height) {
      this.handlePlayerDeath();
    }
  }

  private updatePlayer(input: InputState, deltaTime: number): void {
    if (this.player.state === 'hurt') {
      this.player.invulnerableTimer--;
      if (this.player.invulnerableTimer <= 0) {
        this.player.state = 'idle';
        this.player.invulnerable = false;
      }
      return;
    }

    if (this.player.invulnerable) {
      this.player.invulnerableTimer--;
      if (this.player.invulnerableTimer <= 0) {
        this.player.invulnerable = false;
      }
    }

    if (input.left) {
      this.player.velocity.x = -PLAYER_SPEED;
      this.player.facing = 'left';
    } else if (input.right) {
      this.player.velocity.x = PLAYER_SPEED;
      this.player.facing = 'right';
    } else {
      this.player.velocity.x *= FRICTION;
    }

    if (input.jumpPressed && this.player.grounded) {
      this.player.velocity.y = JUMP_POWER;
      this.player.grounded = false;
    }

    this.player.velocity = applyGravity(this.player.velocity);

    this.player.position.x += this.player.velocity.x * deltaTime;
    this.player.position.y += this.player.velocity.y * deltaTime;

    const collision = checkPlatformCollision(
      this.player.position,
      this.player.velocity,
      this.player.width,
      this.player.height,
      this.currentLevel.platforms
    );

    this.player.position = collision.position;
    this.player.velocity = collision.velocity;
    this.player.grounded = collision.grounded;

    if (collision.grounded) {
      const platformUnderPlayer = this.currentLevel.platforms.find(p => {
        return (
          this.player.position.x + this.player.width > p.x &&
          this.player.position.x < p.x + p.width &&
          Math.abs(this.player.position.y + this.player.height - p.y) < 5
        );
      });

      if (platformUnderPlayer?.type === 'springboard') {
        this.player.velocity.y = JUMP_POWER * 1.8;
        this.player.grounded = false;
      }
    }

    if (this.player.grounded) {
      if (Math.abs(this.player.velocity.x) > 0.5) {
        this.player.state = 'run';
      } else {
        this.player.state = 'idle';
      }
    } else {
      this.player.state = this.player.velocity.y < 0 ? 'jump' : 'fall';
    }
  }

  private updateEnemies(deltaTime: number): void {
    for (const enemy of this.enemies) {
      if (!enemy.active) continue;

      enemy.position.x += enemy.velocity.x * deltaTime;

      if (enemy.position.x <= enemy.patrolStart) {
        enemy.position.x = enemy.patrolStart;
        enemy.velocity.x = Math.abs(enemy.velocity.x);
      } else if (enemy.position.x >= enemy.patrolEnd) {
        enemy.position.x = enemy.patrolEnd;
        enemy.velocity.x = -Math.abs(enemy.velocity.x);
      }

      if (!this.player.invulnerable) {
        const collision = checkCollision(
          {
            x: this.player.position.x,
            y: this.player.position.y,
            width: this.player.width,
            height: this.player.height,
          },
          {
            x: enemy.position.x,
            y: enemy.position.y,
            width: enemy.width,
            height: enemy.height,
          }
        );

        if (collision) {
          this.handlePlayerHit();
        }
      }
    }
  }

  private updateCollectibles(): void {
    for (const collectible of this.collectibles) {
      if (collectible.collected) continue;

      const collision = checkCollision(
        {
          x: this.player.position.x,
          y: this.player.position.y,
          width: this.player.width,
          height: this.player.height,
        },
        {
          x: collectible.position.x,
          y: collectible.position.y,
          width: collectible.width,
          height: collectible.height,
        }
      );

      if (collision) {
        collectible.collected = true;
        collectible.animationTimer = 20;

        if (collectible.type === 'donut') {
          if (this.gameState.lives < 3) {
            this.gameState.lives++;
          }
        } else {
          this.levelScore += collectible.value;
          this.gameState.score += collectible.value;
        }
      }

      if (collectible.animationTimer > 0) {
        collectible.animationTimer--;
      }
    }
  }

  private checkGoal(): void {
    const goalSize = 60;
    const collision = checkCollision(
      {
        x: this.player.position.x,
        y: this.player.position.y,
        width: this.player.width,
        height: this.player.height,
      },
      {
        x: this.currentLevel.goalPosition.x,
        y: this.currentLevel.goalPosition.y,
        width: goalSize,
        height: goalSize,
      }
    );

    if (collision) {
      this.player.velocity = { x: 0, y: 0 };
      this.player.state = 'idle';
      this.handleLevelComplete();
    }
  }

  private handlePlayerHit(): void {
    this.gameState.lives--;
    this.player.invulnerable = true;
    this.player.invulnerableTimer = 60;
    this.player.state = 'hurt';
    this.onStateChange(this.gameState);

    if (this.gameState.lives <= 0) {
      this.stop();
      this.gameState.screen = 'gameOver';
      this.gameState.lives = 3;
      this.onStateChange(this.gameState);
    } else {
      this.player.position = { ...this.currentLevel.startPosition };
      this.player.velocity = { x: 0, y: 0 };
      this.player.state = 'idle';
      this.player.grounded = true;
    }
  }

  private handlePlayerDeath(): void {
    this.gameState.lives--;
    this.onStateChange(this.gameState);

    if (this.gameState.lives <= 0) {
      this.stop();
      this.gameState.screen = 'gameOver';
      this.gameState.lives = 3;
      this.onStateChange(this.gameState);
    } else {
      this.player.position = { ...this.currentLevel.startPosition };
      this.player.velocity = { x: 0, y: 0 };
      this.player.state = 'idle';
      this.player.grounded = true;
    }
  }

  private handleLevelComplete(): void {
    this.stop();

    if (this.gameState.currentLevel >= this.gameState.levelUnlocked) {
      this.gameState.levelUnlocked = this.gameState.currentLevel + 1;
    }

    this.gameState.screen = 'levelComplete';
    this.onStateChange(this.gameState);
  }

  private render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);

    this.renderBackground();
    this.renderPlatforms();
    this.renderCollectibles();
    this.renderEnemies();
    this.renderGoal();
    this.renderPlayer();

    this.ctx.restore();
  }

  private renderBackground(): void {
    const ctx = this.ctx;
    const viewX = this.camera.x;
    const viewY = this.camera.y;
    const viewWidth = this.canvas.width;
    const viewHeight = this.canvas.height;

    ctx.fillStyle = '#fafaf5';
    ctx.fillRect(viewX, viewY, viewWidth, viewHeight);

    const lineSpacing = 32;
    const startLine = Math.floor(viewY / lineSpacing) * lineSpacing;
    ctx.strokeStyle = '#a3c4df';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.7;
    for (let y = startLine; y < viewY + viewHeight + lineSpacing; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(viewX, y);
      ctx.lineTo(viewX + viewWidth, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  private renderPlatforms(): void {
    const platformImg = this.assets.environment[0];
    const startX = Math.floor(this.camera.x / 500) * 500;
    const endX = this.camera.x + this.canvas.width + 500;

    for (const platform of this.currentLevel.platforms) {
      if (platform.x + platform.width < startX || platform.x > endX) continue;

      if (platform.type === 'springboard') {
        this.ctx.fillStyle = '#fff8dc';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2.5;
        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);

        this.ctx.fillStyle = '#333';
        this.ctx.font = `bold ${Math.min(platform.height - 4, 16)}px 'Patrick Hand', cursive`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('spring', platform.x + platform.width / 2, platform.y + platform.height / 2);
      } else if (platform.type === 'floating_block') {
        this.ctx.fillStyle = '#e8e8e0';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2.5;
        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);

        this.ctx.strokeStyle = '#aaa';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(platform.x + 5, platform.y + 5, platform.width - 10, platform.height - 10);
      } else {
        if (platformImg) {
          const pattern = this.ctx.createPattern(platformImg, 'repeat');
          if (pattern) {
            this.ctx.fillStyle = pattern;
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2.5;
            this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
          }
        } else {
          this.ctx.fillStyle = '#e0d8c8';
          this.ctx.strokeStyle = '#333';
          this.ctx.lineWidth = 2.5;
          this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
          this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);

          this.ctx.strokeStyle = '#bbb';
          this.ctx.lineWidth = 1;
          for (let hx = platform.x + 20; hx < platform.x + platform.width; hx += 20) {
            this.ctx.beginPath();
            this.ctx.moveTo(hx, platform.y);
            this.ctx.lineTo(hx, platform.y + platform.height);
            this.ctx.stroke();
          }
        }
      }
    }
  }

  private renderPlayer(): void {
    if (this.player.invulnerable && Math.floor(this.player.invulnerableTimer / 5) % 2 === 0) {
      this.ctx.globalAlpha = 0.5;
    }

    const playerImg = this.assets.player[this.player.state] || this.assets.player.idle;

    if (playerImg) {
      this.ctx.save();
      this.ctx.translate(
        this.player.position.x + this.player.width / 2,
        this.player.position.y + this.player.height / 2
      );

      if (this.player.facing === 'left') {
        this.ctx.scale(-1, 1);
      }

      const bounceOffset = Math.sin(this.playerAnimFrame / 10) * 2;

      this.ctx.drawImage(
        playerImg,
        -this.player.width / 2,
        -this.player.height / 2 + bounceOffset,
        this.player.width,
        this.player.height
      );

      this.ctx.restore();
    }

    this.ctx.globalAlpha = 1;
  }

  private renderEnemies(): void {
    const startX = this.camera.x - 100;
    const endX = this.camera.x + this.canvas.width + 100;

    for (const enemy of this.enemies) {
      if (!enemy.active) continue;
      if (enemy.position.x < startX || enemy.position.x > endX) continue;

      this.ctx.save();
      this.ctx.translate(
        enemy.position.x + enemy.width / 2,
        enemy.position.y + enemy.height / 2
      );

      const w = enemy.width;
      const h = enemy.height;
      const hw = w / 2;
      const hh = h / 2;

      this.ctx.fillStyle = '#333';
      this.ctx.strokeStyle = '#333';
      this.ctx.lineWidth = 2;

      this.ctx.beginPath();
      this.ctx.ellipse(0, -hh * 0.35, hw * 0.6, hh * 0.5, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.fillStyle = '#ff4444';
      this.ctx.beginPath();
      this.ctx.ellipse(-hw * 0.22, -hh * 0.35, 3, 4, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.ellipse(hw * 0.22, -hh * 0.35, 3, 4, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#555';
      this.ctx.fillRect(-hw * 0.35, hh * 0.05, hw * 0.25, hh * 0.45);
      this.ctx.fillRect(hw * 0.1, hh * 0.05, hw * 0.25, hh * 0.45);

      this.ctx.restore();
    }
  }

  private renderCollectibles(): void {
    const startX = this.camera.x - 100;
    const endX = this.camera.x + this.canvas.width + 100;

    for (const collectible of this.collectibles) {
      if (collectible.position.x < startX || collectible.position.x > endX) continue;

      if (collectible.collected) {
        if (collectible.animationTimer > 0) {
          const scale = collectible.animationTimer / 20;
          const alpha = scale;

          this.ctx.save();
          this.ctx.globalAlpha = alpha;

          const scaledWidth = collectible.width * scale;
          const scaledHeight = collectible.height * scale;
          const offsetX = (collectible.width - scaledWidth) / 2;
          const offsetY = (collectible.height - scaledHeight) / 2;

          if (collectible.type === 'donut' && this.assets.donut) {
            this.ctx.drawImage(
              this.assets.donut,
              collectible.position.x + offsetX,
              collectible.position.y + offsetY,
              scaledWidth,
              scaledHeight
            );
          } else {
            this.renderGoldCoin(
              collectible.position.x + offsetX,
              collectible.position.y + offsetY,
              scaledWidth,
              scaledHeight
            );
          }

          this.ctx.restore();
        }
        continue;
      }

      if (collectible.type === 'donut' && this.assets.donut) {
        this.ctx.drawImage(
          this.assets.donut,
          collectible.position.x,
          collectible.position.y,
          collectible.width,
          collectible.height
        );
      } else {
        this.renderGoldCoin(
          collectible.position.x,
          collectible.position.y,
          collectible.width,
          collectible.height
        );
      }
    }
  }

  private renderGoldCoin(x: number, y: number, width: number, height: number): void {
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radius = width / 2 - 2;

    this.ctx.fillStyle = '#FFD700';
    this.ctx.strokeStyle = '#B8860B';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#FFA500';
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.strokeStyle = '#B8860B';
    this.ctx.lineWidth = 2;
    this.ctx.font = `bold ${radius * 1.2}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = '#FFD700';
    this.ctx.strokeText('$', centerX, centerY);
    this.ctx.fillText('$', centerX, centerY);
  }

  private renderGoal(): void {
    const goalSize = 60;
    const gx = this.currentLevel.goalPosition.x;
    const gy = this.currentLevel.goalPosition.y;

    const pulse = 0.85 + Math.sin(this.playerAnimFrame / 20) * 0.15;
    this.ctx.globalAlpha = pulse;

    this.ctx.fillStyle = '#fff8dc';
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2.5;
    this.ctx.fillRect(gx, gy, goalSize, goalSize);
    this.ctx.strokeRect(gx, gy, goalSize, goalSize);

    this.ctx.fillStyle = '#333';
    this.ctx.font = "bold 13px 'Patrick Hand', cursive";
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('GOAL', gx + goalSize / 2, gy + goalSize / 2);

    this.ctx.globalAlpha = 1;
  }

  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.camera.updateDimensions(width, height);
  }

  getGameState(): GameState {
    return this.gameState;
  }
}
