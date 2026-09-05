import { transriptAudio } from "../services/ai/ai.service.js";
import { generateQuestions } from "../services/ai/question.service.js";
import { generateFeynmanFeedback } from "../services/ai/feynman.service.js";
import fs from "fs/promises";
import AIUsage from "../models/ai-usage.model.js";

export async function generate(req, res, next) {
  try {
    const { topic } = req.body;

    const startTime = performance.now();
    const result = await generateQuestions(topic);
    const endTime = performance.now();

    if (!result || result.error) {
      return res.status(400).json({
        success: false,
        message: "Ai failed to generate.",
      });
    }

    const object = result.output_text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    await AIUsage.create([
      {
        user: req.user._id,
        feature: "question-generation",
        requestId: result._request_id,
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
        totalTokens: result.usage.total_tokens,
        processingTime: (endTime - startTime).toFixed(2),
      },
    ]);

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
  let filePath;
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required",
      });
    }

    filePath = req.file.path;

    const { topic } = req.body;

    const startTime = performance.now();

    const transcript = await transriptAudio(filePath);

    const result = await generateFeynmanFeedback(topic, transcript.text);

    if (!result || result.error) {
      return res.status(400).json({
        success: false,
        message: "Ai failed to generate.",
      });
    }

    const endTime = performance.now();

    const feedback = result.output_text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();

    await AIUsage.create([
      {
        user: req.user._id,
        feature: "feynman-feedback",
        requestId: result._request_id,
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
        totalTokens: result.usage.total_tokens,
        processingTime: (endTime - startTime).toFixed(2),
      },
    ]);

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
