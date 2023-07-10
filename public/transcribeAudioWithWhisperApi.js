const fs = require("fs");
const FormData = require("form-data");

async function transcribeAudioWithWhisperApi(audioFilePath, WHISPER_API_KEY) {
  const fetch = (await import("node-fetch")).default;

  const formData = new FormData();
  formData.append("file", fs.createReadStream(audioFilePath));
  formData.append("model", "whisper-1");

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHISPER_API_KEY}`,
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error transcribing the audio");
  }

  return data.text;
}

module.exports = transcribeAudioWithWhisperApi;
