type Livro = {
  titulo: string;
  autor: string;
  ano: number;
};

const livros = new Map<string, Livro>();

const form = document.getElementById('form-livro') as HTMLFormElement;
const inputTitulo = document.getElementById('titulo') as HTMLInputElement;
const inputAutor = document.getElementById('autor') as HTMLInputElement;
const inputAno = document.getElementById('ano') as HTMLInputElement;
const ulResultado = document.getElementById('resultado') as HTMLUListElement;
const inputBusca = document.getElementById('busca') as HTMLInputElement;
const btnVoltar = document.getElementById('btn-voltar') as HTMLButtonElement;
const mensagemErro = document.getElementById('mensagem-erro') as HTMLDivElement;

const modal = document.getElementById('modal-overlay') as HTMLDivElement;
const spanTitulo = document.getElementById('livro-a-remover') as HTMLSpanElement;
const btnSim = document.getElementById('btn-sim') as HTMLButtonElement;
const btnNao = document.getElementById('btn-nao') as HTMLButtonElement;

let tituloParaRemover: string | null = null;

function salvarLivros(): void {
  localStorage.setItem('acervoLivros', JSON.stringify(Array.from(livros.entries())));
}

function carregarLivros(): void {
  const dadosSalvos = localStorage.getItem('acervoLivros');
  if (dadosSalvos) {
    const livrosArray = JSON.parse(dadosSalvos);
    livrosArray.forEach(([key, value]: [string, Livro]) => {
      livros.set(key, value);
    });
  }
  listarLivros();
}

function exibirMensagem(texto: string, tipo: 'erro' | 'sucesso' | 'info' = 'info'): void {
  mensagemErro.textContent = texto;
  mensagemErro.className = `mensagem ${tipo}`;
  mensagemErro.classList.remove('hidden');
  setTimeout(() => {
    mensagemErro.classList.add('hidden');
    mensagemErro.textContent = '';
  }, 3000);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const titulo = inputTitulo.value.trim();
  const autor = inputAutor.value.trim();
  const ano = parseInt(inputAno.value.trim());

  if (!titulo || !autor || isNaN(ano) || ano <= 0) {
    exibirMensagem("Por favor, preencha todos os campos corretamente (Título, Autor e Ano válidos).", 'erro');
    return;
  }

  if (livros.has(titulo)) {
    exibirMensagem(`O livro "${titulo}" já está no catálogo!`, 'erro');
    return;
  }

  livros.set(titulo, { titulo, autor, ano });
  salvarLivros();
  form.reset();
  listarLivros();
  btnVoltar.classList.add('hidden');
  exibirMensagem(`Livro "${titulo}" adicionado com sucesso!`, 'sucesso');
});

function buscarLivro(): void {
  const titulo = inputBusca.value.trim();
  if (!titulo) {
    exibirMensagem("Por favor, digite um título para buscar.", 'info');
    listarLivros();
    return;
  }

  const livro = livros.get(titulo);

  ulResultado.innerHTML = '';

  if (!livro) {
    ulResultado.innerHTML = `<li>Livro "${titulo}" não encontrado.</li>`;
    btnVoltar.classList.remove('hidden');
    exibirMensagem(`Livro "${titulo}" não encontrado.`, 'info');
    return;
  }

  const li = document.createElement('li');
  li.innerHTML = `
    <div class="info-livro">
      <strong>${livro.titulo}</strong>
      <span>Autor: ${livro.autor}</span>
      <span>Ano: ${livro.ano}</span>
    </div>
    <button type="button" onclick="removerLivro('${livro.titulo}')" class="btn vermelho">Remover</button>
  `;
  ulResultado.appendChild(li);

  btnVoltar.classList.remove('hidden');
}

function voltarLista(): void {
  inputBusca.value = '';
  listarLivros();
  btnVoltar.classList.add('hidden');
}

function listarLivros(): void {
  ulResultado.innerHTML = '';

  if (livros.size === 0) {
    ulResultado.innerHTML = `<li>Nenhum livro cadastrado.</li>`;
    return;
  }

  livros.forEach((l) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="info-livro">
        <strong>${l.titulo}</strong>
        <span>Autor: ${l.autor}</span>
        <span>Ano: ${l.ano}</span>
      </div>
      <button type="button" onclick="removerLivro('${l.titulo}')" class="btn vermelho">Remover</button>
    `;
    ulResultado.appendChild(li);
  });

  btnVoltar.classList.add('hidden');
}

function removerLivro(titulo: string): void {
  tituloParaRemover = titulo;
  spanTitulo.textContent = titulo;
  modal.classList.remove('hidden');
}

btnSim.addEventListener('click', () => {
  if (tituloParaRemover) {
    livros.delete(tituloParaRemover);
    salvarLivros();
    listarLivros();
    exibirMensagem(`Livro "${tituloParaRemover}" removido com sucesso!`, 'sucesso');
    tituloParaRemover = null;
  }
  modal.classList.add('hidden');
});

btnNao.addEventListener('click', () => {
  tituloParaRemover = null;
  modal.classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', carregarLivros);

(window as any).buscarLivro = buscarLivro;
(window as any).removerLivro = removerLivro;
(window as any).voltarLista = voltarLista;