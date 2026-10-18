
document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.querySelector('.form-cadastro');

    const usuarioLogado = MapPet.usuarioLogado();

    if (usuarioLogado) {
        window.location.replace('./user.html');
        return;
    }

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim().toLowerCase();
        const senha = document.getElementById('senha').value;
        const confirmar = document.getElementById('confirma-senha').value;

        const usuarios = MapPet.usuarios();

        if (senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (senha !== confirmar) {
            alert('As senhas não coincidem.');
            return;
        }

        const existe = usuarios.some(function (usuario) {
            return usuario.email === email;
        });

        if (existe) {
            alert('Este e-mail já está cadastrado.');
            return;
        }

        const novoUsuario = {
            id: String(Date.now()) + String(Math.random()),
            nome: nome,
            email: email,
            senha: senha,
            telefone: document.getElementById('telefone').value.trim(),
            cidade: document.getElementById('cidade').value.trim(),
            uf: document.getElementById('uf').value.trim(),
            comoConheceu: document.getElementById('como-conheceu').value,
            pets: [],
            configuracoes: {}
        };

        usuarios.push(novoUsuario);

        MapPet.salvarUsuarios(usuarios);

        localStorage.setItem('mappetSessao', novoUsuario.id);

        window.location.replace('./user.html');
    });
});
