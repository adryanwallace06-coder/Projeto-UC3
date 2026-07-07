/* ==========================================================
   MEDICA+ - script.js (página Logado)
   ==========================================================
   1. Cards do topo (Picos de pressão) - valores aleatórios
   2. Dados de pressão para o gráfico
   3. Gráfico + filtro por período + badges
   4. Sobreposição (modal) de Perfil - com requisições simuladas
   5. Inicialização
   ========================================================== */


/* ==========================================================
   PARTE 1: CARDS DO TOPO (Picos de pressão aleatórios)
   ========================================================== */

function atualizarPicosDePressao() {
    const cardAlto = document.querySelector('.pico-alto');
    const cardBaixo = document.querySelector('.pico-baixo');

    const picoAlto = gerarPressaoAleatoria(140, 180, 90, 115);
    const picoBaixo = gerarPressaoAleatoria(60, 90, 40, 60);

    const dataAlto = gerarDataAleatoria(72);
    const dataBaixo = gerarDataAleatoria(72);

    preencherCard(cardAlto, picoAlto, dataAlto);
    preencherCard(cardBaixo, picoBaixo, dataBaixo);
}

function gerarPressaoAleatoria(sisMin, sisMax, diaMin, diaMax) {
    const sistolica = Math.floor(Math.random() * (sisMax - sisMin + 1)) + sisMin;
    const diastolica = Math.floor(Math.random() * (diaMax - diaMin + 1)) + diaMin;
    return { sistolica, diastolica };
}

function gerarDataAleatoria(horasMax) {
    const agora = new Date();
    const horasAtras = Math.floor(Math.random() * horasMax);
    const minutosAtras = Math.floor(Math.random() * 60);
    agora.setHours(agora.getHours() - horasAtras);
    agora.setMinutes(agora.getMinutes() - minutosAtras);
    return agora;
}

function preencherCard(elementoLi, pressao, data) {
    const spanData = elementoLi.querySelector('span');
    const valorTexto = elementoLi.querySelector('.valor');

    spanData.textContent = `📅 ${formatarDataCompleta(data)}`;
    valorTexto.textContent = `${pressao.sistolica}/${pressao.diastolica} mmHg`;

    valorTexto.classList.remove('atualizado');
    void valorTexto.offsetWidth;
    valorTexto.classList.add('atualizado');
}


/* ==========================================================
   PARTE 2: DADOS DE PRESSÃO PARA O GRÁFICO
   ========================================================== */

const dadosPressao = [
    { data: '2026-05-01T00:00', valor: 115 }, { data: '2026-05-01T12:00', valor: 118 },
    { data: '2026-05-02T00:00', valor: 112 }, { data: '2026-05-02T12:00', valor: 116 },
    { data: '2026-05-03T00:00', valor: 110 }, { data: '2026-05-03T12:00', valor: 114 },
    { data: '2026-05-04T00:00', valor: 117 }, { data: '2026-05-04T12:00', valor: 119 },

    { data: '2026-05-05T00:00', valor: 125 }, { data: '2026-05-05T12:00', valor: 135 },
    { data: '2026-05-06T00:00', valor: 148 }, { data: '2026-05-06T12:00', valor: 158 },
    { data: '2026-05-07T00:00', valor: 165 }, { data: '2026-05-07T12:00', valor: 150 },

    { data: '2026-05-08T00:00', valor: 130 }, { data: '2026-05-08T12:00', valor: 110 },
    { data: '2026-05-09T00:00', valor: 90 },  { data: '2026-05-09T12:00', valor: 75 },
    { data: '2026-05-10T00:00', valor: 65 },  { data: '2026-05-10T12:00', valor: 85 },

    { data: '2026-05-11T00:00', valor: 110 }, { data: '2026-05-11T12:00', valor: 116 },
    { data: '2026-05-12T00:00', valor: 118 }, { data: '2026-05-12T12:00', valor: 115 },
    { data: '2026-05-13T00:00', valor: 112 }, { data: '2026-05-13T12:00', valor: 117 },
    { data: '2026-05-14T00:00', valor: 119 }, { data: '2026-05-14T12:00', valor: 116 },

    { data: '2026-05-15T00:00', valor: 128 }, { data: '2026-05-15T12:00', valor: 140 },
    { data: '2026-05-16T00:00', valor: 155 }, { data: '2026-05-16T12:00', valor: 168 },
    { data: '2026-05-17T00:00', valor: 172 }, { data: '2026-05-17T12:00', valor: 150 },

    { data: '2026-05-18T00:00', valor: 130 }, { data: '2026-05-18T12:00', valor: 118 },
    { data: '2026-05-19T00:00', valor: 115 }, { data: '2026-05-19T12:00', valor: 117 },
    { data: '2026-05-20T00:00', valor: 114 }, { data: '2026-05-20T12:00', valor: 116 }
];


