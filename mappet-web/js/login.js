
document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.querySelector('.form-login');
    const email = document.getElementById('email');
    const senha = document.getElementById('senha');
    const mensagem = document.querySelector('.mensagem-login');
    const lembrar = document.getElementById('lembrar-me');
    const mostrarSenha = document.querySelector('.mostrar-senha');
    const esqueciSenha = document.getElementById('esqueci-senha');

    const voltar = document.querySelector('.btn-voltar-home');
    if (voltar) {
        voltar.addEventListener('click', function (evento) {
            evento.preventDefault();
            let anterior = '';
            try {
                if (document.referrer) {
                    const pagina = new URL(document.referrer);
                    if (pagina.origin === window.location.origin && !/\/(login|cadastro)\.html$/.test(pagina.pathname)) {
                        anterior = pagina.href;
                    }
                }
            } catch (erro) {}
            window.location.href = anterior || './index.html';
        });
    }

    const usuarioLogado = MapPet.usuarioLogado();

    if (usuarioLogado) {
        const destino = sessionStorage.getItem('mappetDestinoLogin');
        sessionStorage.removeItem('mappetDestinoLogin');
        window.location.replace(destino && /^\.\/contato-adocao\.html\?id=[a-zA-Z0-9._-]+$/.test(destino) ? destino : './user.html');
        return;
    }

    const emailSalvo = localStorage.getItem('mappetEmailLembrado');

    if (emailSalvo) {
        email.value = emailSalvo;
        lembrar.checked = true;
    }

    mostrarSenha.addEventListener('click', function () {
        if (senha.type === 'password') {
            senha.type = 'text';
        } else {
            senha.type = 'password';
        }
    });

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const usuarios = MapPet.usuarios();
        const emailDigitado = email.value.trim().toLowerCase();
        const senhaDigitada = senha.value;

        const usuario = usuarios.find(function (item) {
            return item.email === emailDigitado &&
                item.senha === senhaDigitada;
        });

        if (!usuario) {
            mensagem.textContent = 'E-mail ou senha incorretos.';
            return;
        }

        if (lembrar.checked) {
            localStorage.setItem('mappetEmailLembrado', emailDigitado);
        } else {
            localStorage.removeItem('mappetEmailLembrado');
        }

        localStorage.setItem('mappetSessao', usuario.id);

        const destino = sessionStorage.getItem('mappetDestinoLogin');
        sessionStorage.removeItem('mappetDestinoLogin');
        window.location.replace(destino && /^\.\/contato-adocao\.html\?id=[a-zA-Z0-9._-]+$/.test(destino) ? destino : './user.html');
    });

    esqueciSenha.addEventListener('click', function (evento) {
        evento.preventDefault();

        mensagem.textContent =
            'A recuperação de senha precisa de um servidor.';
    });
});
