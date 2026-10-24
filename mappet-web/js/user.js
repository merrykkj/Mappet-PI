
document.addEventListener('DOMContentLoaded', function () {
    let usuario = MapPet.usuarioLogado();
    if (!usuario) {
        window.location.href = './login.html';
        return;
    }

    const menuPerfil = document.querySelector('.menu-perfil-dashboard');
    if (menuPerfil) {
        const botaoPerfil = menuPerfil.querySelector('.perfil-toggle');
        botaoPerfil.addEventListener('click', function () {
            const aberto = menuPerfil.classList.toggle('aberto');
            botaoPerfil.setAttribute('aria-expanded', String(aberto));
        });
        menuPerfil.querySelector('.perfil-sair').addEventListener('click', function () {
            localStorage.removeItem('mappetSessao');
            window.location.href = './index.html';
        });
    }

    if (!Array.isArray(usuario.pets)) usuario.pets = [];
    if (!usuario.configuracoes) usuario.configuracoes = {};
    const nome = usuario.nome.trim().split(' ')[0];
    document.getElementById('nome-usuario-sidebar').textContent = nome;
    document.getElementById('nome-usuario').textContent = nome;

    const listaPets = document.querySelector('#secao-perfil .grid-cards-pets');
    const listaHistorico = document.querySelector('#secao-pets .grid-cards-pets');
    const modal = document.getElementById('modal-edicao');
    let filtroAtual = 'todos';
    let petEditando = '';
    let idParaExcluir = '';
    let redirecionarAdocao = false;

    if (!document.getElementById('modal-publicacao')) {
        document.body.insertAdjacentHTML('beforeend', `<div id="modal-publicacao" class="modal-pet-overlay" role="dialog" aria-modal="true" aria-labelledby="titulo-publicacao" hidden><div class="modal-pet-caixa"><div class="modal-pet-simbolo sucesso"><i class="fa-solid fa-paw"></i></div><span class="modal-pet-etiqueta">MapPet • Tudo prontinho!</span><h3 id="titulo-publicacao">Anúncio publicado!</h3><p>Seu anúncio foi cadastrado com sucesso.</p><button type="button" id="btn-ok-publicacao" class="modal-pet-botao principal">Continuar</button></div></div>`);
    }

    if (!document.getElementById('modal-exclusao')) {
        document.body.insertAdjacentHTML('beforeend', `<div id="modal-exclusao" class="modal-pet-overlay" role="dialog" aria-modal="true" aria-labelledby="titulo-exclusao" hidden><div class="modal-pet-caixa"><div class="modal-pet-simbolo perigo"><i class="fa-solid fa-trash-can"></i></div><h3 id="titulo-exclusao">Excluir anúncio?</h3><p id="texto-exclusao"></p><div class="modal-pet-acoes"><button type="button" id="btn-cancelar-exclusao" class="modal-pet-botao secundario">Cancelar</button><button type="button" id="btn-confirmar-exclusao" class="modal-pet-botao excluir">Sim, excluir</button></div></div></div>`);
    }

    if (!document.getElementById('modal-erro-cadastro')) {
        document.body.insertAdjacentHTML('beforeend', `<div id="modal-erro-cadastro" class="modal-pet-overlay" role="alertdialog" aria-modal="true" aria-labelledby="titulo-erro-cadastro" aria-describedby="texto-erro-cadastro" hidden><div class="modal-pet-caixa"><div class="modal-pet-simbolo erro"><i class="fa-solid fa-circle-exclamation"></i></div><span class="modal-pet-etiqueta">MapPet • Atenção aos detalhes</span><h3 id="titulo-erro-cadastro">Ops! Faltam informações.</h3><p id="texto-erro-cadastro">Preencha os campos obrigatórios para continuar.</p><button type="button" id="btn-ok-erro-cadastro" class="modal-pet-botao principal">Entendi, vou preencher!</button></div></div>`);
    }

    const modalPublicacao = document.getElementById('modal-publicacao');
    const modalExclusao = document.getElementById('modal-exclusao');
    const modalErroCadastro = document.getElementById('modal-erro-cadastro');
    let campoPendente = null;

    function abrirModalPet(elemento) {
        elemento.hidden = false;
        elemento.querySelector('button').focus();
    }

    function fecharModalPet(elemento) {
        elemento.hidden = true;
    }

    function mostrarErroCadastro(mensagem, input) {
        document.getElementById('texto-erro-cadastro').textContent = mensagem;
        campoPendente = input || null;
        abrirModalPet(modalErroCadastro);
    }

    document.getElementById('btn-ok-erro-cadastro').addEventListener('click', function () {
        fecharModalPet(modalErroCadastro);
        if (campoPendente) campoPendente.focus();
        campoPendente = null;
    });

    document.getElementById('btn-ok-publicacao').addEventListener('click', function () {
        fecharModalPet(modalPublicacao);
        if (redirecionarAdocao) {
            redirecionarAdocao = false;
            window.location.href = './adocao.html#encontrar-pet';
        }
    });

    document.getElementById('btn-cancelar-exclusao').addEventListener('click', function () {
        fecharModalPet(modalExclusao);
        idParaExcluir = '';
    });

    document.getElementById('btn-confirmar-exclusao').addEventListener('click', function () {
        const id = idParaExcluir;
        const pet = usuario.pets.find(function (item) { return item.id === id; });
        if (pet) {
            usuario.pets = usuario.pets.filter(function (item) { return item.id !== id; });
            if (pet.tipo === 'adocao') usuario.adocoes = (usuario.adocoes || []).filter(function (item) { return item.id !== id; });
            salvar();
        }
        idParaExcluir = '';
        fecharModalPet(modalExclusao);
    });

    [modalPublicacao, modalExclusao, modalErroCadastro].forEach(function (elemento) {
        elemento.addEventListener('click', function (evento) {
            if (evento.target === elemento) {
                if (elemento === modalPublicacao && redirecionarAdocao) return;
                fecharModalPet(elemento);
                if (elemento === modalExclusao) idParaExcluir = '';
            }
        });
    });

    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape') {
            if (!modalPublicacao.hidden && redirecionarAdocao) return;
            fecharModalPet(modalPublicacao);
            fecharModalPet(modalExclusao);
            fecharModalPet(modalErroCadastro);
            idParaExcluir = '';
        }
    });

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

        let status = pet.tipo === 'perdido' ? 'Perdido' : pet.tipo === 'adocao' ? 'Adoção' : 'Encontrado';
        if (pet.reencontrado) status = 'Reencontrado';

        let foto = '<div class="sem-foto-pet"><i class="fa-solid fa-paw"></i></div>';
        if (pet.foto) foto = '<img src="' + pet.foto + '" alt="Foto do pet">';

        let botoes = '';
        if (!historico) {
            botoes = '<div class="acoes-card-pet">' +
                '<button class="btn-editar" data-acao="editar">Editar</button>' +
                '<button class="btn-excluir" data-acao="excluir">Excluir</button>' +
                (pet.tipo === 'adocao' ? '<a class="btn-editar" href="./contato-adocao.html?id=' + encodeURIComponent(pet.id) + '">Ver anúncio</a>' : '<button class="btn-editar" data-acao="reencontrar">Marcar reencontro</button>') +
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
        let adocoes = 0;
        let exibidos = 0;

        usuario.pets.forEach(function (pet) {
            if (pet.reencontrado && pet.tipo !== 'adocao') {
                reencontros++;
                listaHistorico.appendChild(criarCard(pet, true));
            } else {
                ativos++;
                if (pet.tipo === 'perdido') perdidos++;
                else if (pet.tipo === 'encontrado') encontrados++;
                else adocoes++;

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
            else if (texto === 'adoção') filtroAtual = 'adocao';
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

    const cadastro = new URLSearchParams(window.location.search).get('cadastro');
    if (cadastro === 'perdido' || cadastro === 'encontrado') {
        const botaoCadastro = document.querySelector('[data-target="secao-cadastro-animal"]');
        const botaoTipo = document.querySelector('.btn-tipo-cadastro[data-tipo="' + cadastro + '"]');
        if (botaoCadastro && botaoTipo) {
            botaoCadastro.click();
            botaoTipo.click();
        }
    }

    function campo(id) {
        return document.getElementById(id).value.trim();
    }

    function lerFoto(arquivo, callback) {
        if (!arquivo || !arquivo.type.startsWith('image/')) {
            alert('Selecione uma foto válida.');
            return;
        }
        if (arquivo.size > 750000) {
            alert('A foto precisa ter menos de 750 KB.');
            return;
        }
        const leitor = new FileReader();
        leitor.onload = function () { callback(leitor.result); };
        leitor.readAsDataURL(arquivo);
    }

    document.querySelectorAll('.upload-container input[type="file"]').forEach(function (input) {
        input.addEventListener('change', function () {
            const preview = input.parentElement.querySelector('.preview-foto');
            if (!input.files[0]) {
                preview.hidden = true;
                preview.removeAttribute('src');
                return;
            }
            lerFoto(input.files[0], function (foto) {
                preview.src = foto;
                preview.hidden = false;
            });
        });
    });

    function publicarPet(evento, tipo) {
        evento.preventDefault();
        const formulario = evento.target;
        const obrigatorios = formulario.querySelectorAll('[required]');
        const campos = formulario.querySelectorAll('input:not([type="file"]), textarea, select');
        const fotoInput = formulario.querySelector('input[type="file"]');
        const preenchidos = Array.from(campos).filter(function (input) {
            return input.value.trim() !== '' && (input.tagName !== 'SELECT' || input.selectedIndex > 0);
        });

        if (preenchidos.length === 0 && (!fotoInput || !fotoInput.files.length)) {
            mostrarErroCadastro('Para publicar seu anúncio, preencha os campos obrigatórios e adicione uma foto do bichinho.', fotoInput);
            return;
        }

        for (const input of obrigatorios) {
            if (!input.checkValidity() || (input.type !== 'file' && !input.value.trim())) {
                const label = formulario.querySelector('label[for="' + input.id + '"]');
                const nomeCampo = label ? label.textContent.trim() : 'campo obrigatório';
                mostrarErroCadastro(input.type === 'file' ? 'Adicione uma foto do bichinho para publicar seu anúncio.' : 'Preencha corretamente o campo: ' + nomeCampo + '.', input);
                return;
            }
        }

        let pet = {
            id: String(Date.now()) + String(Math.random()),
            tipo: tipo,
            foto: '',
            reencontrado: false,
            criadoEm: new Date().toLocaleDateString('pt-BR')
        };

        if (tipo === 'perdido') {
            pet.nome = campo('nome-pet-perdido');
            pet.especie = campo('especie-pet-perdido');
            pet.local = campo('local-pet-perdido');
            pet.descricao = campo('detalhes-pet-perdido');
        } else if (tipo === 'encontrado') {
            pet.nome = campo('aparencia-pet-encontrado');
            pet.especie = 'Pet encontrado';
            pet.local = campo('local-pet-encontrado');
            pet.descricao = campo('observacoes-pet-encontrado');
            pet.situacao = campo('situacao-pet-encontrado');
        } else {
            pet.nome = campo('nome-pet-adocao');
            pet.especie = campo('especie-pet-adocao');
            pet.raca = campo('raca-pet-adocao');
            pet.sexo = campo('sexo-pet-adocao');
            pet.meses = Number(campo('idade-pet-adocao'));
            pet.porte = campo('porte-pet-adocao');
            pet.cor = campo('cor-pet-adocao');
            pet.cidade = campo('cidade-pet-adocao');
            pet.bairro = campo('bairro-pet-adocao');
            pet.telefone = campo('telefone-pet-adocao');
            pet.email = campo('email-pet-adocao');
            pet.descricao = campo('detalhes-pet-adocao');
            pet.local = pet.bairro + ', ' + pet.cidade;
            pet.donoId = usuario.id;
        }

        if (!pet.nome || !pet.local || !pet.descricao) {
            mostrarErroCadastro('Preencha as informações do pet, a localização e a descrição antes de publicar.');
            return;
        }

        const arquivo = document.getElementById('foto-pet-' + tipo).files[0];
        lerFoto(arquivo, function (foto) {
            pet.foto = foto;
            if (!Array.isArray(usuario.pets)) usuario.pets = [];
            usuario.pets.push(pet);
            if (tipo === 'adocao') {
                if (!Array.isArray(usuario.adocoes)) usuario.adocoes = [];
                usuario.adocoes.push(pet);
            }
            try {
                MapPet.salvarUsuario(usuario);
                mostrarPets();
                formulario.reset();
                const preview = formulario.querySelector('.preview-foto');
                if (preview) {
                    preview.hidden = true;
                    preview.removeAttribute('src');
                }
                document.querySelector('[data-target="secao-perfil"]').click();
                redirecionarAdocao = tipo === 'adocao';

                const etiqueta = modalPublicacao.querySelector('.modal-pet-etiqueta');
                const titulo = modalPublicacao.querySelector('h3');
                const mensagem = modalPublicacao.querySelector('p');
                const botao = document.getElementById('btn-ok-publicacao');

                if (tipo === 'perdido') {
                    etiqueta.textContent = 'MapPet • Estamos com você!';
                    titulo.textContent = 'Vamos encontrar seu pet!';
                    mensagem.textContent = 'Seu anúncio foi publicado com sucesso! Esperamos que seu companheirinho volte para casa o mais rápido possível.';
                    botao.textContent = 'Continuar';
                } else if (tipo === 'encontrado') {
                    etiqueta.textContent = 'MapPet • Um gesto de carinho!';
                    titulo.textContent = 'Obrigado por ajudar!';
                    mensagem.textContent = 'Seu anúncio foi publicado com sucesso! Sua atitude pode ajudar esse bichinho a reencontrar sua família.';
                    botao.textContent = 'Que alegria! ♥';
                } else {
                    etiqueta.textContent = 'MapPet • Um novo começo!';
                    titulo.textContent = 'Anúncio publicado!';
                    mensagem.textContent = 'Seu anúncio foi publicado com sucesso! Agora esse bichinho está mais perto de encontrar um lar cheio de amor.';
                    botao.textContent = 'Que alegria! ♥';
                }

                abrirModalPet(modalPublicacao);
            } catch (erro) {
                usuario.pets.pop();
                if (tipo === 'adocao') usuario.adocoes.pop();
                alert('Não foi possível salvar o anúncio. Verifique o espaço disponível no navegador e tente uma foto menor.');
            }
        });
    }

    ['perdido', 'encontrado', 'adocao'].forEach(function (tipo) {
        document.getElementById('form-pet-' + tipo).addEventListener('submit', function (evento) {
            publicarPet(evento, tipo);
        });
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
            idParaExcluir = id;
            document.getElementById('texto-exclusao').textContent = 'Tem certeza de que deseja excluir a publicação de ' + pet.nome + '? Essa ação não pode ser desfeita.';
            abrirModalPet(modalExclusao);
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
        if (pet.tipo === 'adocao') {
            const registro = (usuario.adocoes || []).find(function (item) { return item.id === pet.id; });
            if (registro) Object.assign(registro, pet);
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
