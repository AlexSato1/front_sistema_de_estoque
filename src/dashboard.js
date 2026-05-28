// ==================== VARIÁVEIS GLOBAIS ====================

let currentUser = null;
let estoque = [];
let historico = [];

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', function() {
    // Verificar se usuário está logado
    const userStorage = localStorage.getItem('currentUser');
    
    if (!userStorage) {
        window.location.href = './index.html';
        return;
    }
    
    currentUser = JSON.parse(userStorage);
    
    // Inicializar dados
    initializeData();
    displayUserInfo();
    setupMenuPermissions();
    setupEventListeners();
    loadPage('dashboard');
    
    // Marcar primeiro menu como ativo
    document.querySelector('.menu-item[data-page="dashboard"]').classList.add('active');
});

// ==================== INICIALIZAÇÃO DE DADOS ====================

function initializeData() {
    // Carregar dados do localStorage
    const storedEstoque = localStorage.getItem('estoque');
    const storedHistorico = localStorage.getItem('historico');
    
    if (storedEstoque) {
        estoque = JSON.parse(storedEstoque);
    } else {
        // Dados iniciais de exemplo
        estoque = [
            { id: 1, codigo: 'PFR-001', nome: 'Pão Francês', quantidade: 50, unidade: 'kg', categoria: 'Pao', preco: 8.50, fornecedor: 'Padaria XYZ', imagem: null, dataCriacao: new Date().toLocaleDateString(), dataProducao: '2026-05-20', dataValidade: '2026-06-30' },
            { id: 2, codigo: 'CRM-002', nome: 'Carne Moída', quantidade: 30, unidade: 'kg', categoria: 'Alimentos', preco: 25.00, fornecedor: 'Açougue ABC', imagem: null, dataCriacao: new Date().toLocaleDateString(), dataProducao: '2026-05-15', dataValidade: '2026-06-15' },
            { id: 3, codigo: 'RFR-003', nome: 'Refrigerante', quantidade: 40, unidade: 'l', categoria: 'Bebidas', preco: 4.50, fornecedor: 'Distribuidora Del', imagem: null, dataCriacao: new Date().toLocaleDateString(), dataProducao: '2026-04-20', dataValidade: '2026-08-20' },
            { id: 4, codigo: 'TMT-004', nome: 'Tomate', quantidade: 20, unidade: 'kg', categoria: 'Alimentos', preco: 5.00, fornecedor: 'Hortifrutti', imagem: null, dataCriacao: new Date().toLocaleDateString(), dataProducao: '2026-05-25', dataValidade: '2026-05-28' },
            { id: 5, codigo: 'QJC-005', nome: 'Queijo Meia Cura', quantidade: 15, unidade: 'kg', categoria: 'Alimentos', preco: 35.00, fornecedor: 'Queijaria Premium', imagem: null, dataCriacao: new Date().toLocaleDateString(), dataProducao: '2026-04-01', dataValidade: '2026-07-10' }
        ];
        saveEstoque();
    }
    
    if (storedHistorico) {
        historico = JSON.parse(storedHistorico);
    }
}

function saveEstoque() {
    localStorage.setItem('estoque', JSON.stringify(estoque));
}

function saveHistorico() {
    localStorage.setItem('historico', JSON.stringify(historico));
}

// ==================== EXIBIÇÃO DE INFORMAÇÕES ====================

function displayUserInfo() {
    document.getElementById('userInfo').textContent = `👤 ${currentUser.name}`;
    document.getElementById('cargoInfo').textContent = `📍 ${currentUser.cargo}`;
}

// ==================== PERMISSÕES ====================

function setupMenuPermissions() {
    // Menu Adicionar - apenas admin pode
    const menuAdicionar = document.getElementById('menuAdicionar');
    if (!currentUser.permissions.includes('add')) {
        menuAdicionar.style.display = 'none';
    }
    
    // Menu Reposição - apenas admin pode
    const menuRepor = document.getElementById('menuRepor');
    if (!currentUser.permissions.includes('restock')) {
        menuRepor.style.display = 'none';
    }
    
    // Menu Histórico - apenas admin pode
    const menuHistorico = document.querySelector('.menu-item[data-page="historico"]');
    if (!canViewHistory()) {
        if (menuHistorico) menuHistorico.style.display = 'none';
    }
    
    // Menu Usuários - apenas admin pode
    const menuUsuarios = document.getElementById('menuUsuarios');
    if (currentUser.role !== 'admin') {
        menuUsuarios.style.display = 'none';
    }
}

