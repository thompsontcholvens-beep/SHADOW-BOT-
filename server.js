// server.js
const express = require('express');
const path = require('path');
const app = express();

// Port du serveur
const PORT = process.env.PORT || 3000;

// Middleware pour parser le body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Fichiers statiques (comme index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Route API pour générer un code
app.post('/generate', (req, res) => {
  const numero = req.body.numero;

  if (!numero) {
    return res.status(400).json({ error: 'Numéro requis' });
  }

  const code = "NIGHTSHA-" + Math.floor(1000 + Math.random() * 9000);
  return res.json({ code });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
