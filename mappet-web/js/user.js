document.addEventListener('DOMContentLoaded', () => {
    const botoesMenu = document.querySelectorAll('.menu-lateral .menu-item');
    const secoes = document.querySelectorAll('.painel-secao');

    botoesMenu.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesMenu.forEach(b => b.classList.remove('ativo'));
            secoes.forEach(s => s.classList.remove('ativo'));

            botao.classList.add('ativo');

            const targetId = botao.getAttribute('data-target');
            const secaoAlvo = document.getElementById(targetId);
            
            if (secaoAlvo) {
                secaoAlvo.classList.add('ativo');
            }
        });
    });

    const botoesTipoCadastro = document.querySelectorAll('.btn-tipo-cadastro');
    const formPerdido = document.getElementById('form-pet-perdido');
    const formEncontrado = document.getElementById('form-pet-encontrado');

    botoesTipoCadastro.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesTipoCadastro.forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');

            const tipo = botao.getAttribute('data-tipo');

            if (tipo === 'perdido') {
                formPerdido.classList.add('ativo');
                formEncontrado.classList.remove('ativo');
            } else if (tipo === 'encontrado') {
                formEncontrado.classList.add('ativo');
                formPerdido.classList.remove('ativo');
            }
        });
    });

    const botoesFiltro = document.querySelectorAll('.filtros-publicacoes .filtro-btn');
    const cardsPets = document.querySelectorAll('#secao-perfil .grid-cards-pets .card-pet');

    botoesFiltro.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesFiltro.forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');

            const categoria = botao.textContent.trim().toLowerCase();

            cardsPets.forEach(card => {
                const textoCard = card.innerText.toLowerCase();
                let deveMostrar = false;

                if (categoria === 'todos') {
                    deveMostrar = true;
                } else if (categoria === 'perdidos') {
                    if (textoCard.includes('desapareceu') || textoCard.includes('perdido')) {
                        deveMostrar = true;
                    }
                } else if (categoria === 'encontrados') {
                    if (textoCard.includes('encontrei') || textoCard.includes('avistado')) {
                        deveMostrar = true;
                    }
                }

                if (deveMostrar) {
                    card.classList.remove('filtrado-oculto');
                    card.style.display = 'flex';
                } else {
                    card.classList.add('filtrado-oculto');
                    
                    setTimeout(() => {
                        if (card.classList.contains('filtrado-oculto')) {
                            card.style.display = 'none';
                        }
                    }, 400);
                }
            });
        });
    });

    const modalEdicao = document.getElementById('modal-edicao');
    const btnFecharModal = document.querySelector('.btn-fechar-modal');
    const btnCancelarModal = document.querySelector('.btn-cancelar-modal');
    const btnSalvarModal = document.querySelector('.btn-salvar-modal');
    
    const modalCardId = document.getElementById('modal-card-id');
    const modalInputTitulo = document.getElementById('modal-input-titulo');
    const modalInputLocal = document.getElementById('modal-input-local');
    const modalTextareaDesc = document.getElementById('modal-textarea-desc');

    let cardAtualParaEditar = null;

    const botoesEditar = document.querySelectorAll('#secao-perfil .card-pet .btn-editar');

    botoesEditar.forEach(btn => {
        btn.addEventListener('click', () => {
            cardAtualParaEditar = btn.closest('.card-pet');
            
            const titulo = cardAtualParaEditar.querySelector('.card-titulo-pet').textContent;
            const descricao = cardAtualParaEditar.querySelector('.card-desc-pet').textContent;
            const local = cardAtualParaEditar.querySelector('.card-local-pet').textContent;

            modalInputTitulo.value = titulo;
            modalInputLocal.value = local;
            modalTextareaDesc.value = descricao;

            modalEdicao.classList.add('ativo');
        });
    });

    function fecharModal() {
        modalEdicao.classList.remove('ativo');
        cardAtualParaEditar = null;
    }

    btnFecharModal.addEventListener('click', fecharModal);
    btnCancelarModal.addEventListener('click', fecharModal);

    modalEdicao.addEventListener('click', (e) => {
        if (e.target === modalEdicao) {
            fecharModal();
        }
    });

    btnSalvarModal.addEventListener('click', () => {
        if (cardAtualParaEditar) {
            cardAtualParaEditar.querySelector('.card-titulo-pet').textContent = modalInputTitulo.value;
            cardAtualParaEditar.querySelector('.card-desc-pet').textContent = modalTextareaDesc.value;
            cardAtualParaEditar.querySelector('.card-local-pet').textContent = modalInputLocal.value;
        }
        fecharModal();
    });
});