function canAdd() {
    return currentUser.permissions.includes('add');
}

function canRemove() {
    return currentUser.permissions.includes('remove');
}

function canRestock() {
    return currentUser.permissions.includes('restock');
}

function canDelete() {
    return currentUser.role === 'admin';
}

function canViewHistory() {
    return currentUser.role === 'admin';
}

// ==================== NAVEGAÇÃO ====================

function setupEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Fechar sidebar ao clicar em um menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', function() {
                // Fechar sidebar em mobile
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            });
        });
        
        // Fechar sidebar ao clicar fora dela em mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    }
    
    // Menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            loadPage(page);
            
            // Atualizar estilo ativo
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Formulários
    document.getElementById('formAdicionar').addEventListener('submit', handleAdicionarItem);
    document.getElementById('formRetirar').addEventListener('submit', handleRetirarItem);
    document.getElementById('formRepor').addEventListener('submit', handleReporItem);
    
    // Upload de imagem
    const imagePreview = document.getElementById('imagePreview');
    const itemImagem = document.getElementById('itemImagem');
    
    imagePreview.addEventListener('click', () => itemImagem.click());
    
    itemImagem.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.getElementById('imagePreviewImg');
                const placeholder = document.getElementById('imagePlaceholder');
                
                img.src = event.target.result;
                img.style.display = 'block';
                placeholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Busca de estoque
    document.getElementById('searchInput').addEventListener('input', filterEstoque);
    
    // Seleção de item em retirada e reposição
    document.getElementById('itemSelecionado').addEventListener('change', updateItemDetalhes);
    document.getElementById('itemReposicao').addEventListener('change', updateItemDetalhesRepor);
    
    // Histórico
    document.getElementById('filtroTipo').addEventListener('change', filterHistorico);
    document.getElementById('btnLimparHistorico').addEventListener('click', clearHistorico);
    
    // Usuários
    const formUsuario = document.getElementById('formUsuario');
    if (formUsuario) {
        formUsuario.addEventListener('submit', handleSalvarUsuario);
    }
    
    // Modal
    document.getElementById('btnCancel').addEventListener('click', closeModal);
}

function loadPage(page) {
    // Esconder todas as páginas
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Mostrar página selecionada
    const selectedPage = document.getElementById('page-' + page);
    if (selectedPage) {
        selectedPage.classList.add('active');
        
        // Executar ações específicas da página
        if (page === 'dashboard') {
            displayDashboard();
        } else if (page === 'estoque') {
            displayEstoque();
        } else if (page === 'retirar') {
            populateItemSelect('itemSelecionado');
        } else if (page === 'repor') {
            populateItemSelect('itemReposicao');
        } else if (page === 'historico') {
            displayHistorico();
        } else if (page === 'usuarios') {
            displayUsuarios();
        }
    }
}

// ==================== ESTOQUE ====================

