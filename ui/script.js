const canvas = document.getElementById('terminal-canvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.fillStyle = 'rgba(0,20,0,0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resize);
resize();