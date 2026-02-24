// 1. TENTA CARREGAR OS DADOS SALVOS; SE NÃO EXISTIREM, COMEÇA DO 1
let contadoresPorSala = JSON.parse(localStorage.getItem('contadoresSenhas')) || {
    "01": 1, "02": 1, "03": 1, "04": 1
};

// 2. ATUALIZA A TELA COM A ÚLTIMA SENHA SALVA AO ABRIR
window.onload = function() {
    const ultimaSala = localStorage.getItem('ultimaSala') || "--";
    const ultimaSenha = localStorage.getItem('ultimaSenha') || "000";
    document.getElementById('senha-atual').innerText = ultimaSenha;
    document.getElementById('sala-atual').innerText = ultimaSala;
};

function proximaSenha(prefixo) {
    const salaSelecionada = document.getElementById('selecionar-sala').value;
    
    // Pega o número atual daquela sala específica
    const numeroAtual = contadoresPorSala[salaSelecionada];
    
    // Formata a senha (ex: A-001)
    const novaSenha = prefixo + "-" + String(numeroAtual).padStart(3, '0');
    
    // Atualiza o painel visual
    document.getElementById('senha-atual').innerText = novaSenha;
    document.getElementById('sala-atual').innerText = salaSelecionada;
    
    // Chama a voz
    falar(novaSenha, salaSelecionada);
    
    // SOMA +1 e SALVA no "banco de dados" do navegador
    contadoresPorSala[salaSelecionada]++;
    localStorage.setItem('contadoresSenhas', JSON.stringify(contadoresPorSala));
    localStorage.setItem('ultimaSenha', novaSenha);
    localStorage.setItem('ultimaSala', salaSelecionada);
}

function falar(senha, sala) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(`Senha ${senha.replace('-', ' ')}, Sala ${sala}`);
    msg.lang = 'pt-BR';
    window.speechSynthesis.speak(msg);
}

// FUNÇÃO EXTRA: Se quiser zerar tudo, digite limparTudo() no console ou crie um botão
function limparTudo() {
    localStorage.clear();
    location.reload();
}
