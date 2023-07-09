import React, { useEffect, useRef, useState } from "react";
import "./App.css";

// Assuming electron is available in the global scope
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const App: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<any>(null);
  const recordedChunksRef = useRef<any[]>([]);

  useEffect(() => {
    ipcRenderer.on("toggle-recording", () => {
      if (recording) {
        stopRecording();
      } else {
        startRecording();
      }
    });

    return () => {
      ipcRenderer.removeAllListeners("toggle-recording");
    };
  }, [recording]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    recordedChunksRef.current = [];

    mediaRecorder.ondataavailable = (e: any) => {
      if (e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    // On stop event, gather the chunks, create the Blob and send it to the backend
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "audio/wav" });
      console.log(`Sending blob of size: ${blob.size}`);

      const reader = new FileReader();
      reader.onloadend = () => {
        const buffer = Buffer.from(reader.result as ArrayBuffer);
        ipcRenderer.send("audio-blob", buffer);
      };
      reader.readAsArrayBuffer(blob);
    };

    mediaRecorder.start();
    setRecording(true);
    console.log("Recording started");
  };

  const stopRecording = () => {
    if (!recording || !mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    setRecording(false);
    console.log("Recording stopped");
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>{recording ? "Recording..." : "Not recording"}</p>
      </header>
    </div>
  );
};

export default App;
