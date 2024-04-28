import { points, consoleOutput } from "./index.js";
import Point from "./Point.js";

const savePrefix = "save_"

interface IPoint {
    pos: {
        x: number,
        y: number
    }
    id: string
    connection: string | null
    start: boolean
}

interface ISaveData {
    points: IPoint[]
}

const saveToLocalStorage = (name: string) => {
    const data = {
        points: points.map(p => p.toJson())
    }

    window.localStorage.setItem(savePrefix + name, JSON.stringify(data))
}

const loadFromLocalStorage = (name: string) => {
    const localData = window.localStorage.getItem(savePrefix + name)
    if(!localData) return consoleOutput.log("No data found for save " + name);
    const data: ISaveData = JSON.parse(localData);
    if(!data) return consoleOutput.log("No data found for save " + name);
    if(!data.points) return consoleOutput.log("No data found for save " + name);

    points.length = 0;
    data.points.forEach(p => points.push(Point.fromJson(p)))
}

export const tryToSave = () => {
    const saveName = prompt("Save name")
    if(!saveName) return;
    saveToLocalStorage(saveName)
    points.length = 0;
    consoleOutput.log("Save successful")
}

export const tryToLoad = () => {
    const saveName = prompt("Save to load")
    if(!saveName) return;
    loadFromLocalStorage(saveName)
    consoleOutput.log("Load successful")
}

export const tryToDelete = () => {
    const saveName = prompt("Save to delete")
    if(!saveName) return;
    window.localStorage.removeItem(savePrefix + saveName)
    consoleOutput.log("Delete successful")
}