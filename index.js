require("dotenv").config();
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(express.json());

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const port = process.env.PORT || 5000;

app.post("/ask", async (req, res) => {
    const prompt = "how are you doing!";

    try {
        if (prompt == null) {
            throw new Error("Uh oh, no prompt was provided");
        }

        const response = await openai.createCompletion({
            model: "gpt-3.5-turbo-1106",
            prompt,
            max_tokens: 4096,
        });

        const completion = response.data.choices[0].text;

        return res.status(200).json({
            success: true,
            message: completion,
        });
    } catch (error) {
        console.log(error.message);
    }
});

app.listen(port, () => console.log(`Server is running on port ${port}!!`));