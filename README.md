# 🏋️‍♂️ Puxa Ferro - Sistema de Acesso Premium

![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-emerald)
![Tech](https://img.shields.io/badge/Tech-Tailwind%20CSS-blue)
![Tech](https://img.shields.io/badge/Tech-JavaScript-yellow)
![UI](https://img.shields.io/badge/UI-Glassmorphism-purple)

O **Puxa Ferro** é uma interface de totem (Kiosk) de última geração desenvolvida para o controlo de acessos em ginásios. O projeto combina uma estética visual de alto impacto com uma usabilidade focada na agilidade do atleta.

---

## ✨ Características Principais

* **💎 Design Glassmorphism**: Interface ultra-moderna com efeitos de desfoque de fundo (`backdrop-filter`) e profundidade visual.
* **🔢 Teclado Numérico Inteligente**:
    * **Feedback Visual**: Brilho dinâmico (*glow*) ao digitar.
    * **Backspace Localizado**: Permite corrigir o último dígito inserido sem perder toda a digitação.
    * **Formatação Automática**: Máscara de CPF aplicada em tempo real (`000.000.000-00`).
* **⚡ Resposta Instantânea**: Ecrã de status (*Overlay*) em tamanho real para validação imediata (Liberado/Negado).
* **🕰️ Relógio Digital**: Sistema de hora em tempo real para monitorização do fluxo de entrada.
* **🔐 Segurança e UX**: Bloqueio de múltiplas tentativas durante o carregamento e limpeza automática do ecrã após a resposta.

---

## 🛠️ Tecnologias Utilizadas

* [Tailwind CSS](https://tailwindcss.com/) - Estilização moderna via classes utilitárias.
* **JavaScript (Vanilla)** - Lógica de manipulação de DOM, máscaras de input e chamadas assíncronas.
* [Font Awesome](https://fontawesome.com/) - Iconografia premium (Digital, Backspace, etc).
* **Google Fonts** - Tipografia *Plus Jakarta Sans* para máxima legibilidade.

---

## 🚀 Como Utilizar

1.  **Clone o repositório**:
    ```bash
    git clone [https://github.com/teu-utilizador/puxa-ferro-acesso.git](https://github.com/teu-utilizador/puxa-ferro-acesso.git)
    ```
2.  **Abra o projeto**:
    Basta abrir o ficheiro `index.html` em qualquer navegador moderno (Chrome, Edge, Safari ou Firefox).
3.  **Configuração de API**:
    A lógica de comunicação encontra-se no final do ficheiro HTML. Altere a variável `API_BASE_URL` se desejar apontar para um novo servidor.

---

## 🔌 Estrutura de Integração (API)

O sistema comunica com o backend através do método `POST`.

**Endpoint:** `https://backend-mu-gold-36.app.vercel.app/catraca`

**Exemplo de Payload:**
```json
{
  "cpf": "12345678901"
}