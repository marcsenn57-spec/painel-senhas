import { initializeApp } from "https://www.gstatic.com";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com";

// 2. CONFIGURAÇÃO DO SEU FIREBASE
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

// 3. ESCUTAR MUDANÇAS (Para a TV atualizar)
onValue(ref(db, 'atendimento'), (snapshot) => {
    const dados = snapshot.val();
    if (dados) {
        document.getElementById('senha-atual').innerText = dados.senha;
        document.getElementById('sala-atual').innerText = dados.sala;
        
        if (window.ultimaSenhaChamada !== dados.senha) {
            falar(dados.senha, dados.sala);
            window.ultimaSenhaChamada = dados.senha;
        }
    }
});

// 4. FUNÇÃO PARA O CELULAR CHAMAR A PRÓXIMA (VINCULADA À WINDOW)
window.proximaSenha = function(prefixo) {
    const sala = document.getElementById('selecionar-sala').value;
    const contadorRef = ref(db, 'contadores/' + sala);
    
    get(contadorRef).then((snapshot) => {
        let num = snapshot.val() || 1;
        const novaSenha = prefixo + "-" + String(num).padStart(3, '0');
        
        // Atualiza o Firebase (TV vai mudar automaticamente pelo onValue acima)
        set(ref(db, 'atendimento'), { senha: novaSenha, sala: sala });
        set(ref(db, 'contadores/' + sala), num + 1);
    }).catch((error) => {
        console.error("Erro ao buscar contador:", error);
    });
};

function falar(senha, sala) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(`Senha ${senha.replace('-', ' ')}, Sala ${sala}`);
    msg.lang = 'pt-BR';
    window.speechSynthesis.speak(msg);
}
