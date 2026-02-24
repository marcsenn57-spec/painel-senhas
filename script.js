// Importe o Firebase (adicione estas linhas no topo do script.js)
import { initializeApp } from "https://www.gstatic.com";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com";


// O restante do seu código (firebaseConfig, etc) continua igual abaixo...


// COLE AQUI O SEU firebaseConfig QUE VOCÊ COPIOU DO SITE
const firebaseConfig = {
  apiKey: "AIzaSyAni301REp5IfvRTxxHLxCFWkdPr8Qrt68",
  authDomain: "painel-de-senhas-23.firebaseapp.com",
  databaseURL: "https://painel-de-senhas-23-default-rtdb.firebaseio.com",
  projectId: "painel-de-senhas-23",
  storageBucket: "painel-de-senhas-23.firebasestorage.app",
  messagingSenderId: "372393973523",
  appId: "1:372393973523:web:8eed63206449df4b9a2ce6",
  measurementId: "G-CKCYH7SWTC"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ESCUTAR MUDANÇAS (Para a TV atualizar quando o celular mandar)
onValue(ref(db, 'atendimento'), (snapshot) => {
    const dados = snapshot.val();
    if (dados) {
        document.getElementById('senha-atual').innerText = dados.senha;
        document.getElementById('sala-atual').innerText = dados.sala;
        // Só fala se for uma senha nova (para não repetir ao abrir a página)
        if (window.ultimaSenhaChamada !== dados.senha) {
            falar(dados.senha, dados.sala);
            window.ultimaSenhaChamada = dados.senha;
        }
    }
});

// FUNÇÃO PARA O CELULAR CHAMAR A PRÓXIMA
window.proximaSenha = function(prefixo) {
    const sala = document.getElementById('selecionar-sala').value;
    
    // Pegar o último número do banco para somar +1
    onValue(ref(db, 'contadores/' + sala), (snapshot) => {
        let num = snapshot.val() || 1;
        const novaSenha = prefixo + "-" + String(num).padStart(3, '0');
        
        // Envia para o banco de dados (Isso faz a TV atualizar na hora!)
        set(ref(db, 'atendimento'), { senha: novaSenha, sala: sala });
        set(ref(db, 'contadores/' + sala), num + 1);
    }, { onlyOnce: true });
};

function falar(senha, sala) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(`Senha ${senha.replace('-', ' ')}, Sala ${sala}`);
    msg.lang = 'pt-BR';
    window.speechSynthesis.speak(msg);
}
