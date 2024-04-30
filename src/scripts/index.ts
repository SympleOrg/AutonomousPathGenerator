import { 
    cmPerPixel,
    updateCanvasSize,
    addOnClickEvent,
    addOnContextmenuEvent,
    addKeyDownEvent,
    getCanvasPos,
    getCanvasSize,
    drawImage,
    drawCircle,
    drawLine,
    drawSquare,
    drawArrow
} from "./Canvas.js"

import Point from "./Point.js"
import Vec2d from "./Vec2d.js"
import {
    getRobotHeight,
    getRobotWidth,
    getRobotStartingAngle,
    updatePointSettings,
    updateRobotSettings
} from "./Settings.js"
import PathGenerator from "./Generator.js"
import Line from "./shapes/Line.js"
import Circle from "./shapes/Circle.js"
import Logger from "./util/Logger.js"
import { tryToSave, tryToLoadFromLocalStorage, tryToDeleteFromLocalStorage } from "./Save.js"

const centerStageImage = new Image(30, 30)
centerStageImage.src = "assets/centerstage.webp"

const pointRadius = 5

export const points: Point[] = []
export let selectedPoint: Point | null = null;
export const consoleOutput = new Logger("console-output");

updateCanvasSize()
updateRobotSettings()
PathGenerator.initialize()

const selectPoint = (point: Point) => {
    selectedPoint = point
    updatePointSettings(selectedPoint)
}

export const makePointStart = (point: Point) => {
    points.forEach(p => {
        p.start = false;
        if(p.connection == point.id) p.connection = null
    });
    point.start = true
    updatePointSettings(point)
}

const removePoint = (point: Point) => {
    const index = points.findIndex(pt => pt.id == point.id);
    if(index >= 0) points.splice(index, 1);
}

window.addEventListener("keypress", (e) => {
    if(e.key == "o") tryToSave()
    else if(e.key == "p") tryToLoadFromLocalStorage()
    else if(e.key == "i") tryToDeleteFromLocalStorage()
})

addKeyDownEvent((e: KeyboardEvent) => {
    const force = new Vec2d(0, 0)
    const moveSpeed = 1;
    
    if(e.key == "ArrowUp") force.y -= moveSpeed;
    if(e.key == "ArrowDown") force.y += moveSpeed;
    if(e.key == "ArrowLeft") force.x -= moveSpeed;
    if(e.key == "ArrowRight") force.x += moveSpeed;

    if(selectedPoint.pos.x + force.x >= 0 && selectedPoint.pos.x + force.x <= getCanvasSize().width * cmPerPixel) selectedPoint.pos.x += force.x;
    if(selectedPoint.pos.y + force.y >= 0 && selectedPoint.pos.y + force.y <= getCanvasSize().height * cmPerPixel) selectedPoint.pos.y += force.y;
    
    updatePointSettings(selectedPoint)
})

addOnClickEvent((event: MouseEvent) => {
    const canavsPos = getCanvasPos()

    const xPos = event.x - canavsPos.x
    const yPos = event.y - canavsPos.y

    for(const p of points) {
        if(p.calcDist(new Vec2d(xPos, yPos)) <= (pointRadius * 2)) {
            if(event.shiftKey) {
                if(selectedPoint && !p.start) {
                    if(selectedPoint.connection != p.id) selectedPoint.connection = p.id;
                    else selectedPoint.connection = null;
                    return updatePointSettings(selectedPoint);
                }
            } else if(event.ctrlKey) {
                return makePointStart(p);
            } else if(selectedPoint?.id == p.id) {
                return selectedPoint = null;
            }

            return selectPoint(p);
        }
    }
    
    const point = new Point(xPos * cmPerPixel, yPos * cmPerPixel, genUUID());
    if(event.shiftKey && selectedPoint) selectedPoint.connection = point.id;

    if(event.ctrlKey) makePointStart(point);

    selectPoint(point);

    points.push(point)
})

addOnContextmenuEvent((event: MouseEvent) => {
    const canavsPos = getCanvasPos()

    const xPos = event.x - canavsPos.x
    const yPos = event.y - canavsPos.y

    event.preventDefault()

    for(const p of points) {
        if(p.calcDist(new Vec2d(xPos, yPos)) <= pointRadius) 
            return removePoint(p);
    }
})

function draw() {
    const { width: screenWidth, height: screenHeight } = getCanvasSize()

    drawImage(centerStageImage, 0, 0, screenWidth, screenHeight)
    
    const lineRenderQueue: Line[] = []
    const pointRenderQueue: Circle[] = []

    for(const p of points) {
        const pos = p.getPosAsPixel()
        let pointNormalColor = p.start ? "#990055" : "#ff00ee";
        let pointSelectedColor = p.start ? "#ff0033" : "#3300ff";

        const color = selectedPoint?.id == p.id ? pointSelectedColor : pointNormalColor
        pointRenderQueue.push(new Circle(pos.x, pos.y, pointRadius, color))

        const connectionPoint = points.find(pt => pt.id == p.connection)
        
        if(selectedPoint && selectedPoint.id == p.id) {
            const relSize = new Vec2d(getRobotWidth(), getRobotHeight()).div(cmPerPixel)
            const robotCenterPos = pos.sub(relSize.div(2))
            
            const angle: number = connectionPoint != null ? p.calcAngleToPoint(connectionPoint.pos) : 0;

            drawSquare(robotCenterPos.x, robotCenterPos.y, relSize.x, relSize.y, angle, "#ff8800", 2)
        }

        if(p.start) {
            const angleInRad = getRobotStartingAngle() * (Math.PI / 180)
            const pX = Math.cos(angleInRad) * 25 / cmPerPixel + pos.x
            const pY = Math.sin(angleInRad) * 25 / cmPerPixel + pos.y

            drawArrow(pos, new Vec2d(pX, pY), 5, "#000000", 5)
        }

        if(connectionPoint != null) {
            const cpPos = connectionPoint.getPosAsPixel()
            let lineNormalColor = connectionPoint.connection == p.id ? "#009900" : "#0099ff";
            let lineSelectedColor = connectionPoint.connection == p.id ? "#00ff00" : "#00ffff";

            let lineColor = selectedPoint?.id == p.id || (connectionPoint.connection == p.id && selectedPoint.id == connectionPoint.id) ? lineSelectedColor : lineNormalColor;

            lineRenderQueue.push(new Line(pos, cpPos, lineColor, 4))
        }
    } 

    for(const line of lineRenderQueue) {
        drawLine(line.from, line.to, line.color, line.width)
    }

    for(const point of pointRenderQueue) {
        drawCircle(point.x, point.y, point.radius, point.color, 1, point.color)
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