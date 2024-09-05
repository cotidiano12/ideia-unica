// Função para carregar as atividades armazenadas
function carregarAtividades() {
    const atividadesSalvas = localStorage.getItem('atividades');
    return atividadesSalvas ? JSON.parse(atividadesSalvas) : [];
}

// Função para salvar atividades no localStorage
function salvarAtividades(atividades) {
    localStorage.setItem('atividades', JSON.stringify(atividades));
}

// Função para exibir atividades na página com animação
function exibirAtividades() {
    const atividadesDiv = document.getElementById('atividades');
    atividadesDiv.innerHTML = ''; // Limpa a lista antes de adicionar

    const atividades = carregarAtividades();

    atividades.forEach((atividade, index) => {
        const atividadeElemento = document.createElement('div');
        atividadeElemento.classList.add('atividade');

        let arquivoHTML = '';
        if (atividade.arquivo) {
            if (atividade.tipo === 'image') {
                arquivoHTML = `<img src="${atividade.arquivo}" alt="Imagem da Matéria">`;
            } else {
                arquivoHTML = `<a href="${atividade.arquivo}" target="_blank">${atividade.nomeArquivo}</a>`;
            }
        }

        atividadeElemento.innerHTML = `
            ${arquivoHTML}
            <h3>${atividade.materia}</h3>
            <p>${atividade.descricao}</p>
            <small>Data de entrega: ${atividade.data}</small>
            <button class="remover" data-index="${index}">Remover</button>
        `;

        atividadesDiv.appendChild(atividadeElemento);

        // Aplica animação de exibição com um pequeno delay
        setTimeout(() => {
            atividadeElemento.classList.add('mostrar');
        }, 100); // 100ms de atraso para suavidade
    });

    // Adiciona o evento de remover a cada botão de remover
    document.querySelectorAll('button.remover').forEach(button => {
        button.addEventListener('click', removerAtividade);
    });
}

// Função para adicionar uma nova atividade
function adicionarAtividade() {
    const nomeMateria = document.getElementById('nomeMateria').value;
    const dataEntrega = document.getElementById('dataEntrega').value;
    const descricaoAtividade = document.getElementById('descricaoAtividade').value;
    const arquivoMateria = document.getElementById('arquivoMateria').files[0]; // Pega o arquivo selecionado

    if (nomeMateria && dataEntrega && descricaoAtividade) {
        const reader = new FileReader();
        const novaAtividade = {
            materia: nomeMateria,
            data: dataEntrega,
            descricao: descricaoAtividade,
            arquivo: null,
            tipo: null,
            nomeArquivo: null
        };

        if (arquivoMateria) {
            const fileType = arquivoMateria.type.split('/')[0];
            novaAtividade.nomeArquivo = arquivoMateria.name;
            novaAtividade.tipo = fileType;

            if (fileType === 'image') {
                reader.onload = function(event) {
                    novaAtividade.arquivo = event.target.result;
                    salvarAtividades([...carregarAtividades(), novaAtividade]);
                    exibirAtividades();
                };
                reader.readAsDataURL(arquivoMateria); // Lê o arquivo como URL
            } else {
                reader.onload = function(event) {
                    novaAtividade.arquivo = event.target.result;
                    salvarAtividades([...carregarAtividades(), novaAtividade]);
                    exibirAtividades();
                };
                reader.readAsDataURL(arquivoMateria); // Lê o arquivo como URL
            }
        } else {
            salvarAtividades([...carregarAtividades(), novaAtividade]);
            exibirAtividades();
        }

        // Limpar campos
        document.getElementById('nomeMateria').value = '';
        document.getElementById('dataEntrega').value = '';
        document.getElementById('descricaoAtividade').value = '';
        document.getElementById('arquivoMateria').value = ''; // Limpar campo de arquivo
    } else {
        alert('Por favor, preencha todos os campos!');
    }
}

// Função para remover uma atividade com animação de desaparecimento
function removerAtividade(event) {
    const index = event.target.getAttribute('data-index');
    const atividades = carregarAtividades();

    const atividadeElemento = event.target.closest('.atividade');
    atividadeElemento.classList.add('removendo'); // Aplica a classe de animação de remoção

    // Aguarda a animação antes de remover do localStorage e da página
    setTimeout(() => {
        atividades.splice(index, 1); // Remove a atividade pelo índice
        salvarAtividades(atividades);
        exibirAtividades();
    }, 500); // 500ms de atraso para a animação de saída
}

// Adiciona evento de clique no botão de adicionar atividade
document.getElementById('adicionarAtividade').addEventListener('click', adicionarAtividade);

// Carregar atividades ao iniciar a página
exibirAtividades();
