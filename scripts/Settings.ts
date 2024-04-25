import Point from "./Point.js"
import { selectedPoint } from "./index.js"

const xSetting: HTMLInputElement = document.getElementById("settings-x") as HTMLInputElement
const ySetting: HTMLInputElement = document.getElementById("settings-y") as HTMLInputElement
const connectionSetting: HTMLInputElement = document.getElementById("settings-connection") as HTMLInputElement
const idText = document.getElementById("id-text")

export const updateSettings = (selectedPoint: Point) => {
    xSetting.value = `${selectedPoint.pos.x}`
    ySetting.value = `${selectedPoint.pos.y}`
    connectionSetting.value = selectedPoint.connection
    idText.innerHTML = `ID: ${selectedPoint.id}`
}

export const getXValue = () => parseFloat(xSetting.value)
export const getYValue = () => parseFloat(ySetting.value)
export const getConnectionValue = () => parseFloat(connectionSetting.value)

xSetting.addEventListener("change", () => {
    if(selectedPoint) selectedPoint.pos.x = getXValue()
})

ySetting.addEventListener("change", () => {
    if(selectedPoint) selectedPoint.pos.y = getYValue()
})

connectionSetting.addEventListener("change", () => {
    if(selectedPoint) selectedPoint.connection = getConnectionValue()
})