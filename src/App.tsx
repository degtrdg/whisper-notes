import React, { useEffect, useRef } from "react";
import "./App.css";

// Assuming electron is available in the global scope
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const App: React.FC = () => {
  const mediaRecorderRef = useRef<any>(null);
  const recordedChunksRef = useRef<any[]>([]);

  useEffect(() => {
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

      mediaRecorder.start();
      console.log("Recording started"); // log recording start

      // Automatically stop recording after 5 seconds
      setTimeout(() => {
        mediaRecorder.stop();
        console.log("Recording stopped"); // log recording stop

        // Convert Blob parts into a single Blob and send it to the backend
        const blob = new Blob(recordedChunksRef.current, { type: "audio/wav" });
        console.log(`Sending blob of size: ${blob.size}`); // log blob size

        // Read the Blob data as an ArrayBuffer, convert it to Buffer, and send it over IPC
        const reader = new FileReader();
        reader.onloadend = () => {
          const buffer = Buffer.from(reader.result as ArrayBuffer);
          ipcRenderer.send("audio-blob", buffer);
        };
        reader.readAsArrayBuffer(blob);
      }, 5000);
    };

    startRecording();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>Recording...</p>
      </header>
    </div>
  );
};

export default App;
