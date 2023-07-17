const electron = require("electron");
const path = require("path");
const fs = require("fs");
const transcribeAudioWithWhisperApi = require("./transcribeAudioWithWhisperApi");
const { clipboard } = require("electron");
const log = require("electron-log");

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const globalShortcut = electron.globalShortcut;
const ipcMain = electron.ipcMain;

let mainWindow;

// Initialize the paths after app is ready
let apiKeyPath;
let rawAudioPath;
let transcriptPath;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    frame: false,
  });
  mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
  // mainWindow.webContents.openDevTools({ mode: "detach" });
}

app.on("ready", () => {
  createWindow();

  // Set up the paths using app.getPath
  const userDataPath = app.getPath("userData");
  apiKeyPath = path.join(userDataPath, "api_key.txt");
  rawAudioPath = path.join(userDataPath, "raw_audio");
  transcriptPath = path.join(userDataPath, "transcripts");

  // Make sure the directories exist
  if (!fs.existsSync(rawAudioPath)) {
    fs.mkdirSync(rawAudioPath, { recursive: true });
  }

  if (!fs.existsSync(transcriptPath)) {
    fs.mkdirSync(transcriptPath, { recursive: true });
  }

  let apiKey = "";
  if (fs.existsSync(apiKeyPath)) {
    apiKey = fs.readFileSync(apiKeyPath, "utf8");
  }
  mainWindow.webContents.send("load-api-key-reply", apiKey);

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

ipcMain.on("audio-blob", async (event, audioBuffer) => {
  const fileName = Date.now();
  const audioFilePath = path.join(rawAudioPath, `${fileName}.wav`);
  fs.writeFileSync(audioFilePath, audioBuffer);
  console.log(`Audio saved to: ${audioFilePath}`);
  log.info(`Audio saved to: ${audioFilePath}`);
  // Check if API key works and exists in the path
  let apiKey = "";
  if (fs.existsSync(apiKeyPath)) {
    apiKey = fs.readFileSync(apiKeyPath, "utf8");
  }
  if (!apiKey) {
    console.error("API key not found");
    log.error("API key not found");
    return;
  }

  let transcriptText;
  try {
    transcriptText = await transcribeAudioWithWhisperApi(audioFilePath, apiKey);
  } catch (error) {
    console.error("Error during transcription:", error);
    log.error("Error during transcription:", error);
    return;
  }

  const transcriptFilePath = path.join(transcriptPath, `${fileName}.txt`);
  try {
    fs.writeFileSync(transcriptFilePath, transcriptText);
    console.log(`Transcript saved to: ${transcriptFilePath}`);
    log.info(`Transcript saved to: ${transcriptFilePath}`);
  } catch (err) {
    console.error(`Error writing the transcript file: ${err}`);
    log.error(`Error writing the transcript file: ${err}`);
    return;
  }

  mainWindow.webContents.send("new-transcript", {
    content: transcriptText,
    filePath: transcriptFilePath,
  });
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
      mainWindow.webContents.send("new-transcript", {
        content: transcriptText,
        filePath: transcriptFilePath,
      });
    });
  });
});

ipcMain.on("delete-audio-and-transcript", (event, fileNameWithoutExtension) => {
  const audioFilePath = path.join(
    rawAudioPath,
    `${fileNameWithoutExtension}.wav`
  );
  const transcriptFilePath = path.join(
    transcriptPath,
    `${fileNameWithoutExtension}.txt`
  );

  try {
    // Delete audio file
    if (fs.existsSync(audioFilePath)) {
      fs.unlinkSync(audioFilePath);
      console.log(`Audio file deleted: ${audioFilePath}`);
      log.info(`Audio file deleted: ${audioFilePath}`);
    } else {
      console.log(`Audio file does not exist: ${audioFilePath}`);
      log.error(`Audio file does not exist: ${audioFilePath}`);
    }

    // Delete transcript file
    if (fs.existsSync(transcriptFilePath)) {
      fs.unlinkSync(transcriptFilePath);
      console.log(`Transcript file deleted: ${transcriptFilePath}`);
      log.info(`Transcript file deleted: ${transcriptFilePath}`);
    } else {
      console.log(`Transcript file does not exist: ${transcriptFilePath}`);
      log.error(`Transcript file does not exist: ${transcriptFilePath}`);
    }

    // Send response back to renderer process
    mainWindow.webContents.send(
      "deleted-audio-and-transcript",
      fileNameWithoutExtension
    );
  } catch (err) {
    console.error(`Error deleting files: ${err}`);
    log.error(`Error deleting files: ${err}`);
  }
});

ipcMain.on("save-api-key", (event, apiKey) => {
  fs.writeFileSync(apiKeyPath, apiKey, "utf8");
});

ipcMain.on("load-api-key", (event) => {
  let apiKey = "";
  if (fs.existsSync(apiKeyPath)) {
    apiKey = fs.readFileSync(apiKeyPath, "utf8");
  }
  event.reply("load-api-key-reply", apiKey);
});
