import React, { useState, useEffect } from "react";
import { FaCopy } from "react-icons/fa";
import { Transcript } from "../types";

type TranscriptItemProps = {
  transcript: Transcript;
};

const TranscriptItem: React.FC<TranscriptItemProps> = ({ transcript }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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

  return (
    <div
      onDoubleClick={handleExpand}
      className="bg-white shadow rounded-lg p-6 mb-4 cursor-pointer flex justify-between items-start hover:bg-gray-100"
    >
      <p className="text-gray-800">
        {isExpanded
          ? transcript.content
          : `${transcript.content.slice(0, 100)}...`}
      </p>
      <div className="relative">
        <button
          onClick={handleCopy}
          className="text-gray-500 hover:text-gray-700"
          title="Copy transcript to clipboard"
        >
          <FaCopy />
        </button>
        {isCopied && (
          <div
            className="absolute right-0 transform translate-x-7 -translate-y-full bg-gray-200 text-sm text-gray-600 py-1 px-2 rounded"
            style={{ bottom: "0px" }} // Adjust this value to move the "Copied!" confirmation closer to the copy button
          >
            Copied!
          </div>
        )}
      </div>
    </div>
  );
};

export default TranscriptItem;
