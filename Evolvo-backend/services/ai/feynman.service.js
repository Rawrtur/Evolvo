import client from "../../config/openai.js";


export async function generateFeynmanFeedback(topic, explaination) {
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
  return response;
}
