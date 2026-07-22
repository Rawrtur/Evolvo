import { generateQuestions } from "../services/ai.service.js";

export async function generate(req, res) {

    try {

        const { topic } = req.body;

        const result = await generateQuestions(topic);

        res.json(JSON.parse(result));

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "AI generation failed"
        });
    }

}