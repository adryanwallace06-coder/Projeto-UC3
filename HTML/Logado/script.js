
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

let dadosUsuario = {
    nome: 'Adryan Ernandes',
    email: 'adryan@gmail.com',
    cpf: '123.456.789-00',
    telefone: '(11) 91234-5678',
    tipo: 'paciente',
    plano: 'Basic + Anual',
    foto: null
};

const overlay = document.getElementById('perfilOverlay');
const overlayFundo = document.getElementById('perfilFundo');
const formPerfil = document.getElementById('formPerfil');
const btnSalvarPerfil = document.getElementById('btnSalvarPerfil');
const mensagemStatus = document.getElementById('mensagemStatus');

function buscarPerfil() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(dadosUsuario);
        }, 500);
    });
}

function salvarPerfilNoServidor(dadosNovos) {
    return new Promise((resolve) => {
        setTimeout(() => {
            dadosUsuario = { ...dadosUsuario, ...dadosNovos };
            resolve(dadosUsuario);
        }, 900);
    });
}

async function abrirPerfil() {
    overlay.classList.add('aberto');
    overlay.setAttribute('aria-hidden', 'false');
    mensagemStatus.textContent = '';
    mensagemStatus.className = 'mensagem-status';

    const perfil = await buscarPerfil();
    preencherFormulario(perfil);

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

function fecharPerfil() {
    overlay.classList.remove('aberto');
    overlay.setAttribute('aria-hidden', 'true');
    limparErros();
    document.getElementById('btnVerPerfil').focus();
}

/* --- Sair da conta --- */
function sairDaConta() {
    // Apaga o registro de "quem está logado" (foi guardado na página de Login).
    // Os dados de cadastro em si (medicaMaisUsuarios) continuam salvos,
    // só esquecemos QUEM estava usando o site agora.
    localStorage.removeItem('medicaMaisUsuarioLogado');

    // Volta pra Home. Como estamos em HTML/Logado/logado.html e a Home
    // fica em HTML/Home/index.html, subimos uma pasta (../) e entramos em Home/
    window.location.href = '../Home/index.html';
}

function aplicarMascaraCpf(evento) {
    let numeros = evento.target.value.replace(/\D/g, '');
    numeros = numeros.slice(0, 11);

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

function preverFoto(evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();

    leitor.onload = () => {
        document.getElementById('fotoPreview').src = leitor.result;
        dadosUsuario.foto = leitor.result;
    };

    leitor.readAsDataURL(arquivo);
}

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

async function aoEnviarFormulario(evento) {
    evento.preventDefault();

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

    btnSalvarPerfil.disabled = true;
    btnSalvarPerfil.textContent = 'Salvando...';
    mensagemStatus.textContent = '';
    mensagemStatus.className = 'mensagem-status';

    try {
        const perfilAtualizado = await salvarPerfilNoServidor(dadosNovos);

        mensagemStatus.textContent = 'Perfil atualizado com sucesso!';
        mensagemStatus.className = 'mensagem-status sucesso';

        const primeiroNome = perfilAtualizado.nome.split(' ')[0];
        document.getElementById('saudacaoNome').textContent = `Olá, ${primeiroNome}! 👋`;

        setTimeout(fecharPerfil, 1200);

    } catch (erro) {
        mensagemStatus.textContent = erro.message;
        mensagemStatus.className = 'mensagem-status erro-geral';
    } finally {
        btnSalvarPerfil.disabled = false;
        btnSalvarPerfil.textContent = 'Salvar alterações';
    }
}

function iniciarPerfil() {
    document.getElementById('btnVerPerfil').addEventListener('click', abrirPerfil);
    document.getElementById('linkPerfilNav').addEventListener('click', (e) => {
        e.preventDefault();
        abrirPerfil();
    });

    document.getElementById('btnFecharPerfil').addEventListener('click', fecharPerfil);
    document.getElementById('btnCancelarPerfil').addEventListener('click', fecharPerfil);
    document.getElementById('btnSair').addEventListener('click', sairDaConta);
    overlayFundo.addEventListener('click', fecharPerfil);

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
   PARTE 5: MENU HAMBURGUER (mobile)
   ========================================================== */

function iniciarMenuMobile() {
    const botaoMenu = document.getElementById('menuToggle');
    const menu = document.getElementById('menuNav');

    botaoMenu.addEventListener('click', () => {
        const estaAberto = menu.classList.toggle('aberto');

        botaoMenu.setAttribute('aria-expanded', estaAberto);
        botaoMenu.setAttribute(
            'aria-label',
            estaAberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
        );
    });

    // Fecha o menu automaticamente ao clicar em algum link do menu
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('aberto');
            botaoMenu.setAttribute('aria-expanded', 'false');
            botaoMenu.setAttribute('aria-label', 'Abrir menu de navegação');
        });
    });
}


