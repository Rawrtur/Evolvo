import client from "../../config/openai.js";
import fs from "fs"


export async function transriptAudio(filePath) {
  const transcript = await client.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "gpt-4o-mini-transcribe",
    });
    return transcript;
} 