/* ==========================================================
   PARTE 3: GRÁFICO + FILTRO + BADGES
   ========================================================== */

let graficoPressao = null;

function corDoPonto(valor) {
    if (valor > 140) return '#e63946';
    if (valor < 90) return '#2d7ff9';
    return '#2e9e3f';
}

function filtrarPorPeriodo(dataInicio, dataFim) {
    return dadosPressao.filter(item => {
        const dataItem = new Date(item.data);
        return dataItem >= dataInicio && dataItem <= dataFim;
    });
}

function renderizarGrafico(dados) {
    const ctx = document.getElementById('pressaoChart');

    const labels = dados.map(item => formatarDataCurta(new Date(item.data)));
    const valores = dados.map(item => item.valor);
    const cores = dados.map(item => corDoPonto(item.valor));

    if (graficoPressao) {
        graficoPressao.destroy();
    }

    graficoPressao = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Pressão sistólica (mmHg)',
                data: valores,
                borderColor: '#2e9e3f',
                borderWidth: 2,
                pointBackgroundColor: cores,
                pointBorderColor: cores,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { title: { display: true, text: 'mmHg' } } }
        }
    });
}

function atualizarBadges(dados) {
    const listaBadges = document.querySelector('.badges');
    const statusFiltro = document.getElementById('statusFiltro');

    listaBadges.innerHTML = '';

    if (dados.length === 0) {
        statusFiltro.textContent = 'Nenhum registro encontrado nesse período.';
        return;
    }

    const picoAlto = dados.reduce((maior, atual) => atual.valor > maior.valor ? atual : maior, dados[0]);
    const picoBaixo = dados.reduce((menor, atual) => atual.valor < menor.valor ? atual : menor, dados[0]);

    const temPicoAlto = picoAlto.valor > 140;
    const temPicoBaixo = picoBaixo.valor < 90;

    if (temPicoAlto) listaBadges.appendChild(criarBadge(picoAlto, 'alto'));
    if (temPicoBaixo) listaBadges.appendChild(criarBadge(picoBaixo, 'baixo'));

    statusFiltro.textContent = (!temPicoAlto && !temPicoBaixo)
        ? 'Nesse período a pressão de Maria se manteve dentro da faixa normal 👍'
        : '';
}

function criarBadge(item, tipo) {
    const li = document.createElement('li');
    li.className = `badge badge-${tipo}`;

    const dataFormatada = formatarDataCompleta(new Date(item.data));
    const textoTag = tipo === 'alto' ? 'Pico de pressão alta' : 'Pico de pressão baixa';

    li.innerHTML = `
        <span>${dataFormatada}</span>
        <p>${textoTag}</p>
        <strong>${item.valor} mmHg</strong>
    `;

    return li;
}

function atualizarUltimaAtualizacao(dados) {
    const textoUltimaAtualizacao = document.querySelector('.filtro-info strong');
    if (dados.length === 0) {
        textoUltimaAtualizacao.textContent = '--';
        return;
    }
    const ultimoItem = dados[dados.length - 1];
    textoUltimaAtualizacao.textContent = formatarDataCompleta(new Date(ultimoItem.data));
}

