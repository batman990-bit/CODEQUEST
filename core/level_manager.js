import { parseCommand , evaluateLevel1 } from "./parser";
export class LevelManager {
    constructor(levelConfig) {
        this.levelConfig = levelConfig;
        this.currentBridgeLength = 0 ;
        this.isCompleted = false;
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

        if (evaluation.action === 'build_bridge') {
            this.currentBridgeLength = evaluation.bridgeLength;
            if (evaluation.success) {
                this.isCompleted = true;
            }
        }

        return {
            success: evaluation.success,
            action: evaluation.action,
            animation: evaluation.animation || null,
            spawn_x: evaluation.spawn_x || null,
            text: evaluation.text || null,
            messege: evaluation.messege || evaluation.error,
            gameState: {
                bridgeLength: this.currentBridgeLength,
                isCompleted: this.isCompleted,
            }
        };
    }
}