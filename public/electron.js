const electron = require("electron");
const path = require("path");
const fs = require("fs");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  // Open the DevTools.
  mainWindow.webContents.openDevTools({ mode: "undocked" });
}

app.on("ready", createWindow);

const rawAudioPath = path.join(__dirname, "raw_audio");
if (!fs.existsSync(rawAudioPath)) {
  fs.mkdirSync(rawAudioPath);
}

ipcMain.on("audio-blob", (event, audioBuffer) => {
  const audioPath = path.join(rawAudioPath, "audio.wav");
  fs.writeFileSync(audioPath, audioBuffer);
  console.log(`Audio saved to: ${audioPath}`); // log the path where audio is saved
});
