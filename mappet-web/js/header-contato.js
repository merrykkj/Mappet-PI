document.addEventListener('DOMContentLoaded', function () {
    const acoes = document.querySelector('.nav-actions');
    const usuario = typeof MapPet !== 'undefined' ? MapPet.usuarioLogado() : null;
    if (acoes && usuario) {
        acoes.innerHTML = '<div class="menu-perfil"><button type="button" class="perfil-toggle" aria-expanded="false"><i class="fa-solid fa-user"></i> Minha conta <i class="fa-solid fa-chevron-down"></i></button><div class="perfil-dropdown"><a href="./user.html"><i class="fa-solid fa-user-gear"></i> Área do Usuário</a><button type="button" class="perfil-sair"><i class="fa-solid fa-right-from-bracket"></i> Sair da conta</button></div></div>';
        const menu = acoes.querySelector('.menu-perfil');
        const toggle = acoes.querySelector('.perfil-toggle');
        toggle.addEventListener('click', function () {
            const aberto = menu.classList.toggle('aberto');
            toggle.setAttribute('aria-expanded', String(aberto));
        });
        acoes.querySelector('.perfil-sair').addEventListener('click', function () {
            localStorage.removeItem('mappetSessao');
            window.location.href = './index.html';
        });
        document.addEventListener('click', function (evento) {
            if (!menu.contains(evento.target)) {
                menu.classList.remove('aberto');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
    const botao = document.querySelector('.hamburger-btn');
    const menuMobile = document.querySelector('.nav-menu-wrapper');
    const fundo = document.querySelector('.menu-overlay');
    if (!botao || !menuMobile || !fundo) return;
    function fechar() {
        menuMobile.classList.remove('active');
        fundo.classList.remove('active');
        botao.setAttribute('aria-expanded', 'false');
        botao.querySelector('i').className = 'fa-solid fa-bars';
    }
    botao.addEventListener('click', function () {
        const aberto = menuMobile.classList.toggle('active');
        fundo.classList.toggle('active', aberto);
        botao.setAttribute('aria-expanded', String(aberto));
        botao.querySelector('i').className = aberto ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });
    fundo.addEventListener('click', fechar);
    menuMobile.querySelectorAll('.nav-links a').forEach(function (link) { link.addEventListener('click', fechar); });
});
