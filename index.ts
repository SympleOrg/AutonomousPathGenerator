const { app, BrowserWindow } = require("electron")
const { updateElectronApp } = require('update-electron-app');

updateElectronApp()

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        title: "Autonomous Path Generator",
        icon: "src/assets/logo-512x512.png",
    })
  
    win.loadFile('src/auto.html')

    win.setMenuBarVisibility(false)

    win.on('closed', app.quit)
}

app.whenReady().then(() => {
    createWindow()
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.setUserTasks([])

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})