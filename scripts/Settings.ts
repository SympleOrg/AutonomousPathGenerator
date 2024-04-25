import Point from "./Point.js"
import { selectedPoint, makePointStart } from "./index.js"

const xSetting: HTMLInputElement = document.getElementById("settings-x") as HTMLInputElement
const ySetting: HTMLInputElement = document.getElementById("settings-y") as HTMLInputElement
const connectionSetting: HTMLInputElement = document.getElementById("settings-connection") as HTMLInputElement
const startSetting: HTMLInputElement = document.getElementById("settings-start") as HTMLInputElement
const idText = document.getElementById("id-text")

const robotWidthSettings: HTMLInputElement = document.getElementById("settings-robot-width") as HTMLInputElement
const robotHeightSettings: HTMLInputElement = document.getElementById("settings-robot-height") as HTMLInputElement

export const updatePointSettings = (selectedPoint: Point) => {
    xSetting.value = `${selectedPoint.pos.x}`
    ySetting.value = `${selectedPoint.pos.y}`
    connectionSetting.value = selectedPoint.connection
    startSetting.checked = selectedPoint.start
    idText.innerHTML = `ID: ${selectedPoint.id}`
}

export const updateRobotSettings = () => {
    const rbSettings = loadRobotSettings()

    robotWidthSettings.value = `${rbSettings.width}`
    robotHeightSettings.value = `${rbSettings.height}`
}

export const getPointXValue = () => parseFloat(xSetting.value)
export const getPointYValue = () => parseFloat(ySetting.value)
export const getPointConnectionValue = () => connectionSetting.value
export const getPointStartValue = () => startSetting.checked

export const getRobotWidth = () => parseFloat(robotWidthSettings.value)
export const getRobotHeight = () => parseFloat(robotHeightSettings.value)

xSetting.addEventListener("change", () => {
    if(selectedPoint) selectedPoint.pos.x = getPointXValue()
})

ySetting.addEventListener("change", () => {
    if(selectedPoint) selectedPoint.pos.y = getPointYValue()
})

connectionSetting.addEventListener("change", () => {
    if(selectedPoint) selectedPoint.connection = getPointConnectionValue()
})

startSetting.addEventListener("change", () => {
    if(selectedPoint && getPointStartValue()) return makePointStart(selectedPoint);
    selectedPoint.start = false;
})

robotWidthSettings.addEventListener("change", saveRobotSettings)
robotHeightSettings.addEventListener("change", saveRobotSettings)


function saveRobotSettings(): void {
    window.localStorage.setItem("robotSettings", JSON.stringify({ width: getRobotWidth(), height: getRobotHeight() }))
}

function loadRobotSettings(): { width: number, height: number } {
    return JSON.parse(window.localStorage.getItem("robotSettings"))
}