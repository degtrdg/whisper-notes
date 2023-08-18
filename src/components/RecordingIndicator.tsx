import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import { FaCog, FaCircle, FaPlay } from "react-icons/fa";
import { Transcript } from "../types";

interface RecordingIndicatorProps {
  recording: boolean;
  recordingDuration: number;
  transcript: Transcript | undefined;
  loading: boolean;
}

const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({
  recording,
  recordingDuration,
  transcript,
  loading,
}) => {
  const [editingAPIKey, setEditingAPIKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [ellipsis, setEllipsis] = useState("");

  useEffect(() => {
    ipcRenderer.send("load-api-key");
    ipcRenderer.on("load-api-key-reply", (_, response) => {
      setApiKey(response);
    });

    return () => {
      ipcRenderer.removeAllListeners("load-api-key-reply");
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (loading) {
      interval = setInterval(() => {
        setEllipsis((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
    } else {
      if (interval) {
        clearInterval(interval);
      }
      setEllipsis("");
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loading]);

  const saveAPIKey = () => {
    ipcRenderer.send("save-api-key", apiKey);
    setEditingAPIKey(false);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      saveAPIKey();
    }
  };

  const openAudioFile = () => {
    if (transcript && transcript.audioFilePath) {
      ipcRenderer.send("open-file", transcript.audioFilePath);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 flex items-center justify-between w-full p-6 bg-white shadow">
      {recording ? (
        <p className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
          <span className="animate-pulse">●</span>
          <span>Recording for {recordingDuration}s</span>
        </p>
      ) : loading ? (
        <p className="text-lg font-semibold text-gray-700">
          Processing{ellipsis}
        </p>
      ) : (
        <div className="relative inline-flex items-center cursor-pointer group">
          <p className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
            <span
              className={`${
                transcript === undefined || transcript.status === "success"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ●
            </span>
            <span>Not recording</span>
            {transcript && transcript.status === "success" && (
              <FaPlay
                onClick={openAudioFile}
                className="ml-2 cursor-pointer hover:text-blue-500"
              />
            )}
          </p>
          <div className="absolute w-0 h-auto px-2 py-1 text-xs text-white transition-all duration-200 ease-in-out bg-black rounded-md opacity-0 group-hover:w-auto group-hover:opacity-100 whitespace-nowrap bottom-full">
            {transcript === undefined
              ? "Looking good! Start recording"
              : transcript.message}
          </div>
        </div>
      )}

      {editingAPIKey ? (
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={saveAPIKey}
          className="p-2 border rounded"
        />
      ) : (
        <button
          onClick={() => setEditingAPIKey(true)}
          className="text-lg font-semibold text-gray-700"
        >
          <FaCog />
        </button>
      )}
    </div>
  );
};

export default RecordingIndicator;
