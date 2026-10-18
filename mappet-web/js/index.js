
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    const menuOverlay = document.querySelector('.menu-overlay');
    const navActions = document.querySelector('.nav-actions');

    const usuario = MapPet.usuarioLogado();

    if (usuario && navActions) {
        navActions.innerHTML = '';

        const botaoPerfil = document.createElement('a');
        botaoPerfil.href = './user.html';
        botaoPerfil.className = 'btn btn-cadastro btn-meu-perfil';

        const textoBotao = document.createElement('span');
        textoBotao.textContent = 'Área do Usuário';

        botaoPerfil.appendChild(textoBotao);


        navActions.appendChild(botaoPerfil);
    }

    function toggleMenu() {
        navMenuWrapper.classList.toggle('active');
        menuOverlay.classList.toggle('active');

        const icon = hamburgerBtn.querySelector('i');

        if (navMenuWrapper.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', function () {
            if (navMenuWrapper.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    document.querySelectorAll('.nav-menu-wrapper a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (navMenuWrapper.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
});
