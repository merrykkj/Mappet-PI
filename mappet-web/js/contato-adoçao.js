const usuario = MapPet.usuarioLogado();
const parametros = new URLSearchParams(window.location.search);
const id = Number(parametros.get("id"));

if (!usuario) {
    const destino = "./contato-adocao.html?id=" + encodeURIComponent(id);
    sessionStorage.setItem("mappetDestinoLogin", destino);
    window.location.replace("./login.html");
} else {
    const animais = [
        { id: 1, nome: "Pipoca", imagem: "./assets/images/pipoca.jpg", cidade: "São Paulo", bairro: "Ipiranga" },
        { id: 2, nome: "Mel", imagem: "./assets/images/mel.jpg", cidade: "São Paulo", bairro: "Sacomã" },
        { id: 3, nome: "Thor", imagem: "./assets/images/thor.webp", cidade: "São Paulo", bairro: "Mooca" },
        { id: 4, nome: "Luna", imagem: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80", cidade: "São Paulo", bairro: "Vila Mariana" },
        { id: 5, nome: "Bento", imagem: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80", cidade: "Santo André", bairro: "Centro" },
        { id: 6, nome: "Amora", imagem: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=800&auto=format&fit=crop&q=80", cidade: "São Bernardo do Campo", bairro: "Rudge Ramos" }
    ];

    let animal = null;
    for (let i = 0; i < animais.length; i++) {
        if (animais[i].id === id) {
            animal = animais[i];
            break;
        }
    }

    const detalhes = document.getElementById("detalhesAdocao");

    if (!animal) {
        detalhes.innerHTML = '<div class="dados"><h2>Animal não encontrado</h2><p>Volte à lista de adoção e escolha um pet.</p><a class="botao" href="./adocao.html">Ver animais</a></div>';
    } else {
        detalhes.innerHTML = `
            <img class="foto" src="${animal.imagem}" alt="Foto de ${animal.nome}">
            <div class="dados">
                <span class="subtitulo">Você escolheu conhecer</span>
                <h2>${animal.nome}</h2>
                <p class="local"><i class="fa-solid fa-location-dot"></i> ${animal.bairro}, ${animal.cidade}</p>
                <div class="separador"></div>
                <h3>Informações do responsável</h3>
                <div class="informacao"><i class="fa-solid fa-user"></i><div><strong>Nome</strong><span>Não informado</span></div></div>
                <div class="informacao"><i class="fa-solid fa-phone"></i><div><strong>Telefone</strong><span>Não informado</span></div></div>
                <div class="informacao"><i class="fa-solid fa-envelope"></i><div><strong>E-mail</strong><span>Não informado</span></div></div>
                <p class="aviso"><i class="fa-solid fa-circle-info"></i> Este pet é demonstrativo. Os dados de contato estarão disponíveis quando os anúncios reais forem cadastrados com seus responsáveis.</p>
                <a class="botao" href="./adocao.html">Conhecer outros pets</a>
            </div>
        `;
    }
}
