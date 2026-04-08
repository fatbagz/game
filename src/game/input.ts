import { InputState } from './types';

export class InputHandler {
  private keys: Set<string>;
  private inputState: InputState;
  private prevJump: boolean;

  constructor() {
    this.keys = new Set();
    this.inputState = {
      left: false,
      right: false,
      jump: false,
      jumpPressed: false,
    };
    this.prevJump = false;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    this.keys.add(e.key.toLowerCase());
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.keys.delete(e.key.toLowerCase());
  }

  init(): void {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  cleanup(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  update(): InputState {
    this.inputState.left =
      this.keys.has('a') ||
      this.keys.has('arrowleft');

    this.inputState.right =
      this.keys.has('d') ||
      this.keys.has('arrowright');

    const jumpNow =
      this.keys.has(' ') ||
      this.keys.has('w') ||
      this.keys.has('arrowup');

    this.inputState.jump = jumpNow;
    this.inputState.jumpPressed = jumpNow && !this.prevJump;
    this.prevJump = jumpNow;

    return this.inputState;
  }

  reset(): void {
    this.keys.clear();
    this.inputState = {
      left: false,
      right: false,
      jump: false,
      jumpPressed: false,
    };
    this.prevJump = false;
  }
}
