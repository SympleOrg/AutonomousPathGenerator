import Vec2d from "./Vec2d.js";

const canvas: HTMLCanvasElement = document.getElementById("screen") as HTMLCanvasElement
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")

const calcUnits = () => 60.96 / (canvas.getBoundingClientRect().width / 6);
export let cmPerPixel: number = calcUnits()

export const updateCanvasSize = () => {
    ctx.canvas.width = canvas.getBoundingClientRect().width
    ctx.canvas.height = canvas.getBoundingClientRect().height
}

window.addEventListener("resize", () => {
    cmPerPixel = calcUnits()
    updateCanvasSize()
})


const onClickEvents = []
canvas.addEventListener("click", (event) => onClickEvents.forEach(callback => callback(event)))

const onContextMenuEvents = []
canvas.addEventListener("contextmenu", (event) => onContextMenuEvents.forEach(callback => callback(event)))

export const addOnClickEvent = (callback) => onClickEvents.push(callback)
export const addOnContextmenuEvent = (callback) => onContextMenuEvents.push(callback)

export const getCanvasPos = () => new Vec2d(canvas.getBoundingClientRect().x, canvas.getBoundingClientRect().y);
export const getCanvasSize = () => ({width: canvas.width, height: canvas.height})

export const drawImage = (image: HTMLImageElement, x: number, y: number, width: number, height: number) =>  ctx.drawImage(image, x, y, width, height)

export function drawCircle(x: number, y: number, radius: number, fillColor: string, strokeWidth: number, strokeColor: string) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
}

export function drawLine(from: Vec2d, to: Vec2d, color: string, width: number) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
}
