const electron = require("electron");
const path = require("path");
const fs = require("fs");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const ipcMain = electron.ipcMain;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
  });
  mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  mainWindow.webContents.openDevTools();
}

app.on("ready", () => {
  createWindow();

  // Register the global shortcut
  globalShortcut.register("CommandOrControl+Shift+X", () => {
    // Send the 'toggle-recording' message to the renderer process
    mainWindow.webContents.send("toggle-recording");
  });
});

app.on("will-quit", () => {
  // Unregister the shortcut before quitting the app
  globalShortcut.unregister("CommandOrControl+Shift+X");
  globalShortcut.unregisterAll();
});

const rawAudioPath = path.join(__dirname, "raw_audio");
if (!fs.existsSync(rawAudioPath)) {
  fs.mkdirSync(rawAudioPath);
}

const transcriptPath = path.join(__dirname, "transcripts");
if (!fs.existsSync(transcriptPath)) {
  fs.mkdirSync(transcriptPath);
}

ipcMain.on("audio-blob", (event, audioBuffer) => {
  const audioFilePath = path.join(rawAudioPath, `${Date.now()}.wav`);
  fs.writeFileSync(audioFilePath, audioBuffer);
  console.log(`Audio saved to: ${audioFilePath}`);

  const transcriptFilePath = path.join(transcriptPath, `${Date.now()}.txt`);
  fs.writeFileSync(
    transcriptFilePath,
    `Transcript for audio file: ${audioFilePath}`
  );
  console.log(`Transcript saved to: ${transcriptFilePath}`);

  mainWindow.webContents.send("new-transcript", transcriptFilePath);
});
