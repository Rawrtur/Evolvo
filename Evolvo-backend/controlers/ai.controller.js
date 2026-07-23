import client from "../config/openai.js";
import {
  generateFeymanFeedback,
  generateQuestions,
} from "../services/ai.service.js";
import fs from "fs";

export async function generate(req, res, next) {
  try {
    const { topic } = req.body;

    const result = await generateQuestions(topic);

    const object = result
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    res.status(200).json({
      success: true,
      message: "Generated questions",
      data: JSON.parse(object),
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}


export async function feynman(req, res, next) {
  try {
    const { topic } = req.body;

    console.log(req.file);

    const transcript = await client.audio.transcriptions.create({
      file: fs.createReadStream(req.file.path),
      model: "gpt-4o-mini-transcribe",
    });

    const result = await generateFeymanFeedback(topic, transcript.text);
    const feedback = result
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
    res.status(200).json({
      success: true,
      message: "generated feedback",
      feedback: JSON.parse(feedback)
    });
  } catch (error) {
    next(error);
  }
}
