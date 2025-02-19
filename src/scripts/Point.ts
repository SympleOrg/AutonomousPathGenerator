import Vec2d from "./Vec2d.js"
import { cmPerPixel } from "./Canvas.js"
import Action from "./Action.js"

export default class Point {
    pos: Vec2d
    id: string
    connection: string | null
    start: boolean
    strafe: boolean
    actions: Action[]

    constructor(x: number, y: number, id: string, connection: string =null, start: boolean = false, strafe: boolean = false, actions: Action[] = []) {
        this.pos = new Vec2d(x, y)
        this.id = id
        this.connection = connection
        this.start = start;
        this.strafe = strafe;
        this.actions = actions;
    }

    getPosAsPixel(): Vec2d {
        return new Vec2d(this.pos.x / cmPerPixel, this.pos.y / cmPerPixel)
    }

    calcDist(p2: Vec2d): number {
        const pos = this.getPosAsPixel()
        return Math.hypot(pos.x - p2.x, pos.y - p2.y, 2)
    }

    calcMoveDist(p2: Vec2d): number {
        return Math.hypot(this.pos.x - p2.x, this.pos.y - p2.y, 2)
    }

    calcAngleToPoint(p2: Vec2d): number {
        const idk = p2.sub(this.pos)
        return Math.atan2(idk.y, idk.x) * 180 / Math.PI;
    }

    addAction(action: Action) {
        this.actions.push(action)
    }

    deleteAction(id: string) {
        this.actions = this.actions.filter(a => a.id != id)
    }

    actionToHtml(): string {
        let finalHtml = "";
        for(const action of this.actions) {
            finalHtml += action.toHtml()
        }
        return finalHtml;
    }

    toJson(): any {
        return {
            pos: this.pos.toJson(),
            id: this.id,
            connection: this.connection,
            start: this.start,
            strafe: this.strafe,
            actions: this.actions.map(a => a.toJson())
        }
    }

    static fromJson(json: any): Point {
        return new Point(json.pos.x, json.pos.y, json.id, json.connection, json.start, json.strafe, json.actions.map((a: any) => Action.fromJson(a)))
    }
}