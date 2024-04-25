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
export const getCanvasSize = () => ({width: canvas.width, height: canvas.height, toVec: () => new Vec2d(canvas.width, canvas.height)})

export const drawImage = (image: HTMLImageElement, x: number, y: number, width: number, height: number) =>  ctx.drawImage(image, x, y, width, height)

export function drawCircle(x: number, y: number, radius: number, fillColor: string, strokeWidth: number, strokeColor: string) {
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
}

export function drawLine(from: Vec2d, to: Vec2d, color: string, width: number) {
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
}

export function drawSquare(x: number, y: number, width: number, height: number, deg: number, color: string, lineWidth: number = 1) {
    ctx.save();

    const relCenterPos = new Vec2d(width, height).div(2)
    const centerPos = new Vec2d(x, y).add(relCenterPos)

    ctx.translate(centerPos.x, centerPos.y);
    ctx.rotate(deg * Math.PI / 180);

    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(-relCenterPos.x, -relCenterPos.y, width, height)
    
    ctx.restore()
}