console.log("Arquivo script.js carregado corretamente!");

document.addEventListener('DOMContentLoaded', function() {
    ativarTooltips();
    configurarContadorDeCaracteres();
    configurarPesquisaProdutos();
    configurarEnvioDeFormulario();
});

// Função para ativar tooltips
function ativarTooltips() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
}

 

// Função para configurar o contador de caracteres
function configurarContadorDeCaracteres() {
    const mensagemInput = document.getElementById('mensagem');
    const charCount = document.getElementById('charCount');

    console.log('mensagemInput:', mensagemInput);
    console.log('charCount:', charCount);

    if (mensagemInput && charCount) {
        mensagemInput.addEventListener('input', function() {
            const length = mensagemInput.value.length;
            charCount.textContent = `${length}/500 caracteres`;
            console.log(`Caractere contado: ${length}`);
        });

        // Atualizar contador de caracteres ao carregar a página
        mensagemInput.dispatchEvent(new Event('input'));
    } else {
        console.error('Elemento com id="mensagem" ou id="charCount" não encontrado.');
    }
}






// Função para configurar a pesquisa de produtos
function configurarPesquisaProdutos() {
    const searchInput = document.getElementById('search');
    const products = document.querySelectorAll('.product-card');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = searchInput.value.toLowerCase();

            products.forEach(product => {
                const productName = product.getAttribute('data-name').toLowerCase();
                if (productName.includes(searchTerm)) {
                    product.classList.remove('d-none');
                } else {
                    product.classList.add('d-none');
                }
            });
        });
    }
}

// Função para configurar o envio do formulário
function configurarEnvioDeFormulario() {
    const form = document.querySelector('form');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const mensagemInput = document.getElementById('mensagem');
    const charCount = document.getElementById('charCount');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const mensagem = mensagemInput.value.trim();

        // Validação do Nome Completo
        const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+ [A-Za-zÀ-ÖØ-öø-ÿ]+$/;
        if (!nomeRegex.test(nome)) {
            alert('Por favor, insira seu nome completo (incluindo sobrenome).');
            return;
        }

        // Validação do E-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, insira um e-mail válido.');
            return;
        }

        // Validação da Mensagem
        if (mensagem.length < 30 || mensagem.length > 500) {
            alert('A sua mensagem deve ter entre 30 e 500 caracteres.');
            return;
        }

        // Verificação de caracteres proibidos
        if (mensagem.includes(';')) {
            alert('A mensagem não pode conter o caractere ponto e vírgula (;).');
            return;
        }

        fetch('/submit_form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                nome: nome,
                email: email,
                mensagem: mensagem
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                form.reset();
                if (charCount) {
                    charCount.textContent = '0/500 caracteres';
                }
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao enviar a mensagem.');
        });
    });
}