function aplicarFiltro() {
    const inicioInput = document.getElementById('periodoInicio').value;
    const fimInput = document.getElementById('periodoFim').value;

    if (!inicioInput || !fimInput) return;

    const dataInicio = new Date(`${inicioInput}T00:00:00`);
    const dataFim = new Date(`${fimInput}T23:59:59`);

    const dadosFiltrados = filtrarPorPeriodo(dataInicio, dataFim);

    renderizarGrafico(dadosFiltrados);
    atualizarBadges(dadosFiltrados);
    atualizarUltimaAtualizacao(dadosFiltrados);
}


/* ==========================================================
   FUNÇÕES DE FORMATAÇÃO DE DATA
   ========================================================== */

function formatarDataCompleta(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const min = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
}

function formatarDataCurta(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const hora = String(data.getHours()).padStart(2, '0');
    return `${dia}/${mes} ${hora}:00`;
}


/* ==========================================================
   PARTE 4: SOBREPOSIÇÃO (MODAL) DE PERFIL
   ========================================================== */

/* --- "Banco de dados" falso, simulando o que viria do servidor --- */
let dadosUsuario = {
    nome: 'Adryan Ernandes',
    email: 'adryan@gmail.com',
    cpf: '123.456.789-00',
    telefone: '(11) 91234-5678',
    tipo: 'paciente',
    plano: 'Basic + Anual',
    foto: null // vai virar uma string base64 se o usuário enviar uma foto
};

/* --- Elementos da sobreposição --- */
const overlay = document.getElementById('perfilOverlay');
const overlayFundo = document.getElementById('perfilFundo');
const formPerfil = document.getElementById('formPerfil');
const btnSalvarPerfil = document.getElementById('btnSalvarPerfil');
const mensagemStatus = document.getElementById('mensagemStatus');

/**
 * SIMULA uma requisição GET, tipo "fetch('/api/perfil')".
 * Devolve uma Promise que resolve depois de um tempinho, como uma
 * chamada de rede de verdade faria. Quando vocês tiverem um back-end,
 * é só trocar o "setTimeout" por um fetch() de verdade aqui dentro,
 * sem precisar mudar o resto do código que usa essa função.
 */
function buscarPerfil() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(dadosUsuario);
        }, 500); // meio segundo, simulando a espera de uma rede
    });
}

/**
 * SIMULA uma requisição PUT/POST pra salvar os dados no servidor.
 */
function salvarPerfilNoServidor(dadosNovos) {
    return new Promise((resolve) => {
        setTimeout(() => {
            dadosUsuario = { ...dadosUsuario, ...dadosNovos };
            resolve(dadosUsuario);
        }, 900);
    });
}

/* --- Abrir a sobreposição --- */
async function abrirPerfil() {
    overlay.classList.add('aberto');
    overlay.setAttribute('aria-hidden', 'false');
    mensagemStatus.textContent = '';
    mensagemStatus.className = 'mensagem-status';

    // "await" pausa a função aqui até a Promise de buscarPerfil() terminar,
    // sem travar o resto da página - o usuário já vê o modal abrir na hora,
    // só o conteúdo demora um instantinho pra preencher.
    const perfil = await buscarPerfil();
    preencherFormulario(perfil);

    // move o foco pro primeiro campo, ajudando quem navega por teclado
    document.getElementById('campoNome').focus();
}

function preencherFormulario(perfil) {
    document.getElementById('campoNome').value = perfil.nome;
    document.getElementById('campoEmail').value = perfil.email;
    document.getElementById('campoCpf').value = perfil.cpf;
    document.getElementById('campoTelefone').value = perfil.telefone;
    document.getElementById('campoTipo').value = perfil.tipo;
    document.getElementById('campoPlano').textContent = perfil.plano;
    document.getElementById('fotoPreview').src = perfil.foto || '../../img logo/img logo.png';
}

/* --- Fechar a sobreposição --- */
function fecharPerfil() {
    overlay.classList.remove('aberto');
    overlay.setAttribute('aria-hidden', 'true');
    limparErros();
    document.getElementById('btnVerPerfil').focus(); // devolve o foco pra quem abriu o modal
}

