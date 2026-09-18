document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenuWrapper = document.querySelector('.nav-menu-wrapper');
    const menuOverlay = document.querySelector('.menu-overlay');
    const icon = hamburgerBtn.querySelector('i');

    function toggleMenu() {
        navMenuWrapper.classList.toggle('active');
        menuOverlay.classList.toggle('active');

        if (navMenuWrapper.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    }

    hamburgerBtn.addEventListener('click', toggleMenu);

    menuOverlay.addEventListener('click', () => {
        if (navMenuWrapper.classList.contains('active')) {
            toggleMenu();
        }
    });

    document.querySelectorAll('.nav-menu-wrapper a').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenuWrapper.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
});