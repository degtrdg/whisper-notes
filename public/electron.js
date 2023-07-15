const electron = require("electron");
const path = require("path");
const fs = require("fs");
const transcribeAudioWithWhisperApi = require("./transcribeAudioWithWhisperApi");
const { clipboard } = require("electron");
require("dotenv").config();

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

ipcMain.on("audio-blob", async (event, audioBuffer) => {
  const audioFilePath = path.join(rawAudioPath, `${Date.now()}.wav`);
  fs.writeFileSync(audioFilePath, audioBuffer);
  console.log(`Audio saved to: ${audioFilePath}`);

  const transcriptText = await transcribeAudioWithWhisperApi(
    audioFilePath,
    process.env.WHISPER_API_KEY
  );

  const transcriptFilePath = path.join(transcriptPath, `${Date.now()}.txt`);
  fs.writeFileSync(transcriptFilePath, transcriptText);
  console.log(`Transcript saved to: ${transcriptFilePath}`);

  mainWindow.webContents.send("new-transcript", transcriptText);
  // Write the transcript text to the system clipboard
  clipboard.writeText(transcriptText);
});

ipcMain.on("get-all-transcripts", async (event) => {
  fs.readdir(transcriptPath, (err, files) => {
    if (err) {
      console.error("Error reading transcript directory:", err);
      return;
    }

    files.forEach((file) => {
      const transcriptFilePath = path.join(transcriptPath, file);
      const transcriptText = fs.readFileSync(transcriptFilePath, "utf8");
      mainWindow.webContents.send("new-transcript", transcriptText);
    });
  });
});
