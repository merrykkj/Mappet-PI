document.addEventListener('DOMContentLoaded', function () {
    let usuario = MapPet.usuarioLogado();
    if (!usuario) {
        window.location.href = './login.html';
        return;
    }

    const nome = usuario.nome.trim().split(' ')[0];
    document.getElementById('nome-usuario-sidebar').textContent = nome;
    document.getElementById('nome-usuario').textContent = nome;

    const listaPets = document.querySelector('#secao-perfil .grid-cards-pets');
    const listaHistorico = document.querySelector('#secao-pets .grid-cards-pets');
    const modal = document.getElementById('modal-edicao');
    let filtroAtual = 'todos';
    let petEditando = '';

    function salvar() {
        MapPet.salvarUsuario(usuario);
        mostrarPets();
    }

    function textoSeguro(texto) {
        const elemento = document.createElement('span');
        elemento.textContent = texto || '';
        return elemento.innerHTML;
    }

    function criarCard(pet, historico) {
        const card = document.createElement('article');
        card.className = 'card-pet';
        card.dataset.id = pet.id;

        let status = pet.tipo === 'perdido' ? 'Perdido' : 'Encontrado';
        if (pet.reencontrado) status = 'Reencontrado';

        let foto = '<div class="sem-foto-pet"><i class="fa-solid fa-paw"></i></div>';
        if (pet.foto) foto = '<img src="' + pet.foto + '" alt="Foto do pet">';

        let botoes = '';
        if (!historico) {
            botoes = '<div class="acoes-card-pet">' +
                '<button class="btn-editar" data-acao="editar">Editar</button>' +
                '<button class="btn-excluir" data-acao="excluir">Excluir</button>' +
                '<button class="btn-editar" data-acao="reencontrar">Marcar reencontro</button>' +
                '</div>';
        }

        card.innerHTML = '<div class="card-pet-img">' + foto +
            '<span class="status-pet">' + status + '</span></div>' +
            '<div class="card-pet-body">' +
            '<h3 class="card-titulo-pet">' + textoSeguro(pet.nome) + '</h3>' +
            '<div class="tags-pet"><span class="tag azul">' + textoSeguro(pet.especie) + '</span></div>' +
            '<p class="card-desc-pet">' + textoSeguro(pet.descricao) + '</p>' +
            '<div class="rodape-card-pet"><span class="local-pet"><i class="fa-solid fa-location-dot"></i> ' +
            '<span class="card-local-pet">' + textoSeguro(pet.local) + '</span></span></div>' + botoes + '</div>';
        return card;
    }

    function mostrarPets() {
        listaPets.innerHTML = '';
        listaHistorico.innerHTML = '';

        let perdidos = 0;
        let encontrados = 0;
        let ativos = 0;
        let reencontros = 0;
        let exibidos = 0;

        usuario.pets.forEach(function (pet) {
            if (pet.reencontrado) {
                reencontros++;
                listaHistorico.appendChild(criarCard(pet, true));
            } else {
                ativos++;
                if (pet.tipo === 'perdido') perdidos++;
                else encontrados++;

                if (filtroAtual === 'todos' || filtroAtual === pet.tipo) {
                    listaPets.appendChild(criarCard(pet, false));
                    exibidos++;
                }
            }
        });

        if (exibidos === 0) listaPets.innerHTML = '<p class="mensagem-vazia">Nenhuma publicação encontrada.</p>';
        if (reencontros === 0) listaHistorico.innerHTML = '<p class="mensagem-vazia">Nenhum reencontro registrado ainda.</p>';

        const numeros = document.querySelectorAll('#secao-perfil .card-stat h3');
        const valores = [perdidos, encontrados, ativos, reencontros];
        numeros.forEach(function (elemento, indice) {
            elemento.textContent = valores[indice];
        });
    }

    document.querySelectorAll('.menu-item').forEach(function (botao) {
        botao.addEventListener('click', function () {
            document.querySelectorAll('.menu-item').forEach(function (item) {
                item.classList.remove('ativo');
            });
            document.querySelectorAll('.painel-secao').forEach(function (secao) {
                secao.classList.remove('ativo');
            });
            botao.classList.add('ativo');
            document.getElementById(botao.dataset.target).classList.add('ativo');
            if (window.innerWidth <= 900) document.body.classList.add('menu-recolhido');
        });
    });

    document.querySelector('.btn-recolher-menu').addEventListener('click', function () {
        document.body.classList.toggle('menu-recolhido');
    });

    document.querySelector('.btn-sair').addEventListener('click', function (evento) {
        evento.preventDefault();
        localStorage.removeItem('mappetSessao');
        window.location.href = './login.html';
    });

    document.querySelectorAll('.filtro-btn').forEach(function (botao) {
        botao.addEventListener('click', function () {
            document.querySelectorAll('.filtro-btn').forEach(function (item) {
                item.classList.remove('ativo');
            });
            botao.classList.add('ativo');
            const texto = botao.textContent.trim().toLowerCase();
            if (texto === 'perdidos') filtroAtual = 'perdido';
            else if (texto === 'encontrados') filtroAtual = 'encontrado';
            else filtroAtual = 'todos';
            mostrarPets();
        });
    });

    document.querySelectorAll('.btn-tipo-cadastro').forEach(function (botao) {
        botao.addEventListener('click', function () {
            document.querySelectorAll('.btn-tipo-cadastro').forEach(function (item) {
                item.classList.remove('ativo');
            });
            document.querySelectorAll('.form-cadastro-pet').forEach(function (formulario) {
                formulario.classList.remove('ativo');
            });
            botao.classList.add('ativo');
            document.getElementById('form-pet-' + botao.dataset.tipo).classList.add('ativo');
        });
    });

    function publicarPet(evento, tipo) {
        evento.preventDefault();
        let nomePet = '';
        let especie = '';
        let descricao = '';

        if (tipo === 'perdido') {
            nomePet = document.getElementById('nome-pet-perdido').value.trim();
            especie = document.getElementById('especie-pet-perdido').value.trim();
            descricao = document.getElementById('detalhes-pet-perdido').value.trim();
        } else {
            nomePet = document.getElementById('aparencia-pet-encontrado').value.trim();
            especie = 'Pet encontrado';
            descricao = document.getElementById('observacoes-pet-encontrado').value.trim();
        }

        const local = document.getElementById('local-pet-' + tipo).value.trim();
        if (!nomePet || !local) {
            alert('Preencha o nome ou aparência e o local.');
            return;
        }

        const pet = {
            id: String(Date.now()) + String(Math.random()),
            nome: nomePet,
            especie: especie,
            descricao: descricao,
            local: local,
            tipo: tipo,
            foto: '',
            reencontrado: false,
            criadoEm: new Date().toLocaleDateString('pt-BR')
        };

        function finalizar() {
            usuario.pets.push(pet);
            try {
                salvar();
                evento.target.reset();
                document.querySelector('[data-target="secao-perfil"]').click();
            } catch (erro) {
                usuario.pets.pop();
                alert('Não foi possível salvar. O armazenamento pode estar cheio.');
            }
        }

        if (tipo === 'encontrado') {
            const arquivo = document.getElementById('foto-pet-encontrado').files[0];
            if (arquivo) {
                if (arquivo.size > 750000) {
                    alert('A foto precisa ter menos de 750 KB.');
                    return;
                }
                const leitor = new FileReader();
                leitor.onload = function () {
                    pet.foto = leitor.result;
                    finalizar();
                };
                leitor.readAsDataURL(arquivo);
                return;
            }
        }
        finalizar();
    }

    document.getElementById('form-pet-perdido').addEventListener('submit', function (evento) {
        publicarPet(evento, 'perdido');
    });
    document.getElementById('form-pet-encontrado').addEventListener('submit', function (evento) {
        publicarPet(evento, 'encontrado');
    });

    listaPets.addEventListener('click', function (evento) {
        const botao = evento.target.closest('button[data-acao]');
        if (!botao) return;
        const id = botao.closest('.card-pet').dataset.id;
        const pet = usuario.pets.find(function (item) {
            return item.id === id;
        });
        if (!pet) return;

        if (botao.dataset.acao === 'excluir') {
            if (confirm('Excluir a publicação de ' + pet.nome + '?')) {
                usuario.pets = usuario.pets.filter(function (item) {
                    return item.id !== id;
                });
                salvar();
            }
        }

        if (botao.dataset.acao === 'reencontrar') {
            if (confirm('Marcar ' + pet.nome + ' como reencontrado?')) {
                pet.reencontrado = true;
                pet.reencontradoEm = new Date().toLocaleDateString('pt-BR');
                salvar();
            }
        }

        if (botao.dataset.acao === 'editar') {
            petEditando = id;
            document.getElementById('modal-input-titulo').value = pet.nome;
            document.getElementById('modal-input-local').value = pet.local;
            document.getElementById('modal-textarea-desc').value = pet.descricao;
            modal.classList.add('ativo');
        }
    });

    function fecharModal() {
        modal.classList.remove('ativo');
    }

    document.querySelector('.btn-fechar-modal').addEventListener('click', fecharModal);
    document.querySelector('.btn-cancelar-modal').addEventListener('click', fecharModal);
    modal.addEventListener('click', function (evento) {
        if (evento.target === modal) fecharModal();
    });

    document.querySelector('.btn-salvar-modal').addEventListener('click', function () {
        const pet = usuario.pets.find(function (item) {
            return item.id === petEditando;
        });
        if (!pet) return;
        pet.nome = document.getElementById('modal-input-titulo').value.trim();
        pet.local = document.getElementById('modal-input-local').value.trim();
        pet.descricao = document.getElementById('modal-textarea-desc').value.trim();
        if (!pet.nome || !pet.local) {
            alert('Preencha o nome e o local.');
            return;
        }
        salvar();
        fecharModal();
    });

    document.querySelectorAll('#secao-config input[type="checkbox"]').forEach(function (campo, indice) {
        campo.checked = usuario.configuracoes[indice] === undefined ? true : usuario.configuracoes[indice];
        campo.addEventListener('change', function () {
            usuario.configuracoes[indice] = campo.checked;
            salvar();
        });
    });

    const pesquisa = document.querySelector('#secao-pets .barra-pesquisa-pets input');
    if (pesquisa) {
        pesquisa.addEventListener('input', function () {
            listaHistorico.querySelectorAll('.card-pet').forEach(function (card) {
                const texto = card.textContent.toLowerCase();
                card.style.display = texto.includes(pesquisa.value.toLowerCase()) ? '' : 'none';
            });
        });
    }

    mostrarPets();
});
