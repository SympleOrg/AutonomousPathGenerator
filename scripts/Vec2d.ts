export default class Vec2d {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    add(v: Vec2d | number): Vec2d {
        if(typeof v === "number") return new Vec2d(this.x + v, this.y + v)
        return new Vec2d(this.x + v.x, this.y + v.y)
    }

    sub(v: Vec2d | number): Vec2d {
        if(typeof v === "number") return new Vec2d(this.x - v, this.y - v)
        return new Vec2d(this.x - v.x, this.y - v.y)
    }

    mul(v: Vec2d | number): Vec2d {
        if(typeof v === "number") return new Vec2d(this.x * v, this.y * v)
        return new Vec2d(this.x * v.x, this.y * v.y)
    }

    div(v: Vec2d | number): Vec2d {
        if(typeof v === "number") return new Vec2d(this.x / v, this.y / v)
        return new Vec2d(this.x / v.x, this.y / v.y)
    }
}