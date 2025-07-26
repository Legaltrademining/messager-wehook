const express = require("express");
const app = express();
app.use(express.json());

app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "my_verify_token";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  const body = req.body;
  if (body.object === "page") {
    body.entry.forEach(entry => {
      const event = entry.messaging[0];
      console.log("Message received:", event);
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