/* ==========================================================
   PARTE 6: MENU ACOMPANHA O SCROLL (scroll-spy)
   ========================================================== */

/* Destaca no menu o link da seção que está sendo vista no momento. */
function iniciarScrollSpy() {
    // Só essas 3 seções têm um item correspondente no menu
    const idsComLink = ['monitoramento', 'contatos', 'suporte'];
    const secoes = idsComLink.map(id => document.getElementById(id)).filter(Boolean);
    const linksNav = document.querySelectorAll('#menuNav a');

    function marcarAtivo(id) {
        linksNav.forEach(link => {
            const alvo = id ? `#${id}` : 'logado.html';
            link.classList.toggle('ativo', link.getAttribute('href') === alvo);
        });
    }

    /* IntersectionObserver "vigia" os elementos passados em observe() e avisa,
       através do callback, sempre que um deles entra ou sai da área visível.
       O rootMargin encolhe essa área de detecção: em vez de considerar a seção
       "vista" assim que qualquer pixel dela aparece, só conta quando ela cruza
       perto do MEIO da tela - assim o menu troca no momento certo, nem cedo
       demais nem tarde demais. */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                marcarAtivo(entry.target.id);
            }
        });
    }, {
        rootMargin: '-45% 0px -50% 0px'
    });

    secoes.forEach(secao => observer.observe(secao));

    // Enquanto o usuário ainda está lá em cima (antes da primeira seção com
    // link no menu), garante que "Início" continue destacado
    window.addEventListener('scroll', () => {
        const primeiraSecao = secoes[0];
        if (primeiraSecao && window.scrollY < primeiraSecao.offsetTop - window.innerHeight * 0.5) {
            marcarAtivo(null);
        }
    });
}


/* ==========================================================
   PARTE 7: CARDS DO TOPO LEVAM ATÉ A SEÇÃO COMPLETA
   ========================================================== */

/* Qualquer elemento com o atributo "data-scroll-to" (ex: data-scroll-to="#contatos")
   vira clicável e rola suavemente até a seção com aquele id. */
function iniciarCardsRapidos() {
    document.querySelectorAll('[data-scroll-to]').forEach(card => {

        // torna o card "focável" e reconhecível por leitor de tela como um botão
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');

        const irParaSecao = () => {
            const alvo = document.querySelector(card.dataset.scrollTo);
            if (alvo) {
                alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        card.addEventListener('click', (evento) => {
            // se o clique foi num botão/link DENTRO do card (ex: "Ana (Filha)"),
            // deixa esse botão agir normalmente e não rola a tela
            if (evento.target.closest('button, a')) return;
            irParaSecao();
        });

        // permite ativar com o teclado (Enter ou Espaço), já que agora o card
        // se comporta como um botão
        card.addEventListener('keydown', (evento) => {
            if (evento.key === 'Enter' || evento.key === ' ') {
                evento.preventDefault();
                irParaSecao();
            }
        });
    });
}


/* ==========================================================
   PARTE 8: CONTATOS (abas + lista + adicionar/remover)
   ========================================================== */

let listaContatos = [
    { id: 1, nome: 'Ana (Filha)', telefone: '(11) 91234-5678', tipo: 'familiar' },
    { id: 2, nome: 'Carlos', telefone: '(11) 99876-5432', tipo: 'cuidador' }
];

let proximoIdContato = 3;

function iniciarAbasContatos() {
    const abas = document.querySelectorAll('.contatos-abas .aba');

    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            abas.forEach(a => a.setAttribute('aria-selected', 'false'));
            document.querySelectorAll('.contatos-painel').forEach(painel => painel.hidden = true);

            aba.setAttribute('aria-selected', 'true');
            const idPainel = aba.getAttribute('aria-controls');
            document.getElementById(idPainel).hidden = false;
        });
    });
}

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

function iniciarRemocaoContatos() {
    document.getElementById('listaContatosCompleta').addEventListener('click', async (evento) => {
        const botao = evento.target.closest('.btn-remover-contato');
        if (!botao) return;

        const id = Number(botao.dataset.id);
        botao.disabled = true;
        botao.textContent = 'Removendo...';

        await removerContatoNoServidor(id);
        renderizarContatos(listaContatos);
    });
}

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

        setTimeout(() => { mensagem.textContent = ''; }, 2000);
    });
}


/* ==========================================================
   PARTE 9: SUPORTE PRIORITÁRIO (reagendar visita)
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
   PARTE 10: REGISTRO DE HUMOR (timeline + filtro)
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
   PARTE 11: INICIALIZAÇÃO DE TUDO AO CARREGAR A PÁGINA
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Menu mobile
    iniciarMenuMobile();

    // Menu acompanha o scroll
    iniciarScrollSpy();

    // Cards do topo (clicáveis)
    iniciarCardsRapidos();

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