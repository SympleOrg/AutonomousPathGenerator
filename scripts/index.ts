import { 
    cmPerPixel,
    updateCanvasSize,
    addOnClickEvent,
    addOnContextmenuEvent,
    getCanvasPos,
    getCanvasSize,
    drawImage,
    drawCircle,
    drawLine
} from "./Canvas.js"

import Point from "./Point.js"
import Vec2d from "./Vec2d.js"
import { updateSettings } from "./Settings.js"

import Line from "./shapes/Line.js"
import Circle from "./shapes/Circle.js"

const centerStageImage = new Image(30, 30)
centerStageImage.src = "/centerstage.webp"

const pointRadius = 5

const points: Point[] = []
export let selectedPoint: Point | null = null;

updateCanvasSize()

const selectPoint = (point: Point) => {
    selectedPoint = point
    updateSettings(selectedPoint)
}

const removePoint = (point: Point) => {
    const index = points.findIndex(pt => pt.id == point.id);
    if(index >= 0) points.splice(index, 1);
}

addOnClickEvent((event: MouseEvent) => {
    const canavsPos = getCanvasPos()

    const xPos = event.x - canavsPos.x
    const yPos = event.y - canavsPos.y

    console.log(`-----------------------------------------------------------------`)
    console.log(`xy: ${xPos}, ${yPos}`)
    console.log(`cm xy: ${xPos * cmPerPixel}, ${yPos * cmPerPixel}`)
    

    for(const p of points) {
        if(p.calcDist(new Vec2d(xPos, yPos)) <= (pointRadius * 2)) {
            return selectPoint(p);
        }
    }
    
    const point = new Point(xPos * cmPerPixel, yPos * cmPerPixel, genUUID());
    selectPoint(point);

    points.push(point)
})

addOnContextmenuEvent((event: MouseEvent) => {
    const canavsPos = getCanvasPos()

    const xPos = event.x - canavsPos.x
    const yPos = event.y - canavsPos.y

    for(const p of points) {
        if(p.calcDist(new Vec2d(xPos, yPos)) <= pointRadius) 
            return removePoint(p);
    }

    event.preventDefault()
})

function draw() {
    const { width: screenWidth, height: screenHeight } = getCanvasSize()

    drawImage(centerStageImage, 0, 0, screenWidth, screenHeight)
    
    const lineRenderQueue: Line[] = []
    const pointRenderQueue: Circle[] = []

    for(const p of points) {
        const pos = p.getPosAsPixel()
        const color = selectedPoint == p ? "#3300ff" : "#9900ff"
        pointRenderQueue.push(new Circle(pos.x, pos.y, pointRadius, color))

        const connectionPoint = points.find(pt => pt.id == p.connection)
        if(connectionPoint != null) {
            const cpPos = connectionPoint.getPosAsPixel()

            lineRenderQueue.push(new Line(pos, cpPos, selectedPoint == p ? "#550099" : "#9900ee", 5))
        }
    } 

    for(const line of lineRenderQueue) {
        drawLine(line.from, line.to, line.color, line.width)
    }

    for(const point of pointRenderQueue) {
        drawCircle(point.x, point.y, point.radius, point.color, 0, point.color)
    }

    requestAnimationFrame(draw)
}

requestAnimationFrame(draw)




function genUUID() {
    let s = "abcdefghijklmnopqrstuvwxyz1234567890"
    
    let emptyString = ""
    for(let i = 0; i < 4; i++) {
        emptyString += s[Math.floor(Math.random() * s.length)];
    }

    if(points.some(p => p.id == emptyString)) return genUUID()
    return emptyString;
}