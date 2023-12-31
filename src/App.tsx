import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import RecordingIndicator from "./components/RecordingIndicator";
import TranscriptList from "./components/TranscriptList";
import { Transcript } from "./types";

// Assuming electron is available in the global scope
const electron = window.require("electron");
const ipcRenderer = electron.ipcRenderer;

const App: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [lastTranscript, setLastTranscript] = useState<Transcript>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const warmUpRef = useRef<boolean>(true);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null); // <- Reference to store the interval ID
  // Add new state variables for status and message
  const [transcriptionStatus, setTranscriptionStatus] = useState("");
  const [transcriptionMessage, setTranscriptionMessage] = useState("");

  const startRecording = () => {
    recordedChunksRef.current = [];
    mediaRecorderRef.current?.start();
    setRecording(true);
    console.log("Recording started");

    // Start the timer
    recordingIntervalRef.current = setInterval(() => {
      setRecordingDuration((prevDuration) => prevDuration + 1);
    }, 1000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    console.log("Recording stopped");

    // Stop the timer
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }

    setLoading(true);
    // Reset the duration
    setRecordingDuration(0);
  };

  const sendBlobToBackend = (blob: Blob) => {
    console.log(`Sending blob of size: ${blob.size}`);

    if (blob.size > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const buffer = Buffer.from(reader.result as ArrayBuffer);
        ipcRenderer.send("audio-blob", buffer);
      };
      reader.readAsArrayBuffer(blob);
    }
  };

  const handleDataAvailable = (e: any) => {
    if (e.data.size > 0) {
      recordedChunksRef.current.push(e.data);
    }
  };

  const handleStop = () => {
    console.log("handleStop called, warmUpRef.current:", warmUpRef.current); // Debug log
    if (!warmUpRef.current) {
      const blob = new Blob(recordedChunksRef.current, { type: "audio/wav" });
      sendBlobToBackend(blob);
    } else {
      console.log("Warm-up recording, not sending to backend.");
    }
    recordedChunksRef.current = [];
  };

  const warmUpMediaRecorder = (mediaRecorder: MediaRecorder) => {
    console.log("warmUpMediaRecorder called"); // Debug log
    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
      console.log("warmUpMediaRecorder: mediaRecorder stopped"); // Debug log
      warmUpRef.current = false;
      console.log("warmUpMediaRecorder: warmUpRef.current set to false"); // Debug log
      setLoading(false);
    }, 100);
  };

  useEffect(() => {
    // Request all existing transcripts when the application starts
    ipcRenderer.send("get-all-transcripts");
  }, []);

  useEffect(() => {
    ipcRenderer.on(
      "new-transcript",
      (
        event: any,
        newTranscript: {
          status: string;
          message: string;
          content: string;
          transcriptFilePath: string;
          audioFilePath: string;
        }
      ) => {
        newTranscript as Transcript;
        // Update the transcripts state with the new transcript
        setTranscripts((prevTranscripts) => [
          newTranscript,
          ...prevTranscripts,
        ]);
        console.log(newTranscript);

        setLastTranscript(newTranscript);
        setLoading(false);
      }
    );

    return () => {
      ipcRenderer.removeAllListeners("new-transcript");
    };
  }, [loading, recording]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = handleStop;
      warmUpMediaRecorder(mediaRecorder);
    });
  }, []);

  useEffect(() => {
    const toggleRecording = () => {
      if (loading) return;
      recording ? stopRecording() : startRecording();
    };
    ipcRenderer.on("toggle-recording", toggleRecording);
    return () => {
      ipcRenderer.removeAllListeners("toggle-recording");
    };
  }, [recording, loading]);

  return (
    <div>
      <div
        style={
          {
            WebkitAppRegion: "drag",
            height: "20px",
            backgroundColor: "white",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          } as React.CSSProperties
        }
      ></div>
      <TranscriptList transcripts={transcripts} />
      <RecordingIndicator
        recording={recording}
        recordingDuration={recordingDuration}
        transcript={lastTranscript}
        loading={loading}
      />
    </div>
  );
};

export default App;
