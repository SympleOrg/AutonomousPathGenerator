import { points, consoleOutput } from "./index.js";
import { commandOuput } from "./Generator.js";
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

export const downloadData = (name: string, blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = name
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
}

const savePointsToFile = (name: string) => {
    const data = {
        points: points.map(p => p.toJson())
    }

    const blob = new Blob([JSON.stringify(data)], {type: "application/json"})
    downloadData(name, blob)
    consoleOutput.log("Save successful")
}

const downloadCommandOutput = (name: string) => {
    const text = commandOuput.element.innerText
    if(text.trim() == "") return consoleOutput.log("No command output to save");

    const blob = new Blob([commandOuput.element.innerText], {type: "text/plain"})
    downloadData(name, blob)
    consoleOutput.log("Save successful")
}

export const tryToSave = () => {
    const saveName = prompt("Save name")
    if(!saveName) return;
    saveToLocalStorage(saveName)
    points.length = 0;
    consoleOutput.log("Save successful")
}

export const tryToLoadFromLocalStorage = () => {
    const saveName = prompt("Save to load")
    if(!saveName) return;
    loadFromLocalStorage(saveName)
    consoleOutput.log("Load successful")
}

export const tryToDeleteFromLocalStorage = () => {
    const saveName = prompt("Save to delete")
    if(!saveName) return;
    window.localStorage.removeItem(savePrefix + saveName)
    consoleOutput.log("Delete successful")
}

document.getElementById("download-save-button").addEventListener("click", () => savePointsToFile(`robot_path_save_${genRandomStr(6)}.json`))
document.getElementById("download-code-button").addEventListener("click", () => downloadCommandOutput(`robot_path_code_${genRandomStr(6)}.txt`))

document.getElementById("upload-save").addEventListener("input", (e) => {
    const file = (e.target as HTMLInputElement).files[0]

    if(!file) return consoleOutput.log("No file selected");

    const reader = new FileReader()

    reader.onload = (e) => {
        console.log("Loaded")

        try {
            const data: ISaveData = JSON.parse(e.target?.result as string)
            if(!data) return consoleOutput.log("No data found for save " + name);
            if(!data.points) return consoleOutput.log("No data found for save " + name);
            
            points.length = 0;
            data.points.forEach(p => points.push(Point.fromJson(p)))

            consoleOutput.log("Load successful")
        } catch {
            consoleOutput.log("Invalid json file content")
        }
    }

    reader.readAsText(file)
})

function genRandomStr(length: number): string {
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    let result = '';
    
    for (let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}