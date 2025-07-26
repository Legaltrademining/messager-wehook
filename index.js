const express = require("express");
const app = express();
app.use(express.json());

// Your verify token as a string
const VERIFY_TOKEN = "09092644023"; // This must match exactly with the one entered in Facebook

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403); // Token mismatch
    }
  } else {
    res.sendStatus(400); // Missing query parameters
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
