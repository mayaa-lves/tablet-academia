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

        function atualizarRelogio() {
            document.getElementById('relogio').innerText = new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
        }
        setInterval(atualizarRelogio, 1000);
        atualizarRelogio();

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
        // Tamanho base responsivo (usando classes Tailwind ou estilo direto)
        el.style.fontSize = window.innerWidth < 640 ? "1.2rem" : "2.25rem";
    } else {
        el.classList.remove('opacity-10');
        let v = cpfAtual;
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        el.innerText = v;
        
        // Ajuste dinâmico para caber na linha
        if(window.innerWidth < 640) {
            el.style.fontSize = cpfAtual.length > 9 ? "1.1rem" : "1.2rem";
        } else {
            el.style.fontSize = cpfAtual.length > 9 ? "1.8rem" : "2.25rem";
        }
    }
}

// Adicione este listener para ajustar se o utilizador rodar o telemóvel
window.addEventListener('resize', renderCPF);

        function limparTudo(s = false) {
            if(s) somClique();
            cpfAtual = "";
            renderCPF();
        }

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
                    document.getElementById('iconBox').innerHTML = "✅";
                    document.getElementById('msgResposta').innerText = "BOM TREINO";
                    document.getElementById('msgResposta').className = "text-emerald-400 text-6xl font-black italic mb-4";
                    document.getElementById('subMsg').innerHTML = `Olá, <b>${dados.nome}</b>! Entrada liberada.`;
                } else {
                    somErro();
                    document.getElementById('iconBox').innerHTML = "🚫";
                    document.getElementById('msgResposta').innerText = "ACESSO NEGADO";
                    document.getElementById('msgResposta').className = "text-red-500 text-6xl font-black italic mb-4";
                    document.getElementById('subMsg').innerText = dados.mensagem || "Verifique sua mensalidade.";
                }
            } catch (e) {
                alert("Erro de conexão.");
            } finally {
                btn.innerText = "OK";
                btn.disabled = false;
                setTimeout(() => {
                    tela.classList.replace('flex', 'hidden');
                    area.classList.replace('hidden', 'flex');
                    limparTudo();
                }, 4000);
            }
        }

        function simularDigital() {
            somClique();
            alert("Iniciando escaneamento biométrico... (Conecte o leitor USB)");
        }