import { points, consoleOutput } from "./index.js"
import { getRobotStartingAngle } from "./Settings.js";
import Logger from "./util/Logger.js"

const generatePathButton = document.getElementById("generate-path-button");
export const commandOuput = new Logger("command-output");

const commands = {
    forward: "new MoveForwardCommand(this.driveBase, &{dist})",
    rotate: "new RotateCommand(this.driveBase, &{angle})",
}

export default {
    initialize: () => {
        generatePathButton.addEventListener("click", generatePath);
    }
}

const getStartingPoint = () => {
    return points.find(point => point.start);
}

export const generatePath = () => {
    const startingPoint = getStartingPoint();
    if(!startingPoint) {
        consoleOutput.log("No starting point was found");
        return;
    }

    commandOuput.clear();
    consoleOutput.clear();

    const visitedPoints: string[] = [];

    let point = startingPoint;
    let lastAngle = getRobotStartingAngle()

    while(true) {
        const connectionPoint = points.find(pt => pt.id == point.connection);
        if(!connectionPoint) {
            consoleOutput.log(`Point with id ${point.connection} was not found`);
            break;
        }

        // thx ChatGPT :D
        const IEEEremainder = (x: number, y: number): number => {
            return x - Math.round(x / y) * y;
        }

        const angle = IEEEremainder(point.calcAngleToPoint(connectionPoint.pos) - lastAngle, 360)
        const moveDist = point.calcMoveDist(connectionPoint.pos)
        commandOuput.log(commands.rotate.replace(/&{angle}/g, `${angle}`))
        commandOuput.log(commands.forward.replace(/&{dist}/g, `${moveDist}`))
    
        point = connectionPoint;
        lastAngle += angle
        
        if(!visitedPoints.includes(point.id)) {
            visitedPoints.push(point.id);
        } else {
            break;
        }
    }

    consoleOutput.log("Done!");
}