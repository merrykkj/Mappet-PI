document.addEventListener('DOMContentLoaded', function () {
    const area = document.getElementById('detalhesAdocao');
    const id = new URLSearchParams(window.location.search).get('id');
    const animaisDemonstrativos = [
    {
        id: 1,
        nome: "Pipoca",
        especie: "Cachorro",
        cidade: "São Paulo",
        bairro: "Ipiranga",
        porte: "Médio",
        cor: "Branco",
        sexo: "Macho",
        idade: "Adulto",
        meses: 24,
        descricao: "Muito brincalhão, se dá bem com outros cachorros e adora passear no parque.",
        imagem: "./assets/images/pipoca.jpg"
    },
    {
        id: 2,
        nome: "Mel",
        especie: "Cachorro",
        cidade: "São Paulo",
        bairro: "Sacomã",
        porte: "Pequeno",
        cor: "Caramelo",
        sexo: "Fêmea",
        idade: "Adulto",
        meses: 12,
        descricao: "Carinhosa, dócil e ama um cafuné. Ideal para quem mora em apartamento.",
        imagem: "./assets/images/mel.jpg"
    },
    {
        id: 3,
        nome: "Thor",
        especie: "Cachorro",
        cidade: "São Paulo",
        bairro: "Mooca",
        porte: "Grande",
        cor: "Marrom",
        sexo: "Macho",
        idade: "Adulto",
        meses: 36,
        descricao: "Protetor, calmo e muito leal. Já está castrado e com todas as vacinas em dia.",
        imagem: "./assets/images/thor.webp"
    },
    {
        id: 4,
        nome: "Luna",
        especie: "Gato",
        cidade: "São Paulo",
        bairro: "Vila Mariana",
        porte: "Pequeno",
        cor: "Preto",
        sexo: "Fêmea",
        idade: "Adulto",
        meses: 24,
        descricao: "Uma gatinha tranquila e carinhosa que adora ficar pertinho das pessoas.",
        imagem: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80"
    },
    {
        id: 5,
        nome: "Bento",
        especie: "Cachorro",
        cidade: "Santo André",
        bairro: "Centro",
        porte: "Médio",
        cor: "Branco",
        sexo: "Macho",
        idade: "Filhote",
        meses: 8,
        descricao: "Cheio de energia, adora brincar e fazer novos amigos.",
        imagem: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80"
    },
    {
        id: 6,
        nome: "Amora",
        especie: "Gato",
        cidade: "São Bernardo do Campo",
        bairro: "Rudge Ramos",
        porte: "Pequeno",
        cor: "Rajado",
        sexo: "Fêmea",
        idade: "Adulto",
        meses: 30,
        descricao: "Delicada, curiosa e muito companheira. Procura um lar cheio de carinho.",
        imagem: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&auto=format&fit=crop&q=80"
    }
];;

    function seguro(valor) {
        return String(valor == null ? '' : valor).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function mostrar(valor) {
        return valor === undefined || valor === null || String(valor).trim() === '' ? 'Não informado' : seguro(valor);
    }

    function campo(nome, valor) {
        return '<div class="dado"><small>' + nome + '</small><strong>' + mostrar(valor) + '</strong></div>';
    }

    function idadePet(pet) {
        if (pet.meses === undefined || pet.meses === null || pet.meses === '') return pet.idade || '';
        const meses = Number(pet.meses);
        if (isNaN(meses)) return pet.idade || '';
        if (meses < 12) return meses + (meses === 1 ? ' mês' : ' meses');
        const anos = Math.floor(meses / 12);
        const resto = meses % 12;
        return anos + (anos === 1 ? ' ano' : ' anos') + (resto ? ' e ' + resto + (resto === 1 ? ' mês' : ' meses') : '');
    }

    function indisponivel() {
        area.innerHTML = '<div class="indisponivel"><h1>Publicação indisponível</h1><p>Não encontramos esse animal.</p><a href="./adocao.html">Ver outros animais</a></div>';
    }

    if (!id) {
        indisponivel();
        return;
    }

    let pet = null;
    let responsavel = {};
    const usuarios = typeof MapPet !== 'undefined' ? MapPet.usuarios() : [];

    usuarios.forEach(function (usuario) {
        const adocoes = Array.isArray(usuario.adocoes) ? usuario.adocoes : [];
        const pets = Array.isArray(usuario.pets) ? usuario.pets.filter(function (item) { return item.tipo === 'adocao'; }) : [];
        adocoes.concat(pets).forEach(function (item) {
            if (!pet && String(item.id) === String(id)) {
                pet = item;
                responsavel = usuario;
            }
        });
    });

    if (!pet && id.startsWith('demo-')) {
        pet = animaisDemonstrativos.find(function (item) { return 'demo-' + item.id === id; }) || null;
    }

    if (!pet) {
        indisponivel();
        return;
    }

    const nome = pet.nome || 'Pet para adoção';
    const local = pet.local || [pet.bairro, pet.cidade, pet.uf].filter(Boolean).join(', ');
    const fotoUrl = String(pet.foto || pet.imagem || pet.fotoUrl || '');
    const fotoValida = /^(data:image\/(png|jpeg|jpg|webp|gif);base64,|https?:\/\/|\.\/|\/)/i.test(fotoUrl);
    const foto = fotoValida ? '<div class="foto-pet"><img src="' + seguro(fotoUrl) + '" alt="Foto de ' + seguro(nome) + '"></div>' : '<div class="foto-pet sem-foto"><i class="fa-solid fa-paw"></i></div>';
    const telefone = String(pet.telefone || pet.responsavelTel || responsavel.telefone || '').trim();
    const email = String(pet.email || pet.responsavelEmail || responsavel.email || '').trim();
    const dono = pet.responsavelNome || responsavel.nome || responsavel.nomeCompleto || '';
    const digitos = telefone.replace(/\D/g, '');
    const numero = digitos.startsWith('55') ? digitos : '55' + digitos;
    const telefoneValido = digitos.length >= 10 && digitos.length <= 13;
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    let acoes = '';

    if (telefoneValido) {
        acoes += '<a class="botao-contato whatsapp" target="_blank" rel="noopener noreferrer" href="https://wa.me/' + numero + '?text=' + encodeURIComponent('Olá! Vi o anúncio de ' + nome + ' no MapPet e gostaria de saber mais sobre a adoção.') + '"><i class="fa-brands fa-whatsapp"></i> Conversar pelo WhatsApp</a>';
        acoes += '<a class="botao-contato" href="tel:+' + numero + '"><i class="fa-solid fa-phone"></i> Ligar</a>';
    }
    if (emailValido) {
        acoes += '<a class="botao-contato" href="mailto:' + seguro(email) + '?subject=' + encodeURIComponent('Adoção de ' + nome + ' - MapPet') + '"><i class="fa-solid fa-envelope"></i> Enviar e-mail</a>';
    }

    document.title = 'MapPet | Adoção de ' + nome;
    area.innerHTML = `
        <div class="abertura">
            <div>
                <span class="selo-adocao"><i class="fa-solid fa-heart"></i> Disponível para adoção</span>
                <h1>Conheça ${seguro(nome)}</h1>
                <p>Veja as informações e converse com o responsável.</p>
            </div>
            <span class="abertura-local"><i class="fa-solid fa-location-dot"></i> ${mostrar(local)}</span>
        </div>
        <div class="pagina-grid">
            <div class="coluna-principal">
                <section class="cartao apresentacao-pet">
                    ${foto}
                    <div class="dados-destaque">
                        <h2>${seguro(nome)}</h2>
                        <p>${mostrar(pet.descricao || pet.detalhes)}</p>
                        <div class="resumo-tags">
                            <span><i class="fa-solid fa-paw"></i> ${mostrar(pet.especie)}</span>
                            <span><i class="fa-solid fa-cake-candles"></i> ${mostrar(idadePet(pet))}</span>
                            <span><i class="fa-solid fa-venus-mars"></i> ${mostrar(pet.sexo)}</span>
                        </div>
                    </div>
                </section>
                <section class="cartao">
                    <h2><i class="fa-solid fa-list-check"></i> Informações do animal</h2>
                    <div class="dados-grade">
                        ${campo('Nome', pet.nome)}
                        ${campo('Espécie', pet.especie)}
                        ${campo('Raça', pet.raca)}
                        ${campo('Cor', pet.cor)}
                        ${campo('Sexo', pet.sexo)}
                        ${campo('Idade', idadePet(pet))}
                        ${campo('Porte', pet.porte)}
                        ${campo('Publicado em', pet.criadoEm)}
                    </div>
                </section>
                <section class="cartao">
                    <h2><i class="fa-solid fa-book-open"></i> Sobre o pet</h2>
                    <p class="texto-descricao">${mostrar(pet.descricao || pet.detalhes)}</p>
                </section>
                <section class="cartao">
                    <h2><i class="fa-solid fa-location-dot"></i> Localização</h2>
                    <div class="dados-grade">
                        ${campo('Bairro', pet.bairro)}
                        ${campo('Cidade', pet.cidade)}
                        ${campo('Estado', pet.uf)}
                        ${campo('Região informada', local)}
                    </div>
                </section>
            </div>
            <aside class="coluna-lateral">
                <section class="cartao">
                    <h2><i class="fa-solid fa-address-card"></i> Responsável pela adoção</h2>
                    <div class="responsavel-perfil"><div class="avatar"><i class="fa-solid fa-user"></i></div><div><strong>${mostrar(dono)}</strong><span>Responsável pelo anúncio</span></div></div>
                    <div class="contato-linha"><i class="fa-solid fa-phone"></i><div><small>Telefone / WhatsApp</small><strong>${mostrar(telefone)}</strong></div></div>
                    <div class="contato-linha"><i class="fa-solid fa-envelope"></i><div><small>E-mail</small><strong>${mostrar(email)}</strong></div></div>
                    <div class="contato-linha"><i class="fa-solid fa-location-dot"></i><div><small>Localização</small><strong>${mostrar(local)}</strong></div></div>
                    <div class="contato-acoes">${acoes || '<p class="texto-descricao">Nenhum contato foi informado neste anúncio.</p>'}</div>
                </section>
                <section class="cartao aviso-seguranca">
                    <h2><i class="fa-solid fa-heart"></i> Adoção responsável</h2>
                    <p>Converse com o responsável, tire suas dúvidas e conheça as necessidades do animal antes de adotar. Evite pagamentos antecipados.</p>
                </section>
            </aside>
        </div>`;
    const imagem = area.querySelector(".foto-pet img");
    if (imagem) imagem.addEventListener("error", function () { imagem.parentElement.classList.add("sem-foto"); imagem.remove(); imagem.parentElement.innerHTML = '<i class="fa-solid fa-paw"></i>'; });
});
