import { parseCommand , evaluateLevel1 } from "./parser.js";
export class LevelManager {
    constructor(levelConfig) {
        this.levelConfig = levelConfig;
        this.engine = this.engine;
        
        this.currentBridgeLength = 0 ;
        this.isCompleted = false;
        this.playerX = levelConfig.player_start.x || 0;
        this.bridgeBlocks = [];
    }

    processPlayerInput(rawInput) {
        const parsedResult = parseCommand(rawInput)
        if (!parsedResult.valid) {
            return {
                success: false,
                type: 'Error',
                messege: parsedResult.error
            };
        }

        const evaluation = evaluateLevel1(parsedResult, this.levelConfig);

        if (evaluation.action === 'build_bridge' || evaluation.action === 'print') {
            this.currentBridgeLength = evaluation.bridgeLength || (this.currentBridgeLength + evaluation.text.length);
            this.bridgeBlocks.push(evaluation.text);
            if (evaluation.success) {
                this.isCompleted = true;
            }
        } else if (evaluation.action == 'move') {
            this.playerX = evaluation.newX !== undefined ? evaluation.newX : this.playerX + (evaluation.steps || 1);
        }

        if (this.engine) {
            this.engine.playerX = this.playerX;
            this.engine.currentBridgeLength = this.currentBridgeLength;
            this.engine.bridgeBlocks;

            if (typeof this.engine.renderScene === 'function') {
                this.engine.renderScene();
            }
        }

        return {
            success: evaluation.success,
            action: evaluation.action,
            animation: evaluation.animation || null,
            spawn_x: evaluation.spawn_x || null,
            text: evaluation.text || null,
            message: evaluation.messege || evaluation.error,
            gameState: {
                playerX: this.playerX,
                bridgeLength: this.currentBridgeLength,
                bridgeBlocks: this.bridgeBlocks,
                isCompleted: this.isCompleted,
            }
        };
    }
}