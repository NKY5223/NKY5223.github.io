/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const mouse = new Vector(0, 0);
canvas.addEventListener("mousemove", e => {
    mouse.x = e.offsetX - canvas.width / 2;
    mouse.y = e.offsetY - canvas.height / 2;
});
let isMouseOver = false;
canvas.addEventListener("mouseover", e => isMouseOver = true);
canvas.addEventListener("mouseout", e => isMouseOver = false);

canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight / 2;

const system = new System();
for (let i = 0; i < 100; i++)
    system.addParticle(Math.random(), Math.random(), 20);

const img = new Image();
img.src = "./404/404.svg";

let last = 0;
requestAnimationFrame(function render(t) {
    const dt = (t - last) / 1000;
    last = t;

    system.update(Math.min(dt, 0.1), isMouseOver ? mouse : null);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.translate(canvas.width / 2, canvas.height / 2)

    ctx.drawImage(img, -canvas.width / 4, -canvas.height / 4, canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = "#ffffff";
    for (let p of system.particles) {
        ctx.beginPath();
        ctx.ellipse(p.pos.x, p.pos.y, p.r, p.r, 0, 0, 7);
        ctx.fill();
    }
    ctx.fillStyle = "#ff000040";
    for (let p of system.particles) {
        ctx.beginPath();
        ctx.ellipse(p.desiredPos.x, p.desiredPos.y, p.r, p.r, 0, 0, 7);
        ctx.fill();
    }

    requestAnimationFrame(render);
});