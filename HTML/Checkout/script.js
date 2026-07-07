var params = new URLSearchParams(window.location.search);
var nomePlano = params.get('plano') || 'Basic';
var precoStr = params.get('preco') || '0,00';

document.getElementById('resumo-plano').textContent = nomePlano;
document.getElementById('resumo-preco').textContent = 'R$ ' + precoStr;

var valorBotao = document.getElementById('valor-botao');
if (valorBotao) valorBotao.textContent = 'R$ ' + precoStr;

/* ---------- Se for plano grátis, simplifica ---------- */
var ehGratis = precoStr.replace(/\D/g, '').replace(/^0+$/, '') === '';

if (ehGratis) {
    document.querySelector('.metodos').style.display = 'none';
    document.getElementById('form-cartao').style.display = 'none';
    document.getElementById('form-pix').style.display = 'none';

    var gratisBotao = document.createElement('button');
    gratisBotao.type = 'button';
    gratisBotao.className = 'btn-pagar';
    gratisBotao.textContent = 'Ativar plano grátis';
    document.querySelector('.checkout').appendChild(gratisBotao);
    gratisBotao.addEventListener('click', function () {
        mostrarSucesso('Plano Basic grátis ativado!');
    });
}

/* ---------- Alternar Cartão / Pix ---------- */
var btnCartao = document.getElementById('btn-cartao');
var btnPix = document.getElementById('btn-pix');
var formCartao = document.getElementById('form-cartao');
var formPix = document.getElementById('form-pix');

btnCartao.addEventListener('click', function () {
    btnCartao.classList.add('ativo');
    btnCartao.setAttribute('aria-selected', 'true');
    btnPix.classList.remove('ativo');
    btnPix.setAttribute('aria-selected', 'false');
    formCartao.classList.remove('escondido');
    formPix.classList.add('escondido');
});

btnPix.addEventListener('click', function () {
    btnPix.classList.add('ativo');
    btnPix.setAttribute('aria-selected', 'true');
    btnCartao.classList.remove('ativo');
    btnCartao.setAttribute('aria-selected', 'false');
    formPix.classList.remove('escondido');
    formCartao.classList.add('escondido');
});

/* ---------- Mensagens ---------- */
function mostrarMsg(el, texto, tipo) {
    el.textContent = texto;
    el.className = 'mensagem mostrar ' + tipo;
}

function esconderMsg(el) {
    el.textContent = '';
    el.className = 'mensagem';
}

/* ---------- Formatação de campos ---------- */
var campoNumero = document.getElementById('numero-cartao');
var campoValidade = document.getElementById('validade');
var campoCvv = document.getElementById('cvv');

campoNumero.addEventListener('input', function () {
    var limpo = campoNumero.value.replace(/\D/g, '').slice(0, 16);
    campoNumero.value = limpo.replace(/(\d{4})(?=\d)/g, '$1 ');
});

campoValidade.addEventListener('input', function () {
    var limpo = campoValidade.value.replace(/\D/g, '').slice(0, 4);
    if (limpo.length >= 3) {
        campoValidade.value = limpo.slice(0, 2) + '/' + limpo.slice(2);
    } else {
        campoValidade.value = limpo;
    }
});

campoCvv.addEventListener('input', function () {
    campoCvv.value = campoCvv.value.replace(/\D/g, '').slice(0, 4);
});

/* ---------- Pagamento por cartão ---------- */
var msgCartao = document.getElementById('msg-cartao');

formCartao.addEventListener('submit', function (evento) {
    evento.preventDefault();
    esconderMsg(msgCartao);

    var nome = document.getElementById('nome-cartao').value.trim();
    var numero = campoNumero.value.replace(/\s/g, '');
    var validade = campoValidade.value.trim();
    var cvv = campoCvv.value.trim();

    if (nome === '') {
        mostrarMsg(msgCartao, 'Digite o nome como está no cartão.', 'erro');
        return;
    }
    if (numero.length < 13 || numero.length > 16) {
        mostrarMsg(msgCartao, 'O número do cartão deve ter entre 13 e 16 dígitos.', 'erro');
        return;
    }
    if (!/^\d{2}\/\d{2}$/.test(validade)) {
        mostrarMsg(msgCartao, 'Validade deve estar no formato MM/AA.', 'erro');
        return;
    }
    var mes = parseInt(validade.split('/')[0], 10);
    if (mes < 1 || mes > 12) {
        mostrarMsg(msgCartao, 'O mês da validade deve estar entre 01 e 12.', 'erro');
        return;
    }
    if (cvv.length < 3) {
        mostrarMsg(msgCartao, 'O CVV deve ter pelo menos 3 dígitos.', 'erro');
        return;
    }

    // Simula processamento
    var btnPagar = document.getElementById('btn-pagar-cartao');
    btnPagar.disabled = true;
    btnPagar.textContent = 'Processando...';
    mostrarMsg(msgCartao, 'Processando pagamento, aguarde...', 'sucesso');

    setTimeout(function () {
        btnPagar.disabled = false;
        btnPagar.textContent = 'Pagar R$ ' + precoStr;
        mostrarSucesso('Pagamento de R$ ' + precoStr + ' aprovado! Seu plano ' + nomePlano + ' já está ativo.');
    }, 2000);
});

/* ---------- Pix ---------- */
var msgPix = document.getElementById('msg-pix');
var btnCopiar = document.getElementById('btn-copiar-pix');
var codigoPix = document.getElementById('codigo-pix');
var btnConfirmar = document.getElementById('btn-confirmar-pix');

btnCopiar.addEventListener('click', function () {
    codigoPix.select();
    navigator.clipboard.writeText(codigoPix.value).then(function () {
        btnCopiar.textContent = 'Copiado!';
        setTimeout(function () { btnCopiar.textContent = 'Copiar'; }, 2000);
    }).catch(function () {
        document.execCommand('copy');
        btnCopiar.textContent = 'Copiado!';
        setTimeout(function () { btnCopiar.textContent = 'Copiar'; }, 2000);
    });
});

btnConfirmar.addEventListener('click', function () {
    btnConfirmar.disabled = true;
    btnConfirmar.textContent = 'Verificando pagamento...';
    mostrarMsg(msgPix, 'Confirmando com o banco, aguarde...', 'sucesso');

    setTimeout(function () {
        btnConfirmar.disabled = false;
        btnConfirmar.textContent = 'Já paguei';
        mostrarSucesso('Pix de R$ ' + precoStr + ' confirmado! Seu plano ' + nomePlano + ' já está ativo.');
    }, 2500);
});

/* ---------- Overlay de sucesso ---------- */
function mostrarSucesso(texto) {
    var overlay = document.getElementById('overlay-sucesso');
    document.getElementById('sucesso-texto').textContent = texto;
    overlay.classList.add('ativo');
}
