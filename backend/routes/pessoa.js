const express = require('express');
const router = express.Router();
const db = require('../database');


function validarCPF(cpf) {
  return /^\d{11}$/.test(cpf); 
}


router.get('/pessoas', (req, res) => {
  db.all('SELECT * FROM pessoa', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar pessoas.' });
    res.json(rows);
  });
});


router.post('/pessoas', (req, res) => {
  const { cpf, nome, renda, data_nascimento } = req.body;

  if (!cpf || !nome || renda === undefined || !data_nascimento) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
  if (!validarCPF(cpf)) {
    return res.status(400).json({ error: 'CPF inválido. Deve conter 11 dígitos numéricos.' });
  }
  if (renda < 0) {
    return res.status(400).json({ error: 'A renda deve ser maior ou igual a zero.' });
  }
  if (new Date(data_nascimento) > new Date()) {
    return res.status(400).json({ error: 'A data de nascimento não pode ser no futuro.' });
  }


  db.get('SELECT * FROM pessoa WHERE cpf = ?', [cpf], (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro ao verificar duplicidade de CPF.' });
    if (row) return res.status(400).json({ error: 'CPF já cadastrado.' });


    db.run(
      `INSERT INTO pessoa (cpf, nome, renda, data_nascimento) VALUES (?, ?, ?, ?)`,
      [cpf, nome, renda, data_nascimento],
      (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar pessoa.' });
        res.status(201).json({ message: 'Pessoa criada com sucesso!' });
      }
    );
  });
});


router.put('/pessoas/:cpf', (req, res) => {
  const { cpf } = req.params;
  const { nome, renda, data_nascimento } = req.body;


  if (!nome || renda === undefined || !data_nascimento) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }
  if (renda < 0) {
    return res.status(400).json({ error: 'A renda deve ser maior ou igual a zero.' });
  }
  if (new Date(data_nascimento) > new Date()) {
    return res.status(400).json({ error: 'A data de nascimento não pode ser no futuro.' });
  }

  db.run(
    `UPDATE pessoa SET nome = ?, renda = ?, data_nascimento = ? WHERE cpf = ?`,
    [nome, renda, data_nascimento, cpf],
    function (err) {
      if (err) return res.status(500).json({ error: 'Erro ao atualizar pessoa.' });
      if (this.changes === 0) return res.status(404).json({ error: 'Pessoa não encontrada.' });
      res.json({ message: 'Pessoa atualizada com sucesso!' });
    }
  );
});


router.delete('/pessoas/:cpf', (req, res) => {
  const { cpf } = req.params;

  db.run(`DELETE FROM pessoa WHERE cpf = ?`, [cpf], function (err) {
    if (err) return res.status(500).json({ error: 'Erro ao remover pessoa.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Pessoa não encontrada.' });
    res.json({ message: 'Pessoa removida com sucesso!' });
  });
});

module.exports = router;