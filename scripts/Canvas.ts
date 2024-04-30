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

const onKeyDownEvents = []
canvas.addEventListener("keydown", (event) => onKeyDownEvents.forEach(callback => callback(event)))

export const addOnClickEvent = (callback: any) => onClickEvents.push(callback)
export const addOnContextmenuEvent = (callback: any) => onContextMenuEvents.push(callback)
export const addKeyDownEvent = (callback: any) => onKeyDownEvents.push(callback)

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

export function drawArrow(from: Vec2d, to: Vec2d, width: number, color: string, headlen: number = 10) {
    const dist = to.sub(from);
    const angle = Math.atan2(dist.y, dist.x);
 
    ctx.save();
    ctx.strokeStyle = color;
 
    //starting path of the arrow from the start square to the end square
    //and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.lineWidth = width;
    ctx.stroke();
 
    //starting a new path from the head of the arrow to one of the sides of
    //the point
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x-headlen*Math.cos(angle-Math.PI/7),
               to.y-headlen*Math.sin(angle-Math.PI/7));
 
    //path from the side point of the arrow, to the other side point
    ctx.lineTo(to.x-headlen*Math.cos(angle+Math.PI/7),
               to.y-headlen*Math.sin(angle+Math.PI/7));
 
    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    ctx.lineTo(to.x, to.y);
    ctx.lineTo(to.x-headlen*Math.cos(angle-Math.PI/7),
               to.y-headlen*Math.sin(angle-Math.PI/7));
 
    //draws the paths created above
    ctx.stroke();
    ctx.restore();
}