function displayEstoque() {
    const tbodyBebidas = document.getElementById('estoqueTableBodyBebidas');
    const tbodyComidas = document.getElementById('estoqueTableBodyComidas');
    const emptyBebidas = document.getElementById('emptyBebidas');
    const emptyComidas = document.getElementById('emptyComidas');

    tbodyBebidas.innerHTML = '';
    tbodyComidas.innerHTML = '';

    const bebidaCats = ['bebidas', 'bebida'];
    const comidaCats = ['pao', 'massa', 'alimentos', 'pão', 'pao/massa'];

    function isBebida(cat) {
        if (!cat) return false;
        return bebidaCats.includes(String(cat).toLowerCase());
    }

    function isComida(cat) {
        if (!cat) return false;
        const c = String(cat).toLowerCase();
        return comidaCats.includes(c) || (!isBebida(c));
    }

    const bebidas = estoque.filter(i => isBebida(i.categoria));
    const comidas = estoque.filter(i => isComida(i.categoria));

    function makeRow(item) {
        const row = document.createElement('tr');
        const imgThumb = item.imagem ? `<img src="${item.imagem}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` : '<span style="color: #999;">Sem imagem</span>';
        let actions = '';
        if (canAdd()) actions += `<button class="btn-small btn-edit" onclick="editarItem(${item.id})">✏️ Editar</button>`;
        if (canDelete()) actions += `<button class="btn-small btn-delete" onclick="deleteItem(${item.id})">🗑️ Deletar</button>`;
        
        // Botão de reposição rápida se estoque baixo
        if (canRemove() && item.quantidade < 10) {
            actions += `<button class="btn-small btn-restock" onclick="quickReplenish(${item.id})" style="background-color:#ff9800; color:white;">📦 Repor</button>`;
        }
        
        const precoFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco || 0);
        
        // Formatar data de produção
        let dataProducaoDisplay = item.dataProducao || 'N/A';
        
        // Indicador de estoque baixo
        let quantidadeStyle = '';
        let quantidadeIcon = '';
        if (item.quantidade === 0) {
            quantidadeStyle = 'style="background-color: #ffcccc; color: #cc0000; font-weight: bold;"';
            quantidadeIcon = '🔴';
        } else if (item.quantidade < 10) {
            quantidadeStyle = 'style="background-color: #fff3cd; color: #856404; font-weight: bold;"';
            quantidadeIcon = '⚠️';
        }
        
        // Verificar se produto está vencido
        let dataValidadeDisplay = 'N/A';
        let validadeStyle = '';
        if (item.dataValidade) {
            const dataValidade = new Date(item.dataValidade + 'T00:00:00');
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            
            if (dataValidade < hoje) {
                validadeStyle = 'style="background-color: #ffcccc; color: #cc0000; font-weight: bold;"';
                dataValidadeDisplay = `🔴 ${item.dataValidade} (VENCIDO)`;
            } else {
                const diasRestantes = Math.ceil((dataValidade - hoje) / (1000 * 60 * 60 * 24));
                if (diasRestantes <= 7) {
                    validadeStyle = 'style="background-color: #fff3cd; color: #856404; font-weight: bold;"';
                    dataValidadeDisplay = `⚠️ ${item.dataValidade} (${diasRestantes} dias)`;
                } else {
                    dataValidadeDisplay = item.dataValidade;
                }
            }
        }

        row.innerHTML = `
            <td data-label="Imagem">${imgThumb}</td>
            <td data-label="Código">${item.codigo || ''}</td>
            <td data-label="Item">${item.nome}</td>
            <td data-label="Quantidade" ${quantidadeStyle}>${quantidadeIcon} <strong>${item.quantidade}</strong></td>
            <td data-label="Preço">${precoFormatado}</td>
            <td data-label="Unidade">${item.unidade}</td>
            <td data-label="Categoria">${item.categoria}</td>
            <td data-label="Fornecedor">${item.fornecedor || 'N/A'}</td>
            <td data-label="Produção">${dataProducaoDisplay}</td>
            <td data-label="Validade" ${validadeStyle}>${dataValidadeDisplay}</td>
            <td data-label="Atualizado">${item.dataCriacao}</td>
            <td data-label="Ações">
                ${actions || '<span style="color: #999;">Sem ações</span>'}
            </td>
        `;
        return row;
    }

    if (bebidas.length === 0) {
        emptyBebidas.style.display = 'block';
    } else {
        emptyBebidas.style.display = 'none';
        bebidas.forEach(item => tbodyBebidas.appendChild(makeRow(item)));
    }

    if (comidas.length === 0) {
        emptyComidas.style.display = 'block';
    } else {
        emptyComidas.style.display = 'none';
        comidas.forEach(item => tbodyComidas.appendChild(makeRow(item)));
    }
}

function filterEstoque() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#estoqueTableBodyBebidas tr, #estoqueTableBodyComidas tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) row.style.display = '';
        else row.style.display = 'none';
    });
}

