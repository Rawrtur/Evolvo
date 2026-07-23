import {
  generateFeymanFeedback,
  generateQuestions,
  transriptAudio,
} from "../services/ai.service.js";
import fs from "fs/promises";

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
  const filePath = req.file.path;
  try {
    const { topic } = req.body;

    const transcript = await transriptAudio(filePath);

    const result = await generateFeymanFeedback(topic, transcript.text);

    const feedback = result
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    res.status(200).json({
      success: true,
      message: "generated feedback",
      feedback: JSON.parse(feedback),
    });
  } catch (error) {
    next(error);
  } finally {
    await fs.unlink(filePath).catch((err) => {
      console.error("Audio konnte nicht gelöscht werden:", err.message);
    });
  }
}
