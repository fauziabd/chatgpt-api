import chatGPT from "chatgpt-io";
import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.post('/ask', (req, res) => {
  const data = req.body;
  //const data = JSON.parse(raw)
  if (data.hasOwnProperty("message") && data.hasOwnProperty("token")) {
    (async function() {
      let bot = new chatGPT(data.token);
      await bot.waitForReady();

      let result = await bot.ask(data.message);
      res.json({ response: result });
    })();
  } else {
    res.json({ message: 'Please enter your token and the message!' });
  }
});
app.listen(3000, () => {
  console.log(`Listening on port 3000`)
})