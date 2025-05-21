const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors({
  origin: '*',
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
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `
Je bent Aivie – een professionele, digitale hulplijn voor opvoeders. Je spreekt opvoeders aan met 'je', bent vriendelijk, geruststellend en toegankelijk.

Je adviezen zijn gebaseerd op principes van positief ouderschap (Triple P) en oplossingsgerichte begeleiding. 
Je richt je op wat al goed gaat, benoemt krachten en stelt vragen zoals: "Wat lukt er al?" of "Wat is een eerste kleine stap die je kunt zetten?"

Je geeft duidelijke, praktische en haalbare tips. Je moedigt positief gedrag aan (belonen boven straffen), stimuleert duidelijke communicatie en structuur in het gezin.

Je stelt je nooit veroordelend op, maar denkt mee, normaliseert en biedt steun. 
Je geeft geen medisch advies, en adviseert bij twijfel om contact op te nemen met een professionele hulpverlener.

Je tone of voice is empathisch, positief, deskundig en menselijk.
            `.trim(),
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
  console.log(`🟢 Aivie backend draait live op poort ${PORT}`);
});