function populateItemSelect(selectId) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Selecione um item...</option>';
    
    estoque.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.nome} (${item.quantidade} ${item.unidade}) ${item.codigo ? '- ' + item.codigo : ''}`;
        select.appendChild(option);
    });
}

function updateItemDetalhes() {
    const select = document.getElementById('itemSelecionado');
    const itemId = select.value;
    const detalhes = document.getElementById('itemDetalhes');
    
    if (itemId) {
        const item = estoque.find(i => i.id == itemId);
        if (item) {
            document.getElementById('quantidadeDisponivel').textContent = item.quantidade;
            document.getElementById('unidadeDisponivel').textContent = item.unidade;
            detalhes.style.display = 'block';
            document.getElementById('quantidadeRetirar').max = item.quantidade;
        }
    } else {
        detalhes.style.display = 'none';
    }
}

function updateItemDetalhesRepor() {
    const select = document.getElementById('itemReposicao');
    const itemId = select.value;
    const detalhes = document.getElementById('itemDetalhesRepor');
    
    if (itemId) {
        const item = estoque.find(i => i.id == itemId);
        if (item) {
            document.getElementById('quantidadeAtualRepor').textContent = item.quantidade;
            document.getElementById('unidadeReposicao').textContent = item.unidade;
            detalhes.style.display = 'block';
        }
    } else {
        detalhes.style.display = 'none';
    }
}

function editarItem(itemId) {
    const item = estoque.find(i => i.id == itemId);
    if (item) {
        // Preencher formulário
        document.getElementById('itemCodigo').value = item.codigo || '';
        document.getElementById('itemNome').value = item.nome;
        document.getElementById('itemQuantidade').value = item.quantidade;
        document.getElementById('itemUnidade').value = item.unidade;
        document.getElementById('itemCategoria').value = item.categoria;
        document.getElementById('itemPreco').value = item.preco || '';
        document.getElementById('itemFornecedor').value = item.fornecedor || '';
        document.getElementById('itemDataProducao').value = item.dataProducao || '';
        document.getElementById('itemDataValidade').value = item.dataValidade || '';
        
        // Carregar imagem se existir
        if (item.imagem) {
            const img = document.getElementById('imagePreviewImg');
            const placeholder = document.getElementById('imagePlaceholder');
            img.src = item.imagem;
            img.style.display = 'block';
            placeholder.style.display = 'none';
        } else {
            document.getElementById('imagePreviewImg').style.display = 'none';
            document.getElementById('imagePlaceholder').style.display = 'block';
        }
        
        // Scroll até o formulário
        loadPage('adicionar');
        document.querySelector('#page-adicionar').scrollIntoView({ behavior: 'smooth' });
        
        // Alterar botão e ID
        document.getElementById('formAdicionar').dataset.editId = itemId;
        document.querySelector('#page-adicionar .btn-primary').textContent = 'Atualizar Item';
    }
}

function deleteItem(itemId) {
    if (!canDelete()) {
        showMessage('Você não tem permissão para deletar itens!', 'error', 'page-estoque');
        return;
    }
    
    showModal(
        'Deletar Item',
        'Tem certeza que deseja deletar este item?',
        () => {
            estoque = estoque.filter(i => i.id !== itemId);
            saveEstoque();
            displayEstoque();
            closeModal();
            showMessage('Item deletado com sucesso!', 'success', 'page-estoque');
        }
    );
}

// ==================== OPERAÇÕES ====================

function handleAdicionarItem(e) {
    e.preventDefault();
    
    if (!canAdd()) {
        showMessage('Você não tem permissão para adicionar itens!', 'error', 'page-adicionar');
        return;
    }
    
    const nome = document.getElementById('itemNome').value;
    const codigo = document.getElementById('itemCodigo').value.trim();
    const quantidade = parseInt(document.getElementById('itemQuantidade').value);
    const unidade = document.getElementById('itemUnidade').value;
    const categoria = document.getElementById('itemCategoria').value;
    const preco = parseFloat(document.getElementById('itemPreco').value) || 0;
    const fornecedor = document.getElementById('itemFornecedor').value;
    const dataProducao = document.getElementById('itemDataProducao').value;
    const dataValidade = document.getElementById('itemDataValidade').value;
    const imagemImg = document.getElementById('imagePreviewImg');
    const imagem = imagemImg.style.display !== 'none' ? imagemImg.src : null;
    const editId = this.dataset.editId;
    
    if (editId) {
        // Atualizar item existente
        const item = estoque.find(i => i.id == editId);
        if (item) {
            const quantidadeAnterior = item.quantidade;
            item.codigo = codigo || item.codigo;
            item.nome = nome;
            item.quantidade = quantidade;
            item.unidade = unidade;
            item.categoria = categoria;
            item.preco = preco;
            item.fornecedor = fornecedor;
            item.dataProducao = dataProducao;
            item.dataValidade = dataValidade;
            if (imagem) {
                item.imagem = imagem;
            }
            
            // Registrar no histórico
            addToHistorico('update', nome, quantidade - quantidadeAnterior, unidade, `Atualizado de ${quantidadeAnterior}`);
            
            delete this.dataset.editId;
            document.querySelector('#page-adicionar .btn-primary').textContent = 'Adicionar Item';
        }
    } else {
        // Adicionar novo item
        const id = Math.max(...estoque.map(i => i.id), 0) + 1;
        estoque.push({
            id,
            codigo,
            nome,
            quantidade,
            unidade,
            categoria,
            preco,
            fornecedor,
            dataProducao,
            dataValidade,
            imagem,
            dataCriacao: new Date().toLocaleDateString()
        });
        
        // Registrar no histórico
        addToHistorico('add', nome, quantidade, unidade, 'Item adicionado');
    }
    
    saveEstoque();
    this.reset();
    
    // Limpar preview de imagem
    document.getElementById('imagePreviewImg').style.display = 'none';
    document.getElementById('imagePlaceholder').style.display = 'block';
    
    showMessage('Item salvo com sucesso!', 'success', 'page-adicionar');
    
    // Limpar formulário
    setTimeout(() => {
        loadPage('estoque');
    }, 1500);
}

function handleRetirarItem(e) {
    e.preventDefault();
    
    if (!canRemove()) {
        showMessage('Você não tem permissão para retirar itens!', 'error', 'page-retirar');
        return;
    }
    
    const itemId = document.getElementById('itemSelecionado').value;
    const quantidade = parseInt(document.getElementById('quantidadeRetirar').value);
    const motivo = document.getElementById('motivo').value;
    const observacoes = document.getElementById('observacoes').value;
    
    const item = estoque.find(i => i.id == itemId);
    
    if (!item) {
        showMessage('Item não encontrado!', 'error', 'page-retirar');
        return;
    }
    
    if (quantidade > item.quantidade) {
        showMessage(`Quantidade indisponível! Disponível: ${item.quantidade}`, 'error', 'page-retirar');
        return;
    }
    
    // Atualizar estoque
    item.quantidade -= quantidade;
    
    // Registrar no histórico
    addToHistorico('remove', item.nome, quantidade, item.unidade, 
        `Motivo: ${motivo}. ${observacoes}`);
    
    saveEstoque();
    this.reset();
    showMessage('Item retirado com sucesso!', 'success', 'page-retirar');
    
    setTimeout(() => {
        loadPage('estoque');
    }, 1500);
}

function handleReporItem(e) {
    e.preventDefault();
    
    if (!canRestock()) {
        showMessage('Você não tem permissão para fazer reposição!', 'error', 'page-repor');
        return;
    }
    
    const itemId = document.getElementById('itemReposicao').value;
    const quantidade = parseInt(document.getElementById('quantidadeRepor').value);
    const dataRepor = document.getElementById('dataRepor').value;
    const fornecedor = document.getElementById('fornecedor').value;
    const custo = parseFloat(document.getElementById('custRepor').value) || 0;
    
    const item = estoque.find(i => i.id == itemId);
    
    if (!item) {
        showMessage('Item não encontrado!', 'error', 'page-repor');
        return;
    }
    
    // Atualizar estoque
    item.quantidade += quantidade;
    
    // Registrar no histórico
    addToHistorico('restock', item.nome, quantidade, item.unidade,
        `Fornecedor: ${fornecedor}. Data: ${dataRepor}. Custo: R$ ${custo.toFixed(2)}`);
    
    saveEstoque();
    this.reset();
    showMessage('Reposição realizada com sucesso!', 'success', 'page-repor');
    
    setTimeout(() => {
        loadPage('estoque');
    }, 1500);
}

// ==================== HISTÓRICO ====================

function addToHistorico(tipo, itemNome, quantidade, unidade, detalhes) {
    const agora = new Date();
    historico.unshift({
        id: Date.now(),
        data: agora.toLocaleDateString() + ' ' + agora.toLocaleTimeString(),
        tipo,
        itemNome,
        quantidade,
        unidade,
        usuario: currentUser.name,
        cargo: currentUser.cargo,
        detalhes
    });
    
    // Manter apenas os últimos 500 registros
    if (historico.length > 500) {
        historico = historico.slice(0, 500);
    }
    
    saveHistorico();
}

// ==================== DASHBOARD ====================

function displayDashboard() {
    // Calcular estatísticas
    const totalItens = estoque.length;
    const valorTotal = estoque.reduce((sum, item) => sum + (item.quantidade * item.preco), 0);
    const itensCriticos = estoque.filter(item => item.quantidade <= 10).length;
    const totalMovimentacoes = historico.length;
    
    // Função helper para formatar moeda
    function formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    }
    
    // Atualizar cards
    const totalItensEl = document.getElementById('totalItens');
    const valorTotalEl = document.getElementById('valorTotal');
    const itensCriticosEl = document.getElementById('itensCriticos');
    const totalMovimentacoesEl = document.getElementById('totalMovimentacoes');
    
    if (totalItensEl) totalItensEl.textContent = totalItens;
    if (valorTotalEl) valorTotalEl.textContent = formatarMoeda(valorTotal);
    if (itensCriticosEl) itensCriticosEl.textContent = itensCriticos;
    if (totalMovimentacoesEl) totalMovimentacoesEl.textContent = totalMovimentacoes;
    
    // Exibir alertas de estoque baixo
    displayAlertas();
    
    // Exibir categorias
    displayCategorias();
}

function displayAlertas() {
    const container = document.getElementById('alertasEstoque');
    const itensCriticos = estoque.filter(item => item.quantidade <= 10);
    
    container.innerHTML = '';
    
    if (itensCriticos.length === 0) {
        container.innerHTML = '<div class="alerts-empty">✅ Nenhum item com estoque baixo!</div>';
        return;
    }
    
    itensCriticos.forEach(item => {
        const criticidade = item.quantidade <= 5 ? 'critico' : '';
        const alerta = document.createElement('div');
        alerta.className = `alert-item ${criticidade}`;
        const bgColor = item.quantidade === 0 ? '#ffcccc' : (item.quantidade <= 5 ? '#ffe6cc' : '#fff3cd');
        alerta.style.backgroundColor = bgColor;
        alerta.innerHTML = `
            <div class="alert-item-info">
                <div class="alert-item-name">${item.nome}</div>
                <div class="alert-item-details">
                    Quantidade: <strong>${item.quantidade} ${item.unidade}</strong>
                    ${item.quantidade === 0 ? '🔴 ZERADO' : (item.quantidade <= 5 ? '⚠️ CRÍTICO' : '⚠️ Baixo')}
                </div>
                <div class="alert-item-suggestion" style="margin-top: 8px; font-size: 12px; color: #666;">
                    💡 Sugestão: Repor 50 unidades
                </div>
            </div>
            <div class="alert-item-action" style="display: flex; gap: 8px;">
                <button class="btn-small" onclick="quickReplenish(${item.id})" style="background-color: #ff9800; color: white; flex: 1;">📦 Repor Agora</button>
                <button class="btn-small" onclick="openReposicao(${item.id})" style="background-color: #2196F3; color: white; flex: 1;">🔧 Customizar</button>
            </div>
        `;
        container.appendChild(alerta);
    });
}

function displayCategorias() {
    const container = document.getElementById('categoriasContainer');
    const categorias = {};
    
    estoque.forEach(item => {
        if (!categorias[item.categoria]) {
            categorias[item.categoria] = 0;
        }
        categorias[item.categoria]++;
    });
    
    container.innerHTML = '';
    
    Object.entries(categorias).forEach(([categoria, count]) => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <h4>${categoria}</h4>
            <div class="category-count">${count}</div>
            <small>${count === 1 ? 'item' : 'itens'}</small>
        `;
        container.appendChild(card);
    });
}

