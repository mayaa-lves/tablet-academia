const API_BASE_URL = 'https://backend-mu-gold-36.vercel.app';

async function verificarAcesso() {
    const cpfInput = document.getElementById('cpfInput');
    const areaDigitacao = document.getElementById('areaDigitacao');
    const telaResposta = document.getElementById('telaResposta');
    
    const icone = document.getElementById('iconBox');
    const msg = document.getElementById('msgResposta');
    const sub = document.getElementById('subMsg');

    const cpfValor = cpfInput.value.trim();

    if (cpfValor.length < 11) {
        alert("Por favor, digite o CPF completo.");
        return;
    }

    // Feedback visual de carregamento
    const btn = document.querySelector('button');
    btn.innerText = "VERIFICANDO...";
    btn.disabled = true;

    try {
        const resposta = await fetch(`${API_BASE_URL}/catraca`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf: cpfValor })
        });

        const dados = await resposta.json();

        // Alterna as telas
        areaDigitacao.classList.add('hidden');
        telaResposta.classList.remove('hidden');

        if (resposta.ok) {
            // Se status for ATIVO (texto) ou true (booleano)
            if (dados.status === "ATIVO" || dados.status === true) {
                icone.innerHTML = "✅";
                msg.innerText = "BOM TREINO!";
                msg.className = "text-emerald-400 text-4xl font-black italic";
                sub.innerText = `Olá, ${dados.nome}! Entrada liberada.`;
            } else {
                icone.innerHTML = "🚫";
                msg.innerText = "BLOQUEADO";
                msg.className = "text-amber-500 text-4xl font-black italic";
                sub.innerText = "Sua mensalidade está pendente.";
            }
        } else {
            icone.innerHTML = "❌";
            msg.innerText = "ERRO";
            msg.className = "text-red-500 text-4xl font-black italic";
            sub.innerText = dados.mensagem || "CPF não encontrado.";
        }

    } catch (error) {
        alert("Erro ao conectar com o servidor.");
        console.error(error);
    } finally {
        // Restaura o botão
        btn.innerText = "CONFIRMAR ENTRADA";
        btn.disabled = false;

        // Reset automático após 4 segundos
        setTimeout(() => {
            telaResposta.classList.add('hidden');
            areaDigitacao.classList.remove('hidden');
            cpfInput.value = "";
        }, 4000);
    }
}