/* --- Máscaras de CPF e telefone, aplicadas enquanto o usuário digita --- */
function aplicarMascaraCpf(evento) {
    let numeros = evento.target.value.replace(/\D/g, ''); // remove tudo que não é dígito
    numeros = numeros.slice(0, 11); // limita a 11 dígitos

    numeros = numeros.replace(/(\d{3})(\d)/, '$1.$2');
    numeros = numeros.replace(/(\d{3})(\d)/, '$1.$2');
    numeros = numeros.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    evento.target.value = numeros;
}

function aplicarMascaraTelefone(evento) {
    let numeros = evento.target.value.replace(/\D/g, '');
    numeros = numeros.slice(0, 11);

    numeros = numeros.replace(/(\d{2})(\d)/, '($1) $2');
    numeros = numeros.replace(/(\d{5})(\d{1,4})$/, '$1-$2');

    evento.target.value = numeros;
}

/* --- Pré-visualização da foto enviada --- */
function preverFoto(evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    // FileReader lê o arquivo escolhido no computador do usuário
    const leitor = new FileReader();

    leitor.onload = () => {
        // "leitor.result" é a imagem convertida em uma string base64,
        // que pode ser usada direto no atributo src de uma <img>
        document.getElementById('fotoPreview').src = leitor.result;
        dadosUsuario.foto = leitor.result;
    };

    leitor.readAsDataURL(arquivo);
}

/* --- Validação do formulário --- */
function validarFormulario() {
    limparErros();
    let valido = true;

    const nome = document.getElementById('campoNome').value.trim();
    const email = document.getElementById('campoEmail').value.trim();
    const cpf = document.getElementById('campoCpf').value.trim();
    const telefone = document.getElementById('campoTelefone').value.trim();

    if (nome.length < 3) {
        mostrarErro('campoNome', 'erroNome', 'Digite o nome completo.');
        valido = false;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
        mostrarErro('campoEmail', 'erroEmail', 'Digite um e-mail válido.');
        valido = false;
    }

    if (cpf.replace(/\D/g, '').length !== 11) {
        mostrarErro('campoCpf', 'erroCpf', 'CPF deve ter 11 números.');
        valido = false;
    }

    if (telefone.replace(/\D/g, '').length < 10) {
        mostrarErro('campoTelefone', 'erroTelefone', 'Telefone incompleto.');
        valido = false;
    }

    return valido;
}

function mostrarErro(idCampo, idErro, mensagem) {
    document.getElementById(idErro).textContent = mensagem;
    document.getElementById(idCampo).closest('.campo').classList.add('campo-invalido');
}

function limparErros() {
    document.querySelectorAll('.campo .erro').forEach(span => span.textContent = '');
    document.querySelectorAll('.campo-invalido').forEach(campo => campo.classList.remove('campo-invalido'));
}

/* --- Envio do formulário --- */
async function aoEnviarFormulario(evento) {
    evento.preventDefault(); // impede o comportamento padrão (recarregar a página)

    if (!validarFormulario()) {
        mensagemStatus.textContent = 'Verifique os campos destacados.';
        mensagemStatus.className = 'mensagem-status erro-geral';
        return;
    }

    const dadosNovos = {
        nome: document.getElementById('campoNome').value.trim(),
        email: document.getElementById('campoEmail').value.trim(),
        cpf: document.getElementById('campoCpf').value.trim(),
        telefone: document.getElementById('campoTelefone').value.trim(),
        tipo: document.getElementById('campoTipo').value
    };

    // Desabilita o botão e avisa que está salvando, pra o usuário não clicar 2x
    btnSalvarPerfil.disabled = true;
    btnSalvarPerfil.textContent = 'Salvando...';
    mensagemStatus.textContent = '';
    mensagemStatus.className = 'mensagem-status';

    try {
        const perfilAtualizado = await salvarPerfilNoServidor(dadosNovos);

        mensagemStatus.textContent = 'Perfil atualizado com sucesso!';
        mensagemStatus.className = 'mensagem-status sucesso';

        // Atualiza a saudação "Olá, Maria!" na página com o novo nome, ao vivo
        const primeiroNome = perfilAtualizado.nome.split(' ')[0];
        document.getElementById('saudacaoNome').textContent = `Olá, ${primeiroNome}! 👋`;

        // Fecha o modal automaticamente depois de mostrar a mensagem de sucesso
        setTimeout(fecharPerfil, 1200);

    } catch (erro) {
        mensagemStatus.textContent = erro.message;
        mensagemStatus.className = 'mensagem-status erro-geral';
    } finally {
        btnSalvarPerfil.disabled = false;
        btnSalvarPerfil.textContent = 'Salvar alterações';
    }
}

