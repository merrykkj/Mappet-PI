document.addEventListener('DOMContentLoaded', function () {
    const lista = document.getElementById('listaAnimais');
    const vazio = document.getElementById('vazioAnimais');
    const busca = document.getElementById('buscaAnimais');
    const especie = document.getElementById('filtroEspecie');
    const local = document.getElementById('filtroLocal');
    const ordem = document.getElementById('filtroOrdem');
    document.querySelectorAll('[data-requer-login]').forEach(function (link) {
        if (typeof MapPet === 'undefined' || !MapPet.usuarioLogado()) {
            link.href = './login.html';
        }
    });
    let tipoAtual = 'perdido';
    let anuncios = [];

    function seguro(valor) {
        return String(valor == null ? '' : valor).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function normalizar(valor) {
        return String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    }

    function carregar() {
        anuncios = [];
        const usuarios = typeof MapPet !== 'undefined' ? MapPet.usuarios() : [];
        usuarios.forEach(function (usuario) {
            (Array.isArray(usuario.pets) ? usuario.pets : []).forEach(function (pet) {
                if ((pet.tipo === 'perdido' || pet.tipo === 'encontrado') && !pet.reencontrado) {
                    anuncios.push({ pet: pet, responsavel: usuario });
                }
            });
        });
        document.getElementById('quantidadePerdidos').textContent = anuncios.filter(function (item) { return item.pet.tipo === 'perdido'; }).length;
        document.getElementById('quantidadeEncontrados').textContent = anuncios.filter(function (item) { return item.pet.tipo === 'encontrado'; }).length;
        renderizar();
    }

    function categoria(pet) {
        const valor = normalizar(pet.especie + ' ' + (pet.nome || '') + ' ' + (pet.descricao || ''));
        if (valor.includes('cachorro') || valor.includes('cao') || valor.includes('canino')) return 'cachorro';
        if (valor.includes('gato') || valor.includes('felino') || valor.includes('gatinho')) return 'gato';
        return 'outros';
    }

    function renderizar() {
        const termo = normalizar(busca.value);
        const lugar = normalizar(local.value);
        const resultado = anuncios.filter(function (item) {
            const pet = item.pet;
            if (pet.tipo !== tipoAtual) return false;
            if (especie.value && categoria(pet) !== especie.value) return false;
            const endereco = normalizar([pet.local, pet.bairro, pet.cidade, pet.uf].join(' '));
            if (lugar && !endereco.includes(lugar)) return false;
            const conteudo = normalizar([pet.nome, pet.especie, pet.raca, pet.cor, pet.descricao, pet.detalhes, pet.local, pet.bairro, pet.cidade, pet.situacao].join(' '));
            return !termo || conteudo.includes(termo);
        });
        resultado.sort(function (a, b) {
            if (ordem.value === 'nome') return String(a.pet.nome || '').localeCompare(String(b.pet.nome || ''), 'pt-BR');
            const dataA = Number(String(a.pet.id).match(/^\d{13}/)?.[0]) || 0;
            const dataB = Number(String(b.pet.id).match(/^\d{13}/)?.[0]) || 0;
            return ordem.value === 'antigos' ? dataA - dataB : dataB - dataA;
        });
        document.getElementById('contadorResultados').textContent = resultado.length + (resultado.length === 1 ? ' anúncio encontrado' : ' anúncios encontrados');
        vazio.hidden = resultado.length > 0;
        lista.innerHTML = resultado.map(function (item) {
            const pet = item.pet;
            const foto = /^(data:image\/|https?:\/\/|\.\/|\/)/i.test(pet.foto || '') ? '<img src="' + seguro(pet.foto) + '" alt="Foto do pet" loading="lazy">' : '<div class="sem-foto"><i class="fa-solid fa-paw"></i></div>';
            const status = pet.tipo === 'perdido' ? 'PERDIDO' : 'ENCONTRADO';
            const icone = pet.tipo === 'perdido' ? 'fa-triangle-exclamation' : 'fa-circle-check';
            return '<article class="card-animal"><div class="foto-animal">' + foto + '<span class="status-animal ' + pet.tipo + '"><i class="fa-solid ' + icone + '"></i>' + status + '</span></div><div class="corpo-animal"><h3>' + seguro(pet.nome || 'Pet sem nome') + '</h3><div class="local-animal"><i class="fa-solid fa-location-dot"></i> ' + seguro(pet.local || [pet.bairro, pet.cidade].filter(Boolean).join(', ') || 'Local não informado') + '</div><p>' + seguro(pet.descricao || 'Sem descrição') + '</p><a class="detalhes-animal" href="./detalhes-pet.html?id=' + encodeURIComponent(pet.id) + '">Ver detalhes e contato</a></div></article>';
        }).join('');
    }

    document.querySelectorAll('.aba').forEach(function (botao) {
        botao.addEventListener('click', function () {
            tipoAtual = botao.dataset.tipo;
            document.querySelectorAll('.aba').forEach(function (item) {
                const ativo = item === botao;
                item.classList.toggle('ativa', ativo);
                item.setAttribute('aria-pressed', String(ativo));
            });
            renderizar();
        });
    });
    [busca, local].forEach(function (campo) { campo.addEventListener('input', renderizar); });
    [especie, ordem].forEach(function (campo) { campo.addEventListener('change', renderizar); });
    document.getElementById('limparBusca').addEventListener('click', function () {
        busca.value = '';
        local.value = '';
        especie.value = '';
        ordem.value = 'recentes';
        renderizar();
    });

    window.addEventListener('storage', carregar);
    carregar();
});
