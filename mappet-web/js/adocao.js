
const animaisDemo = [
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
];

function carregarAnimais() {
    const lista = animaisDemo.map(function (item) { return Object.assign({}, item, {id:'demo-' + item.id, demonstrativo:true}); });
    if (typeof MapPet !== 'undefined') {
        MapPet.usuarios().forEach(function (usuario) {
            const publicacoes = [].concat(Array.isArray(usuario.pets) ? usuario.pets : [], Array.isArray(usuario.adocoes) ? usuario.adocoes : []);
            publicacoes.forEach(function (pet) {
                if (pet.tipo !== 'adocao' || lista.some(function (item) { return String(item.id) === String(pet.id); })) return;
                lista.push(Object.assign({}, pet, { imagem:pet.foto || pet.imagem || '', idade:Number(pet.meses) < 12 ? 'Filhote' : 'Adulto', demonstrativo:false }));
            });
        });
    }
    return lista;
}
const animais = carregarAnimais();
function seguro(valor) {
    return String(valor == null ? '' : valor).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

const busca = document.getElementById("busca");
const especie = document.getElementById("especie");
const cidade = document.getElementById("cidade");
const bairro = document.getElementById("bairro");
const cor = document.getElementById("cor");
const porte = document.getElementById("porte");
const sexo = document.getElementById("sexo");
const idade = document.getElementById("idade");
const ordenacao = document.getElementById("ordenacao");

const gridAnimais = document.getElementById("gridAnimais");
const totalAnimais = document.getElementById("totalAnimais");
const semResultados = document.getElementById("semResultados");
const filtrosAtivos = document.getElementById("filtrosAtivos");

const modalFundo = document.getElementById("modalFundo");
const modalConteudo = document.getElementById("modalConteudo");

function preencherCidades() {
    for (let i = 0; i < animais.length; i++) {
        const nomeCidade = animais[i].cidade;
        let existe = false;

        for (let j = 0; j < cidade.options.length; j++) {
            if (cidade.options[j].value === nomeCidade) {
                existe = true;
            }
        }

        if (!existe) {
            cidade.innerHTML += `<option value="${nomeCidade}">${nomeCidade}</option>`;
        }
    }
}

function preencherCores() {
    for (let i = 0; i < animais.length; i++) {
        const nomeCor = animais[i].cor;
        let existe = false;

        for (let j = 0; j < cor.options.length; j++) {
            if (cor.options[j].value === nomeCor) {
                existe = true;
            }
        }

        if (!existe) {
            cor.innerHTML += `<option value="${nomeCor}">${nomeCor}</option>`;
        }
    }
}

function preencherBairros() {
    const bairroSelecionado = bairro.value;

    bairro.innerHTML = `<option value="">Todos os bairros</option>`;

    for (let i = 0; i < animais.length; i++) {
        const animal = animais[i];

        if (cidade.value !== "" && animal.cidade !== cidade.value) {
            continue;
        }

        let existe = false;

        for (let j = 0; j < bairro.options.length; j++) {
            if (bairro.options[j].value === animal.bairro) {
                existe = true;
            }
        }

        if (!existe) {
            bairro.innerHTML += `<option value="${seguro(animal.bairro)}">${seguro(animal.bairro)}</option>`;
        }
    }

    for (let i = 0; i < bairro.options.length; i++) {
        if (bairro.options[i].value === bairroSelecionado) {
            bairro.value = bairroSelecionado;
        }
    }
}

function formatarIdade(meses) {
    if (meses < 12) {
        return meses + (meses === 1 ? " mês" : " meses");
    }

    const anos = Math.floor(meses / 12);

    return anos + (anos === 1 ? " ano" : " anos");
}

function filtrarAnimais() {
    let resultado = [];

    for (let i = 0; i < animais.length; i++) {
        const animal = animais[i];

        if (busca.value !== "" &&
            !animal.nome.toLowerCase().includes(busca.value.trim().toLowerCase())) {
            continue;
        }

        if (especie.value !== "" && animal.especie !== especie.value) {
            continue;
        }

        if (cidade.value !== "" && animal.cidade !== cidade.value) {
            continue;
        }

        if (bairro.value !== "" && animal.bairro !== bairro.value) {
            continue;
        }

        if (cor.value !== "" && animal.cor !== cor.value) {
            continue;
        }

        if (porte.value !== "" && animal.porte !== porte.value) {
            continue;
        }

        if (sexo.value !== "" && animal.sexo !== sexo.value) {
            continue;
        }

        if (idade.value !== "" && animal.idade !== idade.value) {
            continue;
        }

        resultado.push(animal);
    }

    if (ordenacao.value === "nome") {
        resultado.sort(function(a, b) {
            return a.nome.localeCompare(b.nome);
        });
    }

    if (ordenacao.value === "idade") {
        resultado.sort(function(a, b) {
            return a.meses - b.meses;
        });
    }

    if (ordenacao.value === "recentes") {
        resultado.sort(function(a, b) {
            return Number(b.criadoTimestamp || (b.demonstrativo ? 0 : String(b.id).split('.')[0])) - Number(a.criadoTimestamp || (a.demonstrativo ? 0 : String(a.id).split('.')[0]));
        });
    }

    mostrarAnimais(resultado);
    mostrarFiltrosAtivos();
}

function mostrarAnimais(lista) {
    gridAnimais.innerHTML = "";
    totalAnimais.textContent = lista.length;

    if (lista.length === 0) {
        semResultados.hidden = false;
        return;
    }

    semResultados.hidden = true;

    for (let i = 0; i < lista.length; i++) {
        const animal = lista[i];

        let iconeSexo = "fa-mars";
        let iconeEspecie = "fa-dog";

        if (animal.sexo === "Fêmea") {
            iconeSexo = "fa-venus";
        }

        if (animal.especie === "Gato") {
            iconeEspecie = "fa-cat";
        }

        gridAnimais.innerHTML += `
            <article class="adocao-card">
                <div class="adocao-img-container">
                    <img
                        src="${seguro(animal.imagem)}"
                        alt="Foto de ${seguro(animal.nome)}"
                        class="pet-img"
                        loading="lazy"
                    >


                </div>

                <div class="adocao-info">
                    <h3>${seguro(animal.nome)}</h3>

                    <p class="pet-local">
                        <i class="fa-solid fa-location-dot"></i>
                        ${seguro(animal.bairro)}, ${seguro(animal.cidade)}
                    </p>

                    <div class="pet-tags">
                        <span class="tag">
                            <i class="fa-solid fa-cake-candles"></i>
                            ${formatarIdade(animal.meses)}
                        </span>

                        <span class="tag">
                            <i class="fa-solid ${iconeSexo}"></i>
                            ${seguro(animal.sexo)}
                        </span>

                        <span class="tag">
                            <i class="fa-solid ${iconeEspecie}"></i>
                            Porte ${seguro(animal.porte)}
                        </span>

                        <span class="tag">
                            <i class="fa-solid fa-palette"></i>
                            ${seguro(animal.cor)}
                        </span>
                    </div>

                    <p class="pet-desc">${seguro(animal.descricao)}</p>

                    <button
                        type="button"
                        class="btn-adotar"
                        data-pet-id="${seguro(animal.id)}"
                    >
                        Quero Adotar
                        <i class="fa-solid fa-heart"></i>
                    </button>
                </div>
            </article>
        `;
    }
}

function mostrarFiltrosAtivos() {
    filtrosAtivos.innerHTML = "";

    const campos = [
        ["busca", "Nome", busca],
        ["especie", "Espécie", especie],
        ["cidade", "Cidade", cidade],
        ["bairro", "Bairro", bairro],
        ["cor", "Cor", cor],
        ["porte", "Porte", porte],
        ["sexo", "Sexo", sexo],
        ["idade", "Idade", idade]
    ];

    for (let i = 0; i < campos.length; i++) {
        const nome = campos[i][0];
        const titulo = campos[i][1];
        const elemento = campos[i][2];

        if (elemento.value !== "") {
            const botao = document.createElement("button");

            botao.type = "button";
            botao.className = "tag-filtro";
            botao.textContent = titulo + ": " + elemento.value + " ";

            const icone = document.createElement("i");
            icone.className = "fa-solid fa-xmark";

            botao.appendChild(icone);

            botao.addEventListener("click", function() {
                removerFiltro(nome);
            });

            filtrosAtivos.appendChild(botao);
        }
    }
}

function removerFiltro(nome) {
    const campo = document.getElementById(nome);

    campo.value = "";

    if (nome === "cidade") {
        preencherBairros();
    }

    filtrarAnimais();
}

function limparFiltros() {
    document.getElementById("formFiltros").reset();

    ordenacao.value = "recentes";

    preencherBairros();
    filtrarAnimais();
}

function solicitarAdocao(id) {
    window.location.href = "./contato-adocao.html?id=" + encodeURIComponent(id);
}

function abrirDetalhes(id) {
    let animalSelecionado = null;

    for (let i = 0; i < animais.length; i++) {
        if (String(animais[i].id) === String(id)) {
            animalSelecionado = animais[i];
            break;
        }
    }

    if (animalSelecionado === null) {
        return;
    }

    const animal = animalSelecionado;

    modalConteudo.innerHTML = `
        <img
            src="${seguro(animal.imagem)}"
            alt="Foto de ${seguro(animal.nome)}"
            class="modal-imagem"
        >

        <div class="modal-informacoes">
            <h2 id="modalNome">${seguro(animal.nome)}</h2>

            <p class="modal-local">
                <i class="fa-solid fa-location-dot"></i>
                ${seguro(animal.bairro)}, ${seguro(animal.cidade)}
            </p>

            <div class="modal-tags">
                <span>${animal.especie}</span>
                <span>${seguro(animal.sexo)}</span>
                <span>${formatarIdade(animal.meses)}</span>
                <span>Porte ${seguro(animal.porte)}</span>
                <span>${seguro(animal.cor)}</span>
            </div>

            <p class="modal-descricao">${seguro(animal.descricao)}</p>

            <div class="modal-aviso">
                <i class="fa-solid fa-circle-info"></i>
                Este é um anúncio demonstrativo.
                O contato com o responsável será disponibilizado
                quando os anúncios reais forem integrados ao MapPet.
            </div>
        </div>
    `;

    modalFundo.hidden = false;
    document.body.classList.add("modal-aberto");
}

function fecharDetalhes() {
    modalFundo.hidden = true;
    document.body.classList.remove("modal-aberto");
}

busca.addEventListener("input", filtrarAnimais);
especie.addEventListener("change", filtrarAnimais);
bairro.addEventListener("change", filtrarAnimais);
cor.addEventListener("change", filtrarAnimais);
porte.addEventListener("change", filtrarAnimais);
sexo.addEventListener("change", filtrarAnimais);
idade.addEventListener("change", filtrarAnimais);
ordenacao.addEventListener("change", filtrarAnimais);

cidade.addEventListener("change", function() {
    preencherBairros();
    filtrarAnimais();
});

document.getElementById("limparFiltros").addEventListener("click", limparFiltros);
document.getElementById("limparSemResultados").addEventListener("click", limparFiltros);
document.getElementById("fecharModal").addEventListener("click", fecharDetalhes);

modalFundo.addEventListener("click", function(evento) {
    if (evento.target === modalFundo) {
        fecharDetalhes();
    }
});

document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape") {
        fecharDetalhes();
    }
});

preencherCidades();
preencherCores();
preencherBairros();
filtrarAnimais();

document.addEventListener('click', function (evento) {
    const botao = evento.target.closest('.btn-adotar[data-pet-id]');
    if (botao) solicitarAdocao(botao.dataset.petId);
});
