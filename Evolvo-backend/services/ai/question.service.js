import client from "../../config/openai.js";


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
  return response;
}