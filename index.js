import express from 'express';
import chatGPT from 'chatgpt-io';
import * as dotenv from 'dotenv';
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Initialize chatbot with a session token
const bot = new chatGPT(process.env.CHATGPT_SESSION_TOKEN);

// Wait for chatbot to be ready
bot.waitForReady().then(() => {
  console.log("Chatbot is ready!");
});

// API route for asking the chatbot a question
app.post("/ask", async (req, res) => {
  // Get question and conversation_id from body parameters
  const { api_key, message, conversation_id } = req.body;

  // Return an error if the chatbot is not yet ready
  if (api_key !== process.env.API_KEY) {
    res.status(503).send({
      error: "API Key is invalid!"
    });
    return;
  }

  if (!bot.ready) {
    res.status(503).send({
      error: "Chatbot is not ready yet"
    });
    return;
  }

  // Use conversation_id if provided, otherwise use default conversation
  let response;
  if (conversation_id) {
    response = await bot.ask(message, conversation_id);
  } else {
    response = await bot.ask(message);
  }

  // Send response as JSON
  res.send({
    response,
  });
});

const port = process.env.CHATGPT_PORT || 3000;
app.listen({ port }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`API listening on port ${port}`);
});
