
document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.querySelector('.form-cadastro');

    const voltar = document.querySelector('.btn-voltar-home');
    if (voltar) {
        voltar.addEventListener('click', function (evento) {
            evento.preventDefault();
            let anterior = '';
            try {
                if (document.referrer) {
                    const pagina = new URL(document.referrer);
                    if (pagina.origin === window.location.origin && !/\/cadastro\.html$/.test(pagina.pathname)) {
                        anterior = pagina.href;
                    }
                }
            } catch (erro) {}
            window.location.href = anterior || './index.html';
        });
    }


    const usuarioLogado = MapPet.usuarioLogado();

    if (usuarioLogado) {
        window.location.replace('./user.html');
        return;
    }

    const uf = document.getElementById('uf');
    const cidade = document.getElementById('cidade');
    const estados = [
        ['AC','Acre'],['AL','Alagoas'],['AP','Amapá'],['AM','Amazonas'],
        ['BA','Bahia'],['CE','Ceará'],['DF','Distrito Federal'],['ES','Espírito Santo'],
        ['GO','Goiás'],['MA','Maranhão'],['MT','Mato Grosso'],['MS','Mato Grosso do Sul'],
        ['MG','Minas Gerais'],['PA','Pará'],['PB','Paraíba'],['PR','Paraná'],
        ['PE','Pernambuco'],['PI','Piauí'],['RJ','Rio de Janeiro'],['RN','Rio Grande do Norte'],
        ['RS','Rio Grande do Sul'],['RO','Rondônia'],['RR','Roraima'],['SC','Santa Catarina'],
        ['SP','São Paulo'],['SE','Sergipe'],['TO','Tocantins']
    ];
    estados.forEach(function (estado) {
        const opcao = document.createElement('option');
        opcao.value = estado[0];
        opcao.textContent = estado[1] + ' (' + estado[0] + ')';
        uf.appendChild(opcao);
    });

    uf.addEventListener('change', async function () {
        const selecionada = uf.value;
        cidade.disabled = true;
        cidade.innerHTML = '<option value="">Carregando cidades...</option>';
        try {
            const resposta = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + selecionada + '/municipios?orderBy=nome');
            if (!resposta.ok) throw new Error('Falha ao carregar cidades');
            const municipios = await resposta.json();
            if (uf.value !== selecionada) return;
            cidade.innerHTML = '<option value="" selected disabled>Selecione a cidade</option>';
            municipios.forEach(function (municipio) {
                const opcao = document.createElement('option');
                opcao.value = municipio.nome;
                opcao.textContent = municipio.nome;
                cidade.appendChild(opcao);
            });
            cidade.disabled = false;
        } catch (erro) {
            if (uf.value === selecionada) cidade.innerHTML = '<option value="">Não foi possível carregar as cidades</option>';
        }
    });

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
