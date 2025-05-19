// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors({
  origin: '*', // of vervang '*' door jouw Netlify-URL voor veiligheid
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
            content:
              'Je bent een professionele jeugd- en gezinsprofessional. Je antwoorden zijn empathisch, deskundig en helder geformuleerd.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.6,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const aiReply = response.data.choices[0].message.content.trim();
    res.json({ reply: aiReply });
  } catch (error) {
    console.error('❌ Fout bij OpenAI-aanroep:', error.response?.data || error.message);
    res.status(500).json({ error: 'OpenAI-verzoek mislukt.' });
  }
});

app.listen(PORT, () => {
console.log(`🟢 Aivie backend draait succesvol op poort ${PORT}`);
});
