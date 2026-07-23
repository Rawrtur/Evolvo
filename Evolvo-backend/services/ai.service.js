import client from "../config/openai.js";
import fs from "fs"

export async function generateQuestions(topic) {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `
You are a professional tutor.

Create exactly 5 flashcards.

Rules:

- One question per card
- Answer limited to 15 words maximum
- No repetitions
- Medium difficulty
- Explain technical terms
- No introduction
- Output in JSON format only

Topic:
${topic}

Provide your answer in JSON format only.

    [
        {
            "question":"",
            "answer":""
        }
    ]

`,
  });
  return response.output_text;
}

export async function transriptAudio(filePath) {
  const transcript = await client.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "gpt-4o-mini-transcribe",
    });
    return transcript;
} 

export async function generateFeymanFeedback(topic, explaination) {
  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: `
        You are a tutor.

Topic:
${topic}

The student’s explanation:

${explaination}

Rate the explanation using the Feynman Technique.

Assess the following:

- Clarity
- Technical accuracy
- Completeness
- Plain language
- Missing concepts

Give an overall score from 0 to 100.
Provide your answer in JSON format only.

{
    "score":"",
    "level":"",
    "strengths":[
    "...",
    "...",
    ],
    "weaknesses": [
    "...",
    "..."
  ],
  "missingTopics": [
    "...",
    "..."
  ],
  "tips": [
    "...",
    "..."
  ],
  "summary": "..."
}
        `,
  });
  return response.output_text;
}
