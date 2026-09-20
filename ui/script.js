import { GameEngine } from "./core/engine.js";

const canvas = document.getElementById('terminal-canvas');
const ctx = canvas.getContext('2d');
const inputField = document.querySelector('.input-line input');
const runButton = document.querySelector('.game-content .run-button');
const outputLog = document.querySelector('.output');

const levelData = {
    player_start: {x:0},
    hole: {start_x:5, required_length:4},
    exit_x: 10
}

const engine = new GameEngine(levelData);

function logToTerminal(text, isSuccessful) {
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
    const codeString = inputField.value.trim();
    if (!codeString) return;

    const echoLine = document.createElement('div');
    echoLine.style.color = '#888';
    echoLine.textContent = `user@system;~$ ${codeString}`;
    outputLog.appendChild(echoLine);

    const result = engine.execute(codeString);

    if (result.message === 'Clear_Terminal') {
        outputLog.innerHTML = '';
    } else {
        logToTerminal(result.message, result.success);
    }

    inputField.value = '';
    outputLog.scrollTop = outputLog.scrollHeight;
}

runButton.addEventListener('click', executeCommand);
inputField.addEventListener('keydown',(e)=>{
    if (e.key === 'Enter') {
        executeCommand();
    }
})


function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resize);
resize();