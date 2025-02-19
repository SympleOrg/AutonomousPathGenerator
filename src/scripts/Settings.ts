import Action, { actionType } from "./Action.js"
import Point from "./Point.js"
import { selectedPoint, makePointStart } from "./index.js"

const xSetting: HTMLInputElement = document.getElementById("settings-x") as HTMLInputElement
const ySetting: HTMLInputElement = document.getElementById("settings-y") as HTMLInputElement
const connectionSetting: HTMLInputElement = document.getElementById("settings-connection") as HTMLInputElement
const startSetting: HTMLInputElement = document.getElementById("settings-start") as HTMLInputElement
const strafeSetting: HTMLInputElement = document.getElementById("settings-strafe") as HTMLInputElement
const actionSetting: HTMLSelectElement = document.getElementById("setting-action") as HTMLSelectElement
const actionListSetting: HTMLOListElement = document.getElementById("setting-action-list") as HTMLOListElement
const idText = document.getElementById("id-text")

const robotWidthSettings: HTMLInputElement = document.getElementById("settings-robot-width") as HTMLInputElement
const robotHeightSettings: HTMLInputElement = document.getElementById("settings-robot-height") as HTMLInputElement
const robotStartingAngleSettings: HTMLInputElement = document.getElementById("settings-robot-angle") as HTMLInputElement

document.querySelectorAll("#category-button").forEach(button => {
    button.addEventListener("click", () => button.parentElement?.parentElement?.classList.toggle("close"))
})

export const updatePointSettings = (selectedPoint: Point) => {
    xSetting.value = `${selectedPoint.pos.x}`
    ySetting.value = `${selectedPoint.pos.y}`
    connectionSetting.value = selectedPoint.connection
    startSetting.checked = selectedPoint.start
    strafeSetting.checked = selectedPoint.strafe
    actionListSetting.innerHTML = selectedPoint.actionToHtml()
    actionSetting.value = "none"
    idText.innerHTML = `ID: ${selectedPoint.id}`
}

export const updateRobotSettings = () => {
    const rbSettings = loadRobotSettings()

    robotWidthSettings.value = `${rbSettings.width}`
    robotHeightSettings.value = `${rbSettings.height}`
    robotStartingAngleSettings.value = `${rbSettings.startingAngle}`
}

export const getPointXValue = () => parseFloat(xSetting.value)
export const getPointYValue = () => parseFloat(ySetting.value)
export const getPointConnectionValue = () => connectionSetting.value
export const getPointStartValue = () => startSetting.checked
export const getPointStrafeValue = () => strafeSetting.checked
export const getPointActionValue = (): actionType => actionSetting.value as actionType

export const getRobotWidth = () => parseFloat(robotWidthSettings.value)
export const getRobotHeight = () => parseFloat(robotHeightSettings.value)
export const getRobotStartingAngle = () => parseFloat(robotStartingAngleSettings.value)

xSetting.addEventListener("change", () => {
    if(selectedPoint) selectedPoint.pos.x = getPointXValue()
})

ySetting.addEventListener("change", () => {
    if(selectedPoint) selectedPoint.pos.y = getPointYValue()
})

connectionSetting.addEventListener("change", () => {
    if(selectedPoint) selectedPoint.connection = getPointConnectionValue()
})

strafeSetting.addEventListener("change", () => {
    if(selectedPoint) selectedPoint.strafe = getPointStrafeValue()
})

actionSetting.addEventListener("change", () => {
    if(selectedPoint && getPointActionValue() != "none") {
        const action = new Action(genUUID(), getPointActionValue(), {})
        selectedPoint.addAction(action)
        actionListSetting.innerHTML += action.toHtml()
    }
})

startSetting.addEventListener("change", () => {
    if(selectedPoint && getPointStartValue()) return makePointStart(selectedPoint);
    selectedPoint.start = false;
})

robotWidthSettings.addEventListener("change", saveRobotSettings);
robotHeightSettings.addEventListener("change", saveRobotSettings);
robotStartingAngleSettings.addEventListener("change", saveRobotSettings);


(window as any).deleteAction = (actionId: string) => {
    if(selectedPoint) {
        selectedPoint.deleteAction(actionId)
        actionListSetting.innerHTML = selectedPoint.actionToHtml()
    }
}

(window as any).updateAction = (actionId: string, key: string, value: any) => {
    if(selectedPoint) {
        selectedPoint.actions.find(a => a.id == actionId).data[key] = value
    }
}

function saveRobotSettings(): void {
    window.localStorage.setItem("robotSettings", JSON.stringify({ width: getRobotWidth(), height: getRobotHeight(), startingAngle: getRobotStartingAngle() }))
}

function loadRobotSettings(): { width: number, height: number, startingAngle: number } {
    return JSON.parse(window.localStorage.getItem("robotSettings")) ?? { width: 0, height: 0, startingAngle: 0 }
}

function genUUID() {
    let s = "abcdefghijklmnopqrstuvwxyz1234567890"
    
    let emptyString = ""
    for(let i = 0; i < 4; i++) {
        emptyString += s[Math.floor(Math.random() * s.length)];
    }

    return emptyString;
}