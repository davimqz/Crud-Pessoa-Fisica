const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const pessoaRoutes = require('./routes/pessoa');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api', pessoaRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});