/* --- Liga todos os eventos da sobreposição --- */
function iniciarPerfil() {
    document.getElementById('btnVerPerfil').addEventListener('click', abrirPerfil);
    document.getElementById('linkPerfilNav').addEventListener('click', (e) => {
        e.preventDefault();
        abrirPerfil();
    });

    document.getElementById('btnFecharPerfil').addEventListener('click', fecharPerfil);
    document.getElementById('btnCancelarPerfil').addEventListener('click', fecharPerfil);
    overlayFundo.addEventListener('click', fecharPerfil);

    // Fecha com a tecla Esc, só se o modal estiver aberto
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('aberto')) {
            fecharPerfil();
        }
    });

    document.getElementById('campoCpf').addEventListener('input', aplicarMascaraCpf);
    document.getElementById('campoTelefone').addEventListener('input', aplicarMascaraTelefone);
    document.getElementById('inputFoto').addEventListener('change', preverFoto);

    formPerfil.addEventListener('submit', aoEnviarFormulario);
}


/* ==========================================================
   PARTE 6: CONTATOS (abas + lista + adicionar/remover)
   ========================================================== */

/* "Banco de dados" falso dos contatos - cada um tem um id único */
let listaContatos = [
    { id: 1, nome: 'Ana (Filha)', telefone: '(11) 91234-5678', tipo: 'familiar' },
    { id: 2, nome: 'Carlos', telefone: '(11) 99876-5432', tipo: 'cuidador' }
];

let proximoIdContato = 3; // usado pra dar um id novo a cada contato adicionado

/* --- Alternar entre as abas "Meus contatos" / "Adicionar contato" --- */
function iniciarAbasContatos() {
    const abas = document.querySelectorAll('.contatos-abas .aba');

    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            // desmarca todas as abas e esconde todos os painéis
            abas.forEach(a => a.setAttribute('aria-selected', 'false'));
            document.querySelectorAll('.contatos-painel').forEach(painel => painel.hidden = true);

            // marca só a aba clicada e mostra o painel correspondente a ela
            aba.setAttribute('aria-selected', 'true');
            const idPainel = aba.getAttribute('aria-controls');
            document.getElementById(idPainel).hidden = false;
        });
    });
}

/* --- Simulações de requisição, no mesmo padrão do perfil --- */
function buscarContatos() {
    return new Promise(resolve => {
        setTimeout(() => resolve(listaContatos), 400);
    });
}

function salvarContatoNoServidor(contato) {
    return new Promise(resolve => {
        setTimeout(() => {
            const novoContato = { id: proximoIdContato++, ...contato };
            listaContatos.push(novoContato);
            resolve(novoContato);
        }, 700);
    });
}

function removerContatoNoServidor(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            listaContatos = listaContatos.filter(c => c.id !== id);
            resolve();
        }, 400);
    });
}

/* --- Renderiza a lista de contatos na tela --- */
function renderizarContatos(contatos) {
    const lista = document.getElementById('listaContatosCompleta');
    lista.innerHTML = '';

    if (contatos.length === 0) {
        lista.innerHTML = '<li class="mensagem-vazio">Você ainda não tem contatos cadastrados.</li>';
        return;
    }

    contatos.forEach(contato => {
        const li = document.createElement('li');
        li.className = 'contato-item';

        li.innerHTML = `
            <div class="contato-info">
                <strong>${contato.nome}</strong>
                <span>${contato.telefone}</span>
            </div>
            <span class="contato-tipo">${contato.tipo}</span>
            <button type="button" class="btn-remover-contato" data-id="${contato.id}">Remover</button>
        `;

        lista.appendChild(li);
    });
}

