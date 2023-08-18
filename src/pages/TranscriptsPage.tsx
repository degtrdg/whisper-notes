import React, { useState } from "react";
import TranscriptList from "../components/TranscriptList";
import RecordingBar from "../components/RecordingBar";
import { Transcript } from "../types";

const TranscriptsPage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);

  // const dummyTranscripts: Transcript[] = [
  //   {
  //     content: "This is a short test transcript.",
  //     transcriptFilePath: "a file path",
  //   },
  //   {
  //     content:
  //       "This is a slightly longer test transcript. It contains a few more words to simulate a longer conversation.",
  //     transcriptFilePath: "a file path",
  //   },
  //   {
  //     content:
  //       "This is a very long test transcript. It contains a lot of words, simulating a lengthy conversation or lecture. This transcript might be from a class or a meeting. It could also be from a conversation with a friend or family member. The content of the transcript could be about anything, from a discussion about a recent movie, to an in-depth exploration of a complex topic. The transcript could also contain various types of data, such as names, dates, or numbers. It's important to test with a variety of data to ensure that the application can handle all types of input.",
  //     transcriptFilePath: "a file path",
  //   },
  //   {
  //     content:
  //       "This is a very long test transcript. It contains a lot of words, simulating a lengthy conversation or lecture. This transcript might be from a class or a meeting. It could also be from a conversation with a friend or family member. The content of the transcript could be about anything, from a discussion about a recent movie, to an in-depth exploration of a complex topic. The transcript could also contain various types of data, such as names, dates, or numbers. It's important to test with a variety of data to ensure that the application can handle all types of input.",
  //     transcriptFilePath: "a file path",
  //   },
  //   {
  //     content:
  //       "This is a very long test transcript. It contains a lot of words, simulating a lengthy conversation or lecture. This transcript might be from a class or a meeting. It could also be from a conversation with a friend or family member. The content of the transcript could be about anything, from a discussion about a recent movie, to an in-depth exploration of a complex topic. The transcript could also contain various types of data, such as names, dates, or numbers. It's important to test with a variety of data to ensure that the application can handle all types of input.",
  //     transcriptFilePath: "a file path",
  //   },
  //   // add more dummy transcripts as needed
  // ];

  return (
    <div className="min-h-screen pb-16 bg-gray-100">
      {/* <TranscriptList transcripts={dummyTranscripts} /> */}
      <RecordingBar isRecording={isRecording} />
    </div>
  );
};

export default TranscriptsPage;
