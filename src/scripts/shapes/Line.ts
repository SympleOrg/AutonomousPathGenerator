import Vec2d from "../Vec2d.js";

export default class Line {
    from: Vec2d;
    to: Vec2d;
    color: string;
    width: number;

    constructor(from: Vec2d, to: Vec2d, color: string, width: number) {
        this.from = from;
        this.to = to;
        this.color = color;
        this.width = width;
    }
}