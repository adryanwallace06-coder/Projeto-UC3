
document.addEventListener('DOMContentLoaded', () => {
    const botaoMenu = document.getElementById('menuToggle');
    const menu = document.getElementById('menuNav');

    botaoMenu.addEventListener('click', () => {
        // classList.toggle: se a classe "aberto" NÃO existir, ele adiciona;
        // se já existir, ele remove. É um "liga/desliga" automático.
        const estaAberto = menu.classList.toggle('aberto');

        // aria-expanded avisa leitores de tela se o menu está aberto ou fechado
        botaoMenu.setAttribute('aria-expanded', estaAberto);
        botaoMenu.setAttribute(
            'aria-label',
            estaAberto ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
        );
    });

    // Fecha o menu automaticamente ao clicar em algum link
    // (bom pra quando o link é uma âncora tipo #planos, que não recarrega a página)
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('aberto');
            botaoMenu.setAttribute('aria-expanded', 'false');
            botaoMenu.setAttribute('aria-label', 'Abrir menu de navegação');
        });
    });
});