import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import { FaCog } from "react-icons/fa";

interface RecordingIndicatorProps {
  recording: boolean;
  recordingDuration: number;
}

const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({
  recording,
  recordingDuration,
}) => {
  const [editingAPIKey, setEditingAPIKey] = useState(false);
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    ipcRenderer.send("load-api-key");
    ipcRenderer.on("load-api-key-reply", (_, response) => {
      setApiKey(response);
    });

    return () => {
      ipcRenderer.removeAllListeners("load-api-key-reply");
    };
  }, []);

  const saveAPIKey = () => {
    ipcRenderer.send("save-api-key", apiKey);
    setEditingAPIKey(false);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      saveAPIKey();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 flex items-center justify-between w-full p-6 bg-white shadow">
      {recording ? (
        <p className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
          <span className="animate-pulse">●</span>
          <span>Recording for {recordingDuration}s</span>
        </p>
      ) : (
        <p className="text-lg font-semibold text-gray-700">Not recording</p>
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
