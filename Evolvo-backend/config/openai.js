import OpenAI from "openai";
import { AI_API_KEY } from "./env.js";

const client = new OpenAI({
    apiKey: AI_API_KEY,
});

export default client;