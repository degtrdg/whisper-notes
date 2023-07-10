import React from "react";

type RecordingBarProps = {
  isRecording: boolean;
};

const RecordingBar: React.FC<RecordingBarProps> = ({ isRecording }) => {
  return (
    <div className="fixed bottom-0 w-full p-4 bg-white shadow-md">
      <p className="text-center text-lg text-gray-800">
        {isRecording ? "Recording..." : "Not recording"}
      </p>
    </div>
  );
};

export default RecordingBar;
