
const MapPet = {
    usuarios: function () {
        return JSON.parse(localStorage.getItem('mappetUsuarios')) || [];
    },

    salvarUsuarios: function (usuarios) {
        localStorage.setItem('mappetUsuarios', JSON.stringify(usuarios));
    },

    usuarioLogado: function () {
        const id = localStorage.getItem('mappetSessao');

        if (!id) {
            return null;
        }

        const usuarios = this.usuarios();

        const usuario = usuarios.find(function (item) {
            return String(item.id) === String(id);
        });

        return usuario || null;
    },

    salvarUsuario: function (usuarioAtualizado) {
        const usuarios = this.usuarios();

        const posicao = usuarios.findIndex(function (usuario) {
            return String(usuario.id) === String(usuarioAtualizado.id);
        });

        if (posicao !== -1) {
            usuarios[posicao] = usuarioAtualizado;
            this.salvarUsuarios(usuarios);
        }
    }
};
