import React, { useState, useEffect } from "react";
import { FaCopy, FaTrash } from "react-icons/fa";
import { Transcript } from "../types";
import { ipcRenderer } from "electron";
import path from "path";

type TranscriptItemProps = {
  transcript: Transcript;
};

const TranscriptItem: React.FC<TranscriptItemProps> = ({ transcript }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleMinimize = () => {
    setIsExpanded(false);
  };

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(transcript.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    const filenameWithoutExtension = path.basename(
      transcript.filePath,
      path.extname(transcript.filePath)
    );
    ipcRenderer.send("delete-audio-and-transcript", filenameWithoutExtension);
    setIsDeleted(true);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleMinimize();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const classNames = isDeleted
    ? "bg-gray-200 text-gray-500"
    : "bg-white shadow rounded-lg p-6 mb-4 cursor-pointer flex justify-between items-start hover:bg-gray-100";

  if (isDeleted) {
    return null; // or return <></>; for an empty fragment
  }

  return (
    <div
      onDoubleClick={!isDeleted ? handleExpand : undefined}
      className={classNames}
    >
      <div className="flex-grow">
        <p className="text-gray-800">
          {isExpanded
            ? transcript.content
            : `${transcript.content.slice(0, 100)}...`}
        </p>
        {isCopied && <div className="mt-2 text-sm text-gray-600">Copied!</div>}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
          title="Delete transcript"
          disabled={isDeleted}
        >
          <FaTrash />
        </button>
        <button
          onClick={handleCopy}
          className="text-gray-500 hover:text-gray-700"
          title="Copy transcript to clipboard"
          disabled={isDeleted}
        >
          <FaCopy />
        </button>
      </div>
    </div>
  );
};

export default TranscriptItem;
