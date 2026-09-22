import { GameEngine } from "./core/engine.js";

const canvas = document.getElementById('terminal-canvas');
const ctx = canvas.getContext('2d');
const inputField = document.querySelector('.input-line input');
const runButton = document.querySelector('.game-content .run-button');
const outputLog = document.querySelector('.output');

let engine;
let levelData;

function updateHUD(data, currentPlayerX=null) {
    const hudName = document.getElementById('hud-level-name');
    const hudPosition = document.getElementById('hud-position');
    const hudProgress = document.getElementById('hud-progress');
    const hudObjective = document.getElementById('hud-objective');

    if (hudName) hudName.textContent = data.name || 'Level 1';

    const posX = currentPlayerX !== null ? currentPlayerX : data.player_start.x;
    if (hudPosition) hudPosition.textContent = `${posX}`

    if (hudProgress) {
        const progressPercent = Math.min(100, Math.round((posX/data.exit_x)*100));
        hudProgress.textContent = `${progressPercent}`
    }

    if (hudObjective) hudObjective.textContent = data.objective || 'Reach The Exit';
}

async function initGame() {
    try {
        const response = await fetch('../core/levels/level_1.json');
        if (!response.ok) throw new Error("Failed to fetch level data");

        levelData = await response.json();

        engine = new GameEngine(levelData, 'terminal-canvas');
        updateHUD(levelData)
        resizeCanvas()
        logToTerminal("Please Begin", false);
    } catch (error) {
        console.error("Error loading level:", error);
        logToTerminal("System Error: Couldn't reach file.", false);
    }
}


function logToTerminal(text, isSuccessful) {
    const outputLog = document.querySelector('.output')
    if (!outputLog) return;
    
    const logLine = document.createElement('div');
    logLine.innerHTML = text.replace(/\n/g, '<br>')
    if (isSuccessful) {
        logLine.style.color = '#00ff00';
    } else {
        logLine.style.color = '#ff3333';
        logLine.style.textShadow = '0 0 5px rgba(255, 51, 51, 0.7)';
    }
    outputLog.appendChild(logLine);
}

function executeCommand() {
    const inputField = document.querySelector('.input-line input');
    const currentOutput = document.querySelector('.output');
    if (!inputField || !currentOutput ) return;

    const codeString = inputField.value.trim()
    if (!codeString) return;

    const echoLine = document.createElement('div');
    echoLine.style.color = '#888';
    echoLine.textContent = `user@system;~$ ${codeString}`;
    outputLog.appendChild(echoLine);

    const result = engine.execute(codeString);
    if (!result) {
        logToTerminal("Error: Engine returned no response object.", false);
    } else if (result.message === 'Clear_Terminal') {
        outputLog.innerHTML = '';
    } else {
        logToTerminal(result.message ?? "Unknown command output.", result.success ?? false);
    }
    
    inputField.value = '';
    outputLog.scrollTop = outputLog.scrollHeight;

    if (result && result.success && result.playerX !== undefined) {
        updateHUD(levelData, result.playerX);
    }

    if (engine && engine.ctx) {
        engine.renderScene();
    }
}


window.addEventListener('DOMContentLoaded', () => {
    const runButton = document.querySelector('.game-content .run-button');
    const inputField = document.querySelector('.input-line input');

    if (runButton) {
        runButton.addEventListener('click', executeCommand);
    }

    if (inputField) {
        inputField.addEventListener('keydown', (e) => {
            if (e.key ==='Enter') {
                executeCommand();
            }
        })
    }
    initGame();
});




function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    if (engine && engine.ctx) {
        engine.renderScene();
    }
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);
