let cpfAtual = "";
const API_BASE_URL = 'https://backend-mu-gold-36.vercel.app'; 

// SONS
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function som(f, d, v) {
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.frequency.setValueAtTime(f, audioCtx.currentTime);
    g.gain.setValueAtTime(v, audioCtx.currentTime);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + d);
}

const somClique = () => som(600, 0.1, 0.05);
const somSucesso = () => { som(800, 0.2, 0.1); setTimeout(() => som(1100, 0.2, 0.1), 150); };
const somErro = () => som(150, 0.4, 0.2);

// RELÓGIO
function atualizarRelogio() {
    const el = document.getElementById('relogio');
    if(el) el.innerText = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// LÓGICA CPF
function add(n) {
    if (cpfAtual.length < 11) {
        somClique();
        cpfAtual += n;
        renderCPF();
    }
}

function backspace() {
    if(cpfAtual.length > 0) somClique();
    cpfAtual = cpfAtual.slice(0, -1);
    renderCPF();
}

function renderCPF() {
    const el = document.getElementById('cpfText');
    document.getElementById('contador').innerText = `${cpfAtual.length} / 11`;
    
    if (cpfAtual.length === 0) {
        el.innerText = "000.000.000-00";
        el.classList.add('opacity-10');
        el.style.fontSize = window.innerWidth < 640 ? "1.2rem" : "2.25rem";
    } else {
        el.classList.remove('opacity-10');
        let v = cpfAtual;
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        el.innerText = v;
        
        if(window.innerWidth < 640) {
            el.style.fontSize = cpfAtual.length > 9 ? "1.1rem" : "1.2rem";
        } else {
            el.style.fontSize = cpfAtual.length > 9 ? "1.8rem" : "2.25rem";
        }
    }
}

function limparTudo(s = false) {
    if(s) somClique();
    cpfAtual = "";
    renderCPF();
}

// NOTIFICAÇÃO DE ERRO CUSTOMIZADA
function mostrarAvisoServidor() {
    const toast = document.getElementById('errorToast');
    somErro();
    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-[-20px]');
    toast.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-[-20px]');
    }, 4000);
}

// VERIFICAÇÃO DE ACESSO
async function verificarAcesso() {
    if (cpfAtual.length < 11) { somErro(); return; }

    const btn = document.getElementById('btnOk');
    const area = document.getElementById('areaDigitacao');
    const tela = document.getElementById('telaResposta');
    
    btn.innerText = "...";
    btn.disabled = true;

    try {
        const res = await fetch(`${API_BASE_URL}/catraca`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf: cpfAtual })
        });
        const dados = await res.json();
        
        area.classList.replace('flex', 'hidden');
        tela.classList.replace('hidden', 'flex');

        if (res.ok && (dados.status === "ATIVO" || dados.status === true)) {
            somSucesso();
            tela.className = "absolute inset-0 z-50 p-6 lg:p-20 flex flex-col items-center justify-center text-center bg-sucesso animate__animated animate__fadeIn";
            document.getElementById('iconBox').innerHTML = "🚀";
            document.getElementById('msgResposta').innerText = "BOM TREINO";
            document.getElementById('msgResposta').className = "text-white text-5xl lg:text-7xl font-black italic mb-4 drop-shadow-lg uppercase";
            document.getElementById('subMsg').innerHTML = `Bem-vindo, <br><span class="font-bold text-yellow-400 text-2xl lg:text-4xl">${dados.nome}</span>`;
        } else {
            somErro();
            tela.className = "absolute inset-0 z-50 p-6 lg:p-20 flex flex-col items-center justify-center text-center bg-erro animate__animated animate__fadeIn";
            document.getElementById('iconBox').innerHTML = "⚠️";
            document.getElementById('msgResposta').innerText = "BLOQUEADO";
            document.getElementById('msgResposta').className = "text-white text-5xl lg:text-7xl font-black italic mb-4 drop-shadow-lg uppercase";
            document.getElementById('subMsg').innerText = dados.mensagem || "Procure a recepção.";
        }

        setTimeout(() => {
            tela.classList.add('animate__fadeOut');
            setTimeout(() => {
                tela.classList.replace('flex', 'hidden');
                tela.classList.remove('animate__fadeOut');
                area.classList.replace('hidden', 'flex');
                limparTudo();
            }, 500);
        }, 4000);

    } catch (e) {
        mostrarAvisoServidor();
    } finally {
        btn.innerText = "OK";
        btn.disabled = false;
    }
}

function simularDigital() {
    somClique();
    mostrarAvisoServidor(); // Usando o aviso para simular a falta de leitor
}

window.addEventListener('resize', renderCPF);