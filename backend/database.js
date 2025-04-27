const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./pessoa.db');


db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS pessoa (
      cpf TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      renda REAL NOT NULL CHECK (renda >= 0),
      data_nascimento TEXT NOT NULL
    )
  `);
});

module.exports = db;