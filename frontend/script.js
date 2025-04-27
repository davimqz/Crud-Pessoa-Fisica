const API_URL = 'http://localhost:3000/api/pessoas';

document.getElementById('pessoaForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const cpf = document.getElementById('cpf').value;
  const nome = document.getElementById('nome').value;
  const renda = parseFloat(document.getElementById('renda').value);
  const dataNascimento = document.getElementById('dataNascimento').value;

  if (!cpf || !nome || renda < 0 || !dataNascimento || new Date(dataNascimento) > new Date()) {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const pessoa = { cpf, nome, renda, data_nascimento: dataNascimento };

  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pessoa),
    });
    carregarPessoas();
  } catch (error) {
    console.error('Erro ao salvar pessoa:', error);
  }
});

async function carregarPessoas() {
  const tbody = document.querySelector('#pessoasTable tbody');
  tbody.innerHTML = '';

  try {
    const response = await fetch(API_URL);
    const pessoas = await response.json();

    pessoas.forEach((pessoa) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${pessoa.cpf}</td>
        <td>${pessoa.nome}</td>
        <td>${pessoa.renda}</td>
        <td>${pessoa.data_nascimento}</td>
        <td>
          <button onclick="removerPessoa('${pessoa.cpf}')">Remover</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error('Erro ao carregar pessoas:', error);
  }
}

async function removerPessoa(cpf) {
  try {
    await fetch(`${API_URL}/${cpf}`, { method: 'DELETE' });
    carregarPessoas();
  } catch (error) {
    console.error('Erro ao remover pessoa:', error);
  }
}


carregarPessoas();