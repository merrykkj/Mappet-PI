document.addEventListener('DOMContentLoaded', () => {
            const botoesMenu = document.querySelectorAll('.menu-lateral .menu-item');
            const secoes = document.querySelectorAll('.painel-secao');

            console.log("Botões encontrados:", botoesMenu.length)
            console.log("Seções encontradas:", secoes.length);       

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
        });