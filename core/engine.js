import { parseCommand } from './parser.js';

export class GameEngine {
  constructor(levelData) {
    this.level = levelData;
    this.playerX = levelData.player_start.x;
    this.bridgeBlocks = [];
    this.currentBridgeLength = 0;
    this.isGameOver = false;
  }

  execute(inputString) {
    if (this.isGameOver) {
      return { success: false, message: 'Objective achieved! Level complete.' };
    }

    const parsed = parseCommand(inputString);
    if (!parsed.valid) {
      return { success: false, message: parsed.error };
    }

    switch (parsed.action) {
      case 'move':
        return this.handleMove(parsed.direction, parsed.steps);
      case 'print':
        return this.handlePrint(parsed.text);
      case 'help':
        return this.handleHelp();
      case 'clear':
        return { success: true, message: 'Clear_Terminal' };
      default:
        return { success: false, message: 'Execution logic missing.' };
    }
  }

  handleMove(direction, steps) {
    if (direction !== 'right' && direction !== 'left') {
      return {
        success: false,
        message: 'You can only move left or right on this path.'
      };
    }

    const distance = steps || 1;
    const targetX = direction === 'right' ? this.playerX + distance : this.playerX - distance;

    if (targetX >= this.level.hole.start_x && this.currentBridgeLength < this.level.hole.required_length) {
      return {
        success: false,
        message: `Blocked! Hole at X:${this.level.hole.start_x}. Build a bridge with print("...") first.`
      };
    }

    this.playerX = Math.max(0, targetX);

    if (this.playerX >= this.level.exit_x) {
      this.isGameOver = true;
      return {
        success: true,
        playerX: this.playerX,
        message: `Moved to X:${this.playerX}.\n\nLEVEL COMPLETE!`
      };
    }

    return {
      success: true,
      message: `Moved ${direction} by ${distance} step(s). Current Pos: (${this.playerX})`
    };
  }

  handlePrint(text) {
    const spawnedLength = text.length;
    this.currentBridgeLength += spawnedLength;
    this.bridgeBlocks.push(text);

    const remaining = this.level.hole.required_length - this.currentBridgeLength;

    if (remaining <= 0) {
      return {
        success: true,
        spawnText: text,
        message: `Dropped "${text}" (${spawnedLength} blocks)! Bridge completed. Cross over!`
      };
    }

    return {
      success: true,
      spawnText: text,
      message: `Dropped "${text}". Need ${remaining} more blocks to bridge the hole.`
    };
  }

  handleHelp() {
    return {
      success: true,
      message: "AVAILABLE FUNCTIONS:\n - print(\"text\") - Drop text blocks to build a bridge\n - player_move_right(n) - Move forward\n - player_move_left(n) - Move backward"
    };
  }
}