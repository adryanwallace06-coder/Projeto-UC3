const menuToggle = document.querySelector('#menuToggle');
const menuNav = document.querySelector('#menuNav');

function abrirMenu() {
    menuNav.classList.add('aberto');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fechar menu de navegação');
}

function fecharMenu() {
    menuNav.classList.remove('aberto');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu de navegação');
}

menuToggle.addEventListener('click', function () {
    if (menuNav.classList.contains('aberto')) {
        fecharMenu();
    } else {
        abrirMenu();
    }
});

menuNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', fecharMenu);
});

document.addEventListener('click', function (evento) {
    const clicouNoMenu = menuNav.contains(evento.target);
    const clicouNoBotao = menuToggle.contains(evento.target);
    if (!clicouNoMenu && !clicouNoBotao) {
        fecharMenu();
    }
});

document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape') {
        fecharMenu();
    }
});

/* =========================================================
                         SCROLL-SPY
   ========================================================= */

const secoes = [
    { el: document.querySelector('.hero'), link: menuNav.querySelector('a[href="index.html"]') },
    { el: document.querySelector('#funcionalidades'), link: menuNav.querySelector('a[href="#funcionalidades"]') },
    { el: document.querySelector('#planos'), link: menuNav.querySelector('a[href="#planos"]') },
    { el: document.querySelector('#contato'), link: menuNav.querySelector('a[href="#contato"]') }
].filter(function (s) { return s.el && s.link; });

function destacarLink(linkAtivo) {
    secoes.forEach(function (s) {
        if (s.link === linkAtivo) {
            s.link.setAttribute('aria-current', 'page');
        } else {
            s.link.removeAttribute('aria-current');
        }
    });
}

function atualizarScrollSpy() {
    var alturaNav = document.querySelector('nav').offsetHeight;
    var linhaDeteccao = alturaNav + window.innerHeight * 0.25;
    var ativa = null;

    secoes.forEach(function (s) {
        var rect = s.el.getBoundingClientRect();
        if (rect.top <= linhaDeteccao && rect.bottom > linhaDeteccao) {
            ativa = s;
        }
    });

    if (!ativa) {
        for (var i = secoes.length - 1; i >= 0; i--) {
            if (secoes[i].el.getBoundingClientRect().top <= linhaDeteccao) {
                ativa = secoes[i];
                break;
            }
        }
    }

    if (ativa) {
        destacarLink(ativa.link);
    }
}

window.addEventListener('scroll', atualizarScrollSpy, { passive: true });
atualizarScrollSpy();

/* =========================================================
                            PLANOS
   ========================================================= */

const planos = document.querySelectorAll('.planos .card > div');

planos.forEach(function (cartao) {
    const botao = cartao.querySelector('button');
    if (!botao) return;

    botao.addEventListener('click', function () {
        const nomePlano = cartao.querySelector('h3').textContent.replace(/\s+/g, ' ').trim();
        // Pega o span que está DENTRO do <p> (o preço), e não o "+" do título
        const precoEl = cartao.querySelector('p span');
        const preco = precoEl ? precoEl.textContent.trim() : '0,00';

        const url = '../Checkout/index.html'
            + '?plano=' + encodeURIComponent(nomePlano)
            + '&preco=' + encodeURIComponent(preco);
        window.location.href = url;
    });
});
