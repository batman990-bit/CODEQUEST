import { parseCommand } from './parser.js';
import { LevelManager } from './level_manager.js';

const TILE_SIZE = 40;
const PATH_Y = 160;
const PATH_HEIGHT = 80;

export class GameEngine {
  constructor(levelData , canvasId = 'gameCanvas') {
    this.level = levelData;
    this.playerX = levelData.player_start.x;
    this.bridgeBlocks = [];
    this.currentBridgeLength = 0;
    this.isGameOver = false;

    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.levelManager = new LevelManager(levelData, this);
    
    this.bridgeY =  0;
    this.targetY = PATH_Y ;
    this.isAnimating = false;
    this.activeBridgeText = '';
  }
  
  renderScene() {
    if (!this.ctx) return ;

     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

     this.ctx.fillStyle = '#5B8C33'; 
     this.ctx.fillRect(0 , 0, this.canvas.width, this.canvas.height);

     this.ctx.fillStyle = '#7BB63E';
     for (let i = 0 ; i < this.canvas.width; i += 20 ) {
      this.ctx.fillRect(i, 20 ,12,100);
      this.ctx.fillRect(i, PATH_Y + PATH_HEIGHT + 20, 12, 100); 
     }

     const leftWidth  = this.level.hole.start_x * TILE_SIZE;
     const holeX  = this.level.hole.start_x * TILE_SIZE;
     const holeWidth = this.level.hole.required_length * TILE_SIZE;
     const rightX  = holeX + holeWidth ;

     this.ctx.fillStyle = '#9C6644' ;
     this.ctx.fillRect(0, PATH_Y, leftWidth, PATH_HEIGHT);
     this.ctx.fillRect(rightX, PATH_Y , this.canvas.width - rightX , PATH_HEIGHT);


     this.ctx.fillStyle = '#7F4F24';
     this.ctx.fillRect(0, PATH_Y, leftWidth, 4);
     this.ctx.fillRect(0, PATH_Y + PATH_HEIGHT - 4, leftWidth, 4 );
     this.ctx.fillRect(rightX, PATH_Y, this.canvas.width - rightX, 4 );
     this.ctx.fillRect(rightX, PATH_Y + PATH_HEIGHT - 4 , this.canvas.width - rightX , 4);

     this.ctx.fillStyle = '#3E2723';
     this.ctx.fillRect (holeX, PATH_Y, holeWidth, PATH_HEIGHT);

     if (this.activeBridgeText) {
      this.ctx.fillStyle = '#C08552';
      const currentY = this.bridgeY;
      this.ctx.fillRect(holeX, currentY, holeWidth, PATH_HEIGHT);

      this.ctx.strokeStyle = '#5D4037';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(holeX, PATH_Y + (this.bridgeY % PATH_HEIGHT), holeWidth, PATH_HEIGHT);

      this.ctx.fillStyle = '#3E2723' ;
      this.ctx.font = 'bold 16px monospace' ;
      this.ctx.textAlign = 'center' ; 
      this.ctx.fillText (
        this.activeBridgeText,
        holeX + (holeWidth / 2),
        PATH_Y + (PATH_HEIGHT / 2) + 5
      );
      this.ctx.textAlign = 'left'; 
     }
      const exitX = this.level.exit_x * TILE_SIZE;
      this.ctx.fillStyle = '#2A8C82';
      this.ctx.fillRect(exitX, PATH_Y, 30, PATH_HEIGHT);

      this.ctx.fillStyle = '#E63946'
      this.ctx.fillRect(this.playerX * TILE_SIZE + 5, PATH_Y + 20, 30, 40 )

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

  handlePrint(text) {
    if (!text) {
      return { success: false, message: 'Print function requires text,' };
    }

    this.currentBridgeLength += text.length ;
    this.triggerSkyDrop(text);

    return {
      success: true,
      message: `Placed bridge plank with text: "${text}". `
    };
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
  

  handleInput(rawInput) {
    const result = this.levelManager.processPlayerInput(rawInput);

    if (result.success && result.animation === 'drop_from_sky') {
      this.triggerSkyDrop(result.text);
    }

    return result; 
  }

  triggerSkyDrop(text) {
    this.activeBridgeText = text;
    this.bridgeY = 0;
    this.isAnimating = true ;
    this.animateDrop();
  }
animateDrop() {
  if (!this.isAnimating) return;

  this.bridgeY += 8; // Move down 8px per frame

  if (this.bridgeY >= this.targetY) {
    this.bridgeY = this.targetY;
    this.isAnimating = false;
  }

  this.renderScene();

  if (this.isAnimating) {
    requestAnimationFrame(() => this.animateDrop());
  }
}
  handleHelp() {
    return {
      success: true,
      message: "AVAILABLE FUNCTIONS:\n - print(\"text\") - Drop text blocks to build a bridge\n - player_move_right(n) - Move forward\n - player_move_left(n) - Move backward"
    };
  }
}
