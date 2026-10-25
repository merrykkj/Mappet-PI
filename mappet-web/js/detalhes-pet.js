document.addEventListener('DOMContentLoaded', function () {
    const conteudo = document.getElementById('conteudoPet');
    const id = new URLSearchParams(window.location.search).get('id');

    function seguro(valor) {
        return String(valor == null ? '' : valor).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function mostrar(valor) {
        return valor === undefined || valor === null || String(valor).trim() === '' ? 'Não informado' : seguro(valor);
    }

    function campo(titulo, valor) {
        return '<div class="detalhe-campo"><strong>' + titulo + '</strong><span>' + mostrar(valor) + '</span></div>';
    }

    function erro() {
        conteudo.innerHTML = '<section class="detalhe-indisponivel"><i class="fa-solid fa-paw"></i><h1>Publicação indisponível</h1><p>O anúncio não existe mais ou não foi encontrado.</p></section>';
    }

    if (!id || typeof MapPet === 'undefined') {
        erro();
        return;
    }

    let encontrado = null;
    MapPet.usuarios().forEach(function (usuario) {
        (Array.isArray(usuario.pets) ? usuario.pets : []).forEach(function (pet) {
            if (String(pet.id) === id && (pet.tipo === 'perdido' || pet.tipo === 'encontrado') && !pet.reencontrado) {
                encontrado = { pet: pet, responsavel: usuario };
            }
        });
    });

    if (!encontrado) {
        erro();
        return;
    }

    const pet = encontrado.pet;
    const responsavel = encontrado.responsavel;
    const perdido = pet.tipo === 'perdido';
    const titulo = pet.nome || (perdido ? 'Pet perdido' : 'Pet encontrado');
    const telefone = String(pet.telefone || responsavel.telefone || '').trim();
    const email = String(pet.email || responsavel.email || '').trim();
    const telefoneLimpo = telefone.replace(/\D/g, '');
    const numero = telefoneLimpo.startsWith('55') ? telefoneLimpo : '55' + telefoneLimpo;
    const foto = /^(data:image\/|https?:\/\/|\.\/|\/)/i.test(pet.foto || '')
        ? '<img src="' + seguro(pet.foto) + '" alt="Foto de ' + seguro(titulo) + '">'
        : '<i class="fa-solid fa-paw" aria-label="Sem foto"></i>';
    const whatsapp = telefoneLimpo.length >= 10 && telefoneLimpo.length <= 13
        ? '<a class="detalhe-botao whatsapp" href="https://wa.me/' + numero + '" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp"></i> Conversar pelo WhatsApp</a>'
        : '';
    const emailLink = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? '<a class="detalhe-botao" href="mailto:' + seguro(email) + '"><i class="fa-regular fa-envelope"></i> Enviar e-mail</a>'
        : '';
    const idade = pet.idade || (pet.meses !== undefined && pet.meses !== null ? (Number(pet.meses) < 12 ? pet.meses + ' meses' : Math.floor(Number(pet.meses) / 12) + ' ano(s)') : '');
    const local = pet.local || [pet.bairro, pet.cidade, pet.uf].filter(Boolean).join(', ');

    document.title = 'MapPet | ' + titulo;
    conteudo.innerHTML = '<section class="detalhe-hero">'
        + '<div class="detalhe-foto">' + foto + '</div>'
        + '<div class="detalhe-resumo">'
        + '<span class="detalhe-status ' + seguro(pet.tipo) + '"><i class="fa-solid ' + (perdido ? 'fa-magnifying-glass-location' : 'fa-hand-holding-heart') + '"></i>' + (perdido ? 'ANIMAL PERDIDO' : 'ANIMAL ENCONTRADO') + '</span>'
        + '<h1>' + seguro(titulo) + '</h1>'
        + '<p class="detalhe-subtitulo">' + (perdido ? 'Ajude este pet a voltar para casa.' : 'Ajude a encontrar a família deste pet.') + '</p>'
        + '<p class="detalhe-local"><i class="fa-solid fa-location-dot"></i><span>' + mostrar(local) + '</span></p>'
        + '<p class="detalhe-data"><i class="fa-regular fa-calendar"></i> Publicado em ' + mostrar(pet.criadoEm) + '</p>'
        + '</div></section>'
        + '<section class="detalhe-grade"><div class="detalhe-coluna">'
        + '<article class="detalhe-card"><h2><i class="fa-solid fa-paw"></i> Informações do animal</h2><div class="detalhe-campos">'
        + campo('Nome / identificação', pet.nome)
        + campo('Espécie', pet.especie)
        + campo('Raça', pet.raca)
        + campo('Cor', pet.cor)
        + campo('Sexo', pet.sexo)
        + campo('Idade aproximada', idade)
        + campo('Porte', pet.porte)
        + campo('Situação em que foi encontrado', pet.situacao)
        + '</div></article>'
        + '<article class="detalhe-card"><h2><i class="fa-solid fa-file-lines"></i> Descrição e características</h2><p class="detalhe-descricao">' + mostrar(pet.descricao || pet.detalhes) + '</p></article>'
        + '<article class="detalhe-card"><h2><i class="fa-solid fa-location-dot"></i> Localização</h2><div class="detalhe-campos">'
        + campo('Último local informado', local)
        + campo('Bairro', pet.bairro)
        + campo('Cidade', pet.cidade)
        + campo('Estado (UF)', pet.uf)
        + '</div></article>'
        + '</div><aside class="detalhe-coluna">'
        + '<article class="detalhe-card"><h2><i class="fa-solid fa-address-card"></i> ' + (perdido ? 'Contato do tutor' : 'Contato de quem encontrou') + '</h2>'
        + '<div class="detalhe-campos">' + campo('Nome do responsável', responsavel.nome) + campo('Telefone', telefone) + campo('E-mail', email) + '</div>'
        + '<div class="detalhe-contato">' + whatsapp + emailLink + '</div></article>'
        + '<article class="detalhe-card detalhe-ajuda"><h2><i class="fa-solid fa-heart"></i> Como ajudar?</h2><p>'
        + (perdido ? 'Se você viu ou encontrou este animal, entre em contato com o tutor usando os dados acima. Compartilhar a publicação também pode ajudar.' : 'Se você conhece o tutor ou reconhece este animal, entre em contato com a pessoa responsável pelo anúncio.')
        + '</p></article></aside></section>';
});
