import React from "react";
import TranscriptItem from "./TranscriptItem";
import { Transcript } from "../types";

type TranscriptListProps = {
  transcripts: Transcript[];
};

const TranscriptList: React.FC<TranscriptListProps> = ({ transcripts }) => {
  return (
    <div className="max-w-lg pt-8 mx-auto pb-15">
      {transcripts.map((transcript, index) => (
        <TranscriptItem key={index} transcript={transcript} />
      ))}
    </div>
  );
};

export default TranscriptList;
