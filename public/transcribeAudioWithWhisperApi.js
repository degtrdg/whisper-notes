const fs = require("fs");
const FormData = require("form-data");
const https = require("https");
const stream = require("stream");
const { promisify } = require("util");

async function transcribeAudioWithWhisperApi(audioFilePath, WHISPER_API_KEY) {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(audioFilePath));
  formData.append("model", "whisper-1");

  const options = {
    hostname: "api.openai.com",
    path: "/v1/audio/transcriptions",
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHISPER_API_KEY}`,
      ...formData.getHeaders(),
    },
  };

  const pipeline = promisify(stream.pipeline);

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode <= 299) {
          resolve(JSON.parse(data).text);
        } else {
          reject(new Error(`HTTP Error: ${res.statusCode}`));
        }
      });
    });

    req.on("error", reject);

    pipeline(formData, req).catch(reject);
  });
}

module.exports = transcribeAudioWithWhisperApi;
