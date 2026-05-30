require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const Groq    = require('groq-sdk');

const app    = express();
const PORT   = process.env.PORT || 3000;
const MODEL  = 'llama-3.3-70b-versatile';
const groq   = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

// Archivos estáticos del asistente (public/)
app.use(express.static(path.join(__dirname, 'public')));

// Archivos estáticos de la raíz (script.js, style.css, etc.)
app.use(express.static(path.join(__dirname)));

// ── Página principal ──────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pagina_web.html'));
});

// ── API de chat ───────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { messages, system } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'El campo "messages" es requerido.' });
  }

  try {
    const groqMessages = [];
    if (system && system.trim()) {
      groqMessages.push({ role: 'system', content: system.trim() });
    }
    messages.forEach(m => groqMessages.push(m));

    const completion = await groq.chat.completions.create({
      model: MODEL,
      max_tokens: 1024,
      temperature: 0.7,
      messages: groqMessages
    });

    const reply = completion.choices?.[0]?.message?.content || '';
    res.json({ reply });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Error interno: ' + err.message });
  }
});

// ── Status ────────────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', model: MODEL, provider: 'Groq' });
});

// ── Fallback → index.html del asistente ──────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 Endpoint chat: POST http://localhost:${PORT}/api/chat`);
  console.log(`🤖 Modelo: ${MODEL} (Groq)`);
  console.log(`🔑 API Key cargada: ${process.env.GROQ_API_KEY ? 'SÍ ✓' : 'NO ✗ — revisa tu .env'}\n`);
});
