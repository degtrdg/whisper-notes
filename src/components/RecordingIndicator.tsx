interface RecordingIndicatorProps {
  recording: boolean;
  recordingDuration: number;
}
// RecordingIndicator component
const RecordingIndicator: React.FC<RecordingIndicatorProps> = ({
  recording,
  recordingDuration,
}) => {
  return (
    <div className="fixed bottom-0 left-0 w-full p-6 bg-white shadow">
      {recording ? (
        <p className="flex items-center space-x-2 text-lg font-semibold text-gray-700">
          <span className="animate-pulse">●</span>
          <span>Recording for {recordingDuration}s</span>
        </p>
      ) : (
        <p className="text-lg font-semibold text-gray-700">Not recording</p>
      )}
    </div>
  );
};
export default RecordingIndicator;
