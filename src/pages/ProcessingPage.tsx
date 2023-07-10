import React, { useState } from "react";

type Process = {
  id: string;
  description: string;
};

const ProcessingPage: React.FC = () => {
  const [transcript, setTranscript] = useState("");
  const [editingTranscript, setEditingTranscript] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [editingProcessId, setEditingProcessId] = useState<string | null>(null);

  const handleTranscriptDoubleClick = () => {
    setEditingTranscript(true);
  };

  const handleTranscriptChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTranscript(event.target.value);
  };

  const handleTranscriptKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Escape") {
      setEditingTranscript(false);
    }
  };

  const handleProcessClick = (process: Process) => {
    // TODO: Apply process to transcript
  };

  const handleProcessEditClick = (process: Process) => {
    setEditingProcessId(process.id);
  };

  const handleAddProcessClick = () => {
    // TODO: Add new process
  };

  return (
    <div className="p-8">
      {/* Text editor */}
      {editingTranscript ? (
        <textarea
          value={transcript}
          onChange={handleTranscriptChange}
          onKeyDown={handleTranscriptKeyDown}
          className="w-full h-32 p-2 border border-gray-300 rounded mb-8"
        />
      ) : (
        <p
          onDoubleClick={handleTranscriptDoubleClick}
          className="whitespace-pre-wrap cursor-text mb-8"
        >
          {transcript}
        </p>
      )}

      {/* Process list */}
      <div className="mb-8">
        {processes.map((process) => (
          <div key={process.id} className="mb-4">
            <button
              onClick={() => handleProcessClick(process)}
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-400"
            >
              Apply
            </button>
            <button
              onClick={() => handleProcessEditClick(process)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400"
            >
              Edit
            </button>
            <p className="mt-2">{process.description}</p>
          </div>
        ))}
        <button
          onClick={handleAddProcessClick}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-400"
        >
          Add Process
        </button>
      </div>

      {/* Text history */}
      {/* TODO: Display previous versions of the text */}
    </div>
  );
};

export default ProcessingPage;