async function carregarContatos() {
    const contatos = await buscarContatos();
    renderizarContatos(contatos);
}

/* --- Clique no botão "Remover" (delegação de evento) ---
   Como os botões são criados dinamicamente pelo renderizarContatos(),
   não podemos usar addEventListener neles diretamente (eles ainda nem
   existem quando a página carrega). Em vez disso, "escutamos" o clique
   na lista inteira, e verificamos se quem foi clicado foi um botão .btn-remover-contato. */
function iniciarRemocaoContatos() {
    document.getElementById('listaContatosCompleta').addEventListener('click', async (evento) => {
        const botao = evento.target.closest('.btn-remover-contato');
        if (!botao) return; // clicou em outra parte da lista, ignora

        const id = Number(botao.dataset.id);
        botao.disabled = true;
        botao.textContent = 'Removendo...';

        await removerContatoNoServidor(id);
        renderizarContatos(listaContatos);
    });
}

/* --- Formulário de adicionar contato --- */
function validarFormularioContato() {
    let valido = true;

    const nome = document.getElementById('novoContatoNome').value.trim();
    const telefone = document.getElementById('novoContatoTelefone').value.trim();

    document.getElementById('erroNovoContatoNome').textContent = '';
    document.getElementById('erroNovoContatoTelefone').textContent = '';

    if (nome.length < 2) {
        document.getElementById('erroNovoContatoNome').textContent = 'Digite um nome.';
        valido = false;
    }

    if (telefone.replace(/\D/g, '').length < 10) {
        document.getElementById('erroNovoContatoTelefone').textContent = 'Telefone incompleto.';
        valido = false;
    }

    return valido;
}

function iniciarFormularioContato() {
    const form = document.getElementById('formNovoContato');
    const btnSalvar = document.getElementById('btnSalvarContato');
    const mensagem = document.getElementById('mensagemStatusContato');

    document.getElementById('novoContatoTelefone').addEventListener('input', aplicarMascaraTelefone);

    form.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        if (!validarFormularioContato()) return;

        const contato = {
            nome: document.getElementById('novoContatoNome').value.trim(),
            telefone: document.getElementById('novoContatoTelefone').value.trim(),
            tipo: document.getElementById('novoContatoTipo').value
        };

        btnSalvar.disabled = true;
        btnSalvar.textContent = 'Adicionando...';

        await salvarContatoNoServidor(contato);
        renderizarContatos(listaContatos);

        mensagem.textContent = 'Contato adicionado com sucesso!';
        mensagem.className = 'mensagem-status sucesso';
        form.reset();

        btnSalvar.disabled = false;
        btnSalvar.textContent = 'Adicionar contato';

        // depois de 2s, some com a mensagem de sucesso
        setTimeout(() => { mensagem.textContent = ''; }, 2000);
    });
}


/* ==========================================================
   PARTE 7: SUPORTE PRIORITÁRIO (reagendar visita)
   ========================================================== */

let proximaVisita = new Date('2026-06-02T10:00:00');

function atualizarVisualVisita() {
    const dia = String(proximaVisita.getDate()).padStart(2, '0');
    const mes = String(proximaVisita.getMonth() + 1).padStart(2, '0');
    const ano = proximaVisita.getFullYear();
    const hora = String(proximaVisita.getHours()).padStart(2, '0');
    const min = String(proximaVisita.getMinutes()).padStart(2, '0');

    document.querySelectorAll('.js-visita-data').forEach(el => {
        el.textContent = `${dia}/${mes}/${ano}`;
    });

    document.querySelectorAll('.js-visita-hora').forEach(el => {
        el.textContent = `${hora}:${min}`;
    });
}

function reagendarVisitaNoServidor() {
    return new Promise(resolve => {
        setTimeout(() => {
            proximaVisita.setDate(proximaVisita.getDate() + 14);
            resolve(proximaVisita);
        }, 600);
    });
}