function displayHistorico() {
    const tbody = document.getElementById('historicoTableBody');
    const emptyMsg = document.getElementById('emptyHistorico');
    
    tbody.innerHTML = '';
    
    if (historico.length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }
    
    emptyMsg.style.display = 'none';
    
    historico.forEach(record => {
        const row = document.createElement('tr');
        const tipoEmoji = record.tipo === 'add' ? '➕' : record.tipo === 'remove' ? '➖' : '🔄';
        const tipoTexto = record.tipo === 'add' ? 'Adicionado' : record.tipo === 'remove' ? 'Removido' : 'Reposição';
        
        row.innerHTML = `
            <td>${record.data}</td>
            <td>${tipoEmoji} ${tipoTexto}</td>
            <td>${record.itemNome}</td>
            <td>${record.quantidade}</td>
            <td>${record.unidade}</td>
            <td>${record.usuario}</td>
            <td><small>${record.detalhes}</small></td>
        `;
        tbody.appendChild(row);
    });
}

function filterHistorico() {
    const filtro = document.getElementById('filtroTipo').value;
    const tbody = document.getElementById('historicoTableBody');
    
    document.querySelectorAll('#historicoTableBody tr').forEach(row => {
        if (!filtro) {
            row.style.display = '';
        } else {
            const tipoCell = row.cells[1].textContent;
            if (
                (filtro === 'add' && tipoCell.includes('Adicionado')) ||
                (filtro === 'remove' && tipoCell.includes('Removido')) ||
                (filtro === 'restock' && tipoCell.includes('Reposição'))
            ) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

function clearHistorico() {
    showModal(
        'Limpar Histórico',
        'Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.',
        () => {
            historico = [];
            saveHistorico();
            displayHistorico();
            closeModal();
            showMessage('Histórico limpo com sucesso!', 'success', 'page-historico');
        }
    );
}

// ==================== UI HELPERS ====================

function showMessage(text, type, pageId) {
    const msgDiv = document.getElementById('msg' + pageId.charAt(5).toUpperCase() + pageId.slice(6));
    if (msgDiv) {
        msgDiv.textContent = text;
        msgDiv.className = 'message ' + type;
        msgDiv.style.display = 'block';
        
        setTimeout(() => {
            msgDiv.style.display = 'none';
        }, 4000);
    }
}

function showModal(title, message, onConfirm) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    
    const modal = document.getElementById('confirmModal');
    modal.style.display = 'flex';
    
    const btnConfirm = document.getElementById('btnConfirm');
    const oldBtnConfirm = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(oldBtnConfirm, btnConfirm);
    
    document.getElementById('confirmModal').querySelector('.btn-primary').addEventListener('click', onConfirm);
}

function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

// ==================== LOGOUT ====================

function logout() {
    showModal(
        'Confirmar Saída',
        'Tem certeza que deseja sair?',
        () => {
            localStorage.removeItem('currentUser');
            window.location.href = './index.html';
        }
    );
}

// ==================== AUTOMAÇÃO DE ESTOQUE BAIXO ====================

// Função de reposição rápida com sugestão inteligente
function quickReplenish(itemId) {
    const item = estoque.find(i => i.id == itemId);
    if (!item) return;
    
    // Sugerir quantidade baseada no nível atual
    let quantidadeSugerida = 50;
    if (item.quantidade === 0) {
        quantidadeSugerida = 100;  // Se zerado, repor mais
    } else if (item.quantidade <= 5) {
        quantidadeSugerida = 50;   // Se crítico, repor 50
    }
    
    // Preencher formulário de reposição
    loadPage('repor');
    
    setTimeout(() => {
        document.getElementById('itemReposicaoSelect').value = itemId;
        document.getElementById('quantidadeReposicao').value = quantidadeSugerida;
        document.querySelector('#page-repor').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// Abrir página de reposição customizável
function openReposicao(itemId) {
    loadPage('repor');
    
    setTimeout(() => {
        document.getElementById('itemReposicaoSelect').value = itemId;
        document.getElementById('quantidadeReposicao').value = '';
        document.querySelector('#page-repor').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

// ==================== GERENCIAMENTO DE USUÁRIOS ====================

function displayUsuarios() {
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : {};
    
    const tbody = document.getElementById('usuariosTableBody');
    const emptyMsg = document.getElementById('emptyUsuarios');
    
    tbody.innerHTML = '';
    
    if (Object.keys(users).length === 0) {
        emptyMsg.style.display = 'block';
        return;
    }
    
    emptyMsg.style.display = 'none';
    
    Object.entries(users).forEach(([username, user]) => {
        const permsDisplay = user.permissions.join(', ');
        const email = user.email || '-';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td data-label="Usuário">${username}</td>
            <td data-label="Nome">${user.name}</td>
            <td data-label="Email">${email}</td>
            <td data-label="Cargo">${user.cargo}</td>
            <td data-label="Permissões">${permsDisplay || 'view'}</td>
            <td data-label="Ações">
                <button class="btn-small btn-edit" onclick="editarUsuario('${username}')">✏️ Editar</button>
                ${username !== 'admin' ? `<button class="btn-small btn-delete" onclick="deletarUsuario('${username}')">🗑️ Deletar</button>` : '<span style="color: #999;">-</span>'}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function abrirFormularioCadastroUsuario() {
    document.getElementById('usuarioFormContainer').style.display = 'block';
    document.getElementById('usuarioFormTitle').textContent = 'Novo Usuário';
    document.getElementById('formUsuario').dataset.editUsername = '';
    document.getElementById('usuarioUsername').disabled = false;
    document.getElementById('usuarioUsername').value = '';
    document.getElementById('usuarioNome').value = '';
    document.getElementById('usuarioEmail').value = '';
    document.getElementById('usuarioSenha').value = '';
    document.getElementById('usuarioCargo').value = '';
    document.querySelector('#page-usuarios').scrollIntoView({ behavior: 'smooth' });
}

function fecharFormularioUsuario() {
    document.getElementById('usuarioFormContainer').style.display = 'none';
    document.getElementById('formUsuario').reset();
    document.getElementById('formUsuario').dataset.editUsername = '';
}

function editarUsuario(username) {
    const usersData = localStorage.getItem('users');
    const users = JSON.parse(usersData);
    const user = users[username];
    
    if (!user) return;
    
    document.getElementById('usuarioFormContainer').style.display = 'block';
    document.getElementById('usuarioFormTitle').textContent = `Editar Usuário: ${username}`;
    document.getElementById('formUsuario').dataset.editUsername = username;
    document.getElementById('usuarioUsername').value = username;
    document.getElementById('usuarioUsername').disabled = true;
    document.getElementById('usuarioNome').value = user.name;
    document.getElementById('usuarioEmail').value = user.email || '';
    document.getElementById('usuarioSenha').value = user.password;
    document.getElementById('usuarioCargo').value = user.cargo;
    document.querySelector('#page-usuarios').scrollIntoView({ behavior: 'smooth' });
}

function deletarUsuario(username) {
    if (username === 'admin') {
        alert('Não é possível deletar o usuário admin!');
        return;
    }
    
    showModal(
        'Confirmar Deleção',
        `Tem certeza que deseja deletar o usuário "${username}"?`,
        () => {
            const usersData = localStorage.getItem('users');
            const users = JSON.parse(usersData);
            delete users[username];
            localStorage.setItem('users', JSON.stringify(users));
            closeModal();
            displayUsuarios();
            showMessage('Usuário deletado com sucesso!', 'success', 'page-usuarios');
        }
    );
}

// Salvar formulário de usuário
document.addEventListener('DOMContentLoaded', function() {
    const formUsuario = document.getElementById('formUsuario');
    if (formUsuario) {
        formUsuario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const editUsername = this.dataset.editUsername;
            const username = document.getElementById('usuarioUsername').value.trim().toLowerCase();
            const nome = document.getElementById('usuarioNome').value.trim();
            const email = document.getElementById('usuarioEmail').value.trim().toLowerCase();
            const senha = document.getElementById('usuarioSenha').value;
            const cargo = document.getElementById('usuarioCargo').value;
            
            const msgDiv = document.getElementById('msgUsuario');
            msgDiv.textContent = '';
            
            // Validações
            if (!editUsername && username.length < 4) {
                msgDiv.textContent = 'Usuário deve ter no mínimo 4 caracteres!';
                msgDiv.className = 'message error';
                return;
            }
            
            if (senha.length < 6 && !editUsername) {
                msgDiv.textContent = 'Senha deve ter no mínimo 6 caracteres!';
                msgDiv.className = 'message error';
                return;
            }
            
            if (!nome) {
                msgDiv.textContent = 'Preencha o nome!';
                msgDiv.className = 'message error';
                return;
            }
            
            if (!email) {
                msgDiv.textContent = 'Preencha o email pessoal!';
                msgDiv.className = 'message error';
                return;
            }
            
            const usersData = localStorage.getItem('users');
            const users = JSON.parse(usersData);
            
            if (!editUsername && users[username]) {
                msgDiv.textContent = 'Este usuário já existe!';
                msgDiv.className = 'message error';
                return;
            }
            
            // Determinar permissões baseado no cargo
            let permissions = ['view'];
            if (cargo === 'Cozinha' || cargo === 'Bebidas') {
                permissions = ['view', 'remove'];
            } else if (cargo === 'Estoque' || cargo === 'Administração') {
                permissions = ['view', 'add', 'remove', 'restock'];
            }
            
            if (editUsername) {
                // Atualizar usuário existente
                users[editUsername].name = nome;
                users[editUsername].email = email;
                if (senha) users[editUsername].password = senha;
                users[editUsername].cargo = cargo;
                users[editUsername].permissions = permissions;
            } else {
                // Criar novo usuário
                users[username] = {
                    password: senha,
                    name: nome,
                    email: email,
                    role: cargo === 'Administração' ? 'admin' : 'limited',
                    cargo: cargo,
                    permissions: permissions
                };
            }
            
            localStorage.setItem('users', JSON.stringify(users));
            
            msgDiv.textContent = '✅ Usuário salvo com sucesso!';
            msgDiv.className = 'message success';
            msgDiv.style.color = 'green';
            
            setTimeout(() => {
                fecharFormularioUsuario();
                displayUsuarios();
            }, 1500);
        });
    }
});
