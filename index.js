// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors({
  origin: '*', // voor testdoeleinden, later strenger maken
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Aivie backend draait correct');
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Bericht mag niet leeg zijn.' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
Je bent Aivie – een warme, toegankelijke digitale hulplijn voor opvoeders. 
Je spreekt opvoeders vriendelijk en geruststellend aan met 'je' en gebruikt duidelijke, eenvoudige taal. 
Je antwoorden zijn empathisch, positief en bieden concrete handvatten waar mogelijk. 
Als je het niet zeker weet, moedig je aan om contact te zoeken met een professional in de buurt. 
Je geeft geen medisch advies, stelt gerust en helpt bij eerste denkstappen in de opvoeding.
            `.