function iniciarReagendamento() {
    const botao = document.getElementById('btnReagendar');
    const mensagem = document.getElementById('mensagemStatusVisita');

    botao.addEventListener('click', async () => {
        botao.disabled = true;
        botao.textContent = 'Reagendando...';

        await reagendarVisitaNoServidor();
        atualizarVisualVisita();

        mensagem.textContent = 'Visita reagendada! Confira a nova data acima.';
        mensagem.className = 'mensagem-status sucesso';

        botao.disabled = false;
        botao.textContent = 'Reagendar';

        setTimeout(() => { mensagem.textContent = ''; }, 3000);
    });
}


/* ==========================================================
   PARTE 8: REGISTRO DE HUMOR 
   ========================================================== */

const emojisPorHumor = {
    feliz: '😄',
    neutro: '😐',
    triste: '😢',
    estresse: '😠'
};

const dadosHumor = [
    { data: '2026-05-10T12:00', humor: 'feliz' },
    { data: '2026-05-11T12:00', humor: 'neutro' },
    { data: '2026-05-12T12:00', humor: 'triste' },
    { data: '2026-05-13T12:00', humor: 'neutro' },
    { data: '2026-05-14T12:00', humor: 'neutro' },
    { data: '2026-05-15T12:00', humor: 'estresse' },
    { data: '2026-05-16T12:00', humor: 'feliz' },
    { data: '2026-05-17T12:00', humor: 'neutro' },
    { data: '2026-05-18T12:00', humor: 'feliz' }
];

function filtrarHumorPorPeriodo(dataInicio, dataFim) {
    return dadosHumor.filter(item => {
        const dataItem = new Date(item.data);
        return dataItem >= dataInicio && dataItem <= dataFim;
    });
}

function renderizarTimelineHumor(dados) {
    const container = document.getElementById('humorTimeline');
    container.innerHTML = '';

    if (dados.length === 0) {
        container.innerHTML = '<p class="mensagem-vazio">Nenhum registro nesse período.</p>';
        return;
    }

    dados.forEach(item => {
        const data = new Date(item.data);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const hora = String(data.getHours()).padStart(2, '0');

        const div = document.createElement('div');
        div.className = 'humor-dia';
        div.innerHTML = `
            <span class="emoji">${emojisPorHumor[item.humor]}</span>
            <span class="data">${dia}/${mes}<br>${hora}:00</span>
        `;
        container.appendChild(div);
    });
}

function atualizarUltimaAtualizacaoHumor(dados) {
    const elemento = document.getElementById('ultimaAtualizacaoHumor');
    if (dados.length === 0) {
        elemento.textContent = '--';
        return;
    }
    const ultimoItem = dados[dados.length - 1];
    elemento.textContent = formatarDataCompleta(new Date(ultimoItem.data));
}

function aplicarFiltroHumor() {
    const inicioInput = document.getElementById('humorInicio').value;
    const fimInput = document.getElementById('humorFim').value;

    if (!inicioInput || !fimInput) return;

    const dataInicio = new Date(`${inicioInput}T00:00:00`);
    const dataFim = new Date(`${fimInput}T23:59:59`);

    const dadosFiltrados = filtrarHumorPorPeriodo(dataInicio, dataFim);

    renderizarTimelineHumor(dadosFiltrados);
    atualizarUltimaAtualizacaoHumor(dadosFiltrados);
}


/* ==========================================================
   PARTE 9: INICIALIZAÇÃO DE TUDO AO CARREGAR A PÁGINA
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Picos de pressão + gráfico
    atualizarPicosDePressao();
    aplicarFiltro();
    document.getElementById('periodoInicio').addEventListener('change', aplicarFiltro);
    document.getElementById('periodoFim').addEventListener('change', aplicarFiltro);

    // Perfil
    iniciarPerfil();

    // Contatos
    iniciarAbasContatos();
    carregarContatos();
    iniciarRemocaoContatos();
    iniciarFormularioContato();

    // Suporte prioritário
    atualizarVisualVisita();
    iniciarReagendamento();

    // Registro de humor
    aplicarFiltroHumor();
    document.getElementById('humorInicio').addEventListener('change', aplicarFiltroHumor);
    document.getElementById('humorFim').addEventListener('change', aplicarFiltroHumor);
});