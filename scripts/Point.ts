import Vec2d from "./Vec2d.js"
import { cmPerPixel } from "./Canvas.js"

export default class Point {
    pos: Vec2d
    id: any
    connection: any

    constructor(x: number, y: number, id: string, connection: Point =null) {
        this.pos = new Vec2d(x, y)
        this.id = id
        this.connection = connection
    }

    getPosAsPixel(): Vec2d {
        return new Vec2d(this.pos.x / cmPerPixel, this.pos.y / cmPerPixel)
    }

    calcDist(p2: Vec2d): number {
        const pos = this.getPosAsPixel()
        return Math.hypot(pos.x - p2.x, pos.y - p2.y, 2)
    }
}