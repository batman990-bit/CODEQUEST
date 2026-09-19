import level1 from './core/levels/level_1.json' assert {type: 'json'};
import { LevelManager } from './core/levelmanager.js';
const game = new LevelManager(level1) ;

console.log("--- RUNNING BACKEND TEST ---\n") ;

console.log(" TESTING INVALID SYNTAX:");
console.log(game.processPlayerInput('print("-----")'));
console.log("\n----------------------------\n");

console.log(" TESTING SHORT BRIDGE  ");
console.log(game.processPlayerInput('print("---")'));
console.log("\n----------------------------\n");


console.log( " TESTING CORRECT BRIDGE  ");
console.log(game.processPlayerInput('print("-----")'))