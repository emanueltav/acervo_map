"use strict";
var livros = new Map();
var form = document.getElementById('form-livro');
var inputTitulo = document.getElementById('titulo');
var inputAutor = document.getElementById('autor');
var inputAno = document.getElementById('ano');
var ulResultado = document.getElementById('resultado');
var inputBusca = document.getElementById('busca');
var btnVoltar = document.getElementById('btn-voltar');
var mensagemErro = document.getElementById('mensagem-erro');
var modal = document.getElementById('modal-overlay');
var spanTitulo = document.getElementById('livro-a-remover');
var btnSim = document.getElementById('btn-sim');
var btnNao = document.getElementById('btn-nao');
var tituloParaRemover = null;
function salvarLivros() {
    localStorage.setItem('acervoLivros', JSON.stringify(Array.from(livros.entries())));
}
function carregarLivros() {
    var dadosSalvos = localStorage.getItem('acervoLivros');
    if (dadosSalvos) {
        var livrosArray = JSON.parse(dadosSalvos);
        livrosArray.forEach(function (_a) {
            var key = _a[0], value = _a[1];
            livros.set(key, value);
        });
    }
    listarLivros();
}
function exibirMensagem(texto, tipo) {
    if (tipo === void 0) { tipo = 'info'; }
    mensagemErro.textContent = texto;
    mensagemErro.className = "mensagem ".concat(tipo);
    mensagemErro.classList.remove('hidden');
    setTimeout(function () {
        mensagemErro.classList.add('hidden');
        mensagemErro.textContent = '';
    }, 3000);
}
form.addEventListener('submit', function (e) {
    e.preventDefault();
    var titulo = inputTitulo.value.trim();
    var autor = inputAutor.value.trim();
    var ano = parseInt(inputAno.value.trim());
    if (!titulo || !autor || isNaN(ano) || ano <= 0) {
        exibirMensagem("Por favor, preencha todos os campos corretamente (Título, Autor e Ano válidos).", 'erro');
        return;
    }
    if (livros.has(titulo)) {
        exibirMensagem("O livro \"".concat(titulo, "\" j\u00E1 est\u00E1 no cat\u00E1logo!"), 'erro');
        return;
    }
    livros.set(titulo, { titulo: titulo, autor: autor, ano: ano });
    salvarLivros();
    form.reset();
    listarLivros();
    btnVoltar.classList.add('hidden');
    exibirMensagem("Livro \"".concat(titulo, "\" adicionado com sucesso!"), 'sucesso');
});
function buscarLivro() {
    var titulo = inputBusca.value.trim();
    if (!titulo) {
        exibirMensagem("Por favor, digite um título para buscar.", 'info');
        listarLivros();
        return;
    }
    var livro = livros.get(titulo);
    ulResultado.innerHTML = '';
    if (!livro) {
        ulResultado.innerHTML = "<li>Livro \"".concat(titulo, "\" n\u00E3o encontrado.</li>");
        btnVoltar.classList.remove('hidden');
        exibirMensagem("Livro \"".concat(titulo, "\" n\u00E3o encontrado."), 'info');
        return;
    }
    var li = document.createElement('li');
    li.innerHTML = "\n    <div class=\"info-livro\">\n      <strong>".concat(livro.titulo, "</strong>\n      <span>Autor: ").concat(livro.autor, "</span>\n      <span>Ano: ").concat(livro.ano, "</span>\n    </div>\n    <button type=\"button\" onclick=\"removerLivro('").concat(livro.titulo, "')\" class=\"btn vermelho\">Remover</button>\n  ");
    ulResultado.appendChild(li);
    btnVoltar.classList.remove('hidden');
}
function voltarLista() {
    inputBusca.value = '';
    listarLivros();
    btnVoltar.classList.add('hidden');
}
function listarLivros() {
    ulResultado.innerHTML = '';
    if (livros.size === 0) {
        ulResultado.innerHTML = "<li>Nenhum livro cadastrado.</li>";
        return;
    }
    livros.forEach(function (l) {
        var li = document.createElement('li');
        li.innerHTML = "\n      <div class=\"info-livro\">\n        <strong>".concat(l.titulo, "</strong>\n        <span>Autor: ").concat(l.autor, "</span>\n        <span>Ano: ").concat(l.ano, "</span>\n      </div>\n      <button type=\"button\" onclick=\"removerLivro('").concat(l.titulo, "')\" class=\"btn vermelho\">Remover</button>\n    ");
        ulResultado.appendChild(li);
    });
    btnVoltar.classList.add('hidden');
}
function removerLivro(titulo) {
    tituloParaRemover = titulo;
    spanTitulo.textContent = titulo;
    modal.classList.remove('hidden');
}
btnSim.addEventListener('click', function () {
    if (tituloParaRemover) {
        livros.delete(tituloParaRemover);
        salvarLivros();
        listarLivros();
        exibirMensagem("Livro \"".concat(tituloParaRemover, "\" removido com sucesso!"), 'sucesso');
        tituloParaRemover = null;
    }
    modal.classList.add('hidden');
});
btnNao.addEventListener('click', function () {
    tituloParaRemover = null;
    modal.classList.add('hidden');
});
document.addEventListener('DOMContentLoaded', carregarLivros);
window.buscarLivro = buscarLivro;
window.removerLivro = removerLivro;
window.voltarLista = voltarLista;
