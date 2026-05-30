// ==================== VARIÁVEIS GLOBAIS ====================

let currentUser = null;
let estoque = [];
let historico = [];
let pageSwitchTimeout = null;

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

// ==================== VALIDAÇÃO E UX DE FORMULÁRIOS ====================
function showFieldError(inputEl, message) {
    if (!inputEl) return;
    inputEl.classList.add('input-error');
    inputEl.setAttribute('aria-invalid', 'true');
    let err = inputEl.parentNode.querySelector('.error-text');
    if (!err) {
        err = document.createElement('div');
        err.className = 'error-text';
        inputEl.parentNode.appendChild(err);
    }
    err.textContent = message;
    inputEl.classList.remove('shake');
    void inputEl.offsetWidth;
    inputEl.classList.add('shake');
}

function clearFieldError(inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove('input-error');
    inputEl.removeAttribute('aria-invalid');
    const err = inputEl.parentNode.querySelector('.error-text');
    if (err) err.textContent = '';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

    // Theme toggle (acessibilidade + preferência)
    const themeToggle = document.getElementById('themeToggle');
    const applyTheme = (t) => {
        if (t === 'dark') {
            document.documentElement.classList.add('theme-dark');
            if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
        } else {
            document.documentElement.classList.remove('theme-dark');
            if (themeToggle) themeToggle.setAttribute('aria-pressed', 'false');
        }
        try { localStorage.setItem('theme', t); } catch(e) {}
    };
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = document.documentElement.classList.contains('theme-dark');
            applyTheme(isDark ? 'light' : 'dark');
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
                img.loading = 'lazy';
                img.alt = 'Preview da imagem selecionada';
                img.style.display = 'block';
                placeholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    // Limpar erros ao digitar nos formulários
    document.querySelectorAll('.form-estoque input, .form-estoque select, .form-estoque textarea').forEach(el => {
        el.addEventListener('input', () => clearFieldError(el));
    });

    // Validação live para confirmação de senha no formulário de usuário
    const senhaLive = document.getElementById('usuarioSenha');
    const senhaConfirmLive = document.getElementById('usuarioSenhaConfirm');
    if (senhaLive && senhaConfirmLive) {
        const validateMatch = () => {
            const s = senhaLive.value || '';
            const c = senhaConfirmLive.value || '';
            if (!c) {
                senhaLive.classList.remove('input-valid');
                senhaConfirmLive.classList.remove('input-valid');
                clearFieldError(senhaConfirmLive);
                return;
            }
            if (s === c) {
                clearFieldError(senhaConfirmLive);
                senhaLive.classList.add('input-valid');
                senhaConfirmLive.classList.add('input-valid');
            } else {
                senhaLive.classList.remove('input-valid');
                senhaConfirmLive.classList.remove('input-valid');
                showFieldError(senhaConfirmLive, 'Senhas não coincidem');
            }
        };
        senhaLive.addEventListener('input', validateMatch);
        senhaConfirmLive.addEventListener('input', validateMatch);
        senhaConfirmLive.addEventListener('blur', validateMatch);

        // Checklist dinâmico de requisitos de senha
        const checklist = document.getElementById('passwordChecklist');
        const ruleLength = checklist ? checklist.querySelector('[data-rule="length"]') : null;
        const ruleLetters = checklist ? checklist.querySelector('[data-rule="letters"]') : null;
        const ruleNumbers = checklist ? checklist.querySelector('[data-rule="numbers"]') : null;
        const ruleUpper = checklist ? checklist.querySelector('[data-rule="uppercase"]') : null;
        const ruleSpecial = checklist ? checklist.querySelector('[data-rule="special"]') : null;

        const updateChecklist = () => {
            if (!checklist) return;
            const value = senhaLive.value || '';
            const okLength = value.length >= 6;
            const okLetters = /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(value);
            const okNumbers = /\d/.test(value);
            const okUpper = /[A-ZÀ-Ö]/.test(value);
            const okSpecial = /[^A-Za-z0-9\s]/.test(value);

            const toggle = (el, ok) => { if (!el) return; if (ok) el.classList.add('valid'); else el.classList.remove('valid'); };
            toggle(ruleLength, okLength);
            toggle(ruleLetters, okLetters);
            toggle(ruleNumbers, okNumbers);
            toggle(ruleUpper, okUpper);
            toggle(ruleSpecial, okSpecial);
        };

        senhaLive.addEventListener('input', updateChecklist);
        // garantir estado inicial
        updateChecklist();
    }

    // Validação live para confirmação de preço no formulário de adicionar item
    const precoLive = document.getElementById('itemPreco');
    const precoConfirmLive = document.getElementById('itemPrecoConfirm');
    if (precoLive && precoConfirmLive) {
        const validatePriceMatch = () => {
            const p = precoLive.value !== '' ? parseFloat(precoLive.value) : null;
            const c = precoConfirmLive.value !== '' ? parseFloat(precoConfirmLive.value) : null;
            if (precoConfirmLive.value === '') {
                precoLive.classList.remove('input-valid');
                precoConfirmLive.classList.remove('input-valid');
                clearFieldError(precoConfirmLive);
                return;
            }
            if (p !== null && c !== null && Math.abs(p - c) < 0.0001) {
                clearFieldError(precoConfirmLive);
                precoLive.classList.add('input-valid');
                precoConfirmLive.classList.add('input-valid');
            } else {
                precoLive.classList.remove('input-valid');
                precoConfirmLive.classList.remove('input-valid');
                showFieldError(precoConfirmLive, 'Preços não coincidem');
            }
        };
        precoLive.addEventListener('input', validatePriceMatch);
        precoConfirmLive.addEventListener('input', validatePriceMatch);
        precoConfirmLive.addEventListener('blur', validatePriceMatch);
    }
    
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

    // Attach button microinteractions (ripple, press animations)
    attachButtonEffects();
}

function loadPage(page) {
    if (pageSwitchTimeout) {
        clearTimeout(pageSwitchTimeout);
        pageSwitchTimeout = null;
    }

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

// Loader helpers
function showLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;
    loader.classList.add('visible');
}

function hideLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;
    loader.classList.remove('visible');
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
        const imgThumb = item.imagem ? `<img src="${item.imagem}" loading="lazy" alt="${(item.nome||'Imagem')}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` : '<span style="color: #999;">Sem imagem</span>';
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
        const precoConfirmField = document.getElementById('itemPrecoConfirm');
        if (precoConfirmField) precoConfirmField.value = item.preco || '';
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
    
    const nomeEl = document.getElementById('itemNome');
    const nome = nomeEl.value;
    const codigo = document.getElementById('itemCodigo').value.trim();
    const quantidadeEl = document.getElementById('itemQuantidade');
    const quantidade = parseInt(quantidadeEl.value);
    const unidadeEl = document.getElementById('itemUnidade');
    const unidade = unidadeEl.value;
    const categoriaEl = document.getElementById('itemCategoria');
    const categoria = categoriaEl.value;
    const preco = parseFloat(document.getElementById('itemPreco').value) || 0;
    const precoEl = document.getElementById('itemPreco');
    const precoConfirmEl = document.getElementById('itemPrecoConfirm');
    const precoConfirm = precoConfirmEl ? (parseFloat(precoConfirmEl.value) || 0) : null;
    const fornecedor = document.getElementById('itemFornecedor').value;
    const dataProducao = document.getElementById('itemDataProducao').value;
    const dataValidade = document.getElementById('itemDataValidade').value;
    const imagemImg = document.getElementById('imagePreviewImg');
    const imagem = imagemImg.style.display !== 'none' ? imagemImg.src : null;
    const editId = this.dataset.editId;
    
    // Validações básicas
    if (!nome || nome.trim().length < 2) {
        showFieldError(nomeEl, 'Nome obrigatório (mín. 2 caracteres)');
        return;
    }
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
        showFieldError(quantidadeEl, 'Quantidade inválida');
        return;
    }
    if (!unidade) {
        showFieldError(unidadeEl, 'Selecione uma unidade');
        return;
    }
    if (!categoria) {
        showFieldError(categoriaEl, 'Selecione uma categoria');
        return;
    }
    // Validação de confirmação de preço (se presente)
    if (precoConfirmEl) {
        if (Number.isFinite(preco) && preco !== precoConfirm) {
            showFieldError(precoConfirmEl, 'Preços não coincidem');
            return;
        }
    }

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
    
    const itemSelect = document.getElementById('itemSelecionado');
    const itemId = itemSelect.value;
    const quantidadeEl = document.getElementById('quantidadeRetirar');
    const quantidade = parseInt(quantidadeEl.value);
    const motivo = document.getElementById('motivo').value;
    const observacoes = document.getElementById('observacoes').value;
    
    const item = estoque.find(i => i.id == itemId);
    
    if (!itemId) {
        showFieldError(itemSelect, 'Selecione um item');
        return;
    }
    if (!item) {
        showMessage('Item não encontrado!', 'error', 'page-retirar');
        return;
    }
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
        showFieldError(quantidadeEl, 'Quantidade inválida');
        return;
    }
    if (quantidade > item.quantidade) {
        showFieldError(quantidadeEl, `Disponível: ${item.quantidade}`);
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
    
    const itemSelect = document.getElementById('itemReposicao');
    const itemId = itemSelect.value;
    const quantidadeEl = document.getElementById('quantidadeRepor');
    const quantidade = parseInt(quantidadeEl.value);
    const dataRepor = document.getElementById('dataRepor').value;
    const fornecedor = document.getElementById('fornecedor').value;
    const custo = parseFloat(document.getElementById('custRepor').value) || 0;
    
    const item = estoque.find(i => i.id == itemId);
    
    if (!itemId) {
        showFieldError(itemSelect, 'Selecione um item');
        return;
    }
    if (!item) {
        showMessage('Item não encontrado!', 'error', 'page-repor');
        return;
    }
    if (!Number.isFinite(quantidade) || quantidade <= 0) {
        showFieldError(quantidadeEl, 'Quantidade inválida');
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

    // Adicionar animações suaves aos cartões e categorias (entrada em cascata)
    setTimeout(() => {
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((el, i) => {
            el.classList.remove('pop');
            void el.offsetWidth;
            setTimeout(() => el.classList.add('pop'), i * 120);
        });

        const catCards = document.querySelectorAll('.category-card');
        catCards.forEach((el, i) => {
            el.classList.remove('show');
            void el.offsetWidth;
            setTimeout(() => el.classList.add('show'), i * 100);
        });
    }, 60);
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

// ==================== MICROINTERAÇÕES DE BOTÕES (RIPPLE) ====================
function createRipple(element, event) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 1.2;
    ripple.style.width = ripple.style.height = size + 'px';
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
}

function attachButtonEffects() {
    // Make buttons ripple-capable
    document.querySelectorAll('button, .btn-small, .btn-primary, .btn-secondary').forEach(btn => {
        // Ensure positioned container
        if (!btn.classList.contains('ripple-container')) {
            btn.classList.add('ripple-container');
        }

        btn.addEventListener('click', function(e) {
            createRipple(this, e);
            // tiny scale feedback
            this.style.transition = 'transform 0.12s ease';
            this.style.transform = 'scale(0.985)';
            setTimeout(() => { this.style.transform = ''; }, 120);
        });
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
    // Logout imediato sem confirmação modal
    if (pageSwitchTimeout) {
        clearTimeout(pageSwitchTimeout);
        pageSwitchTimeout = null;
    }
    hideLoader();
    localStorage.removeItem('currentUser');
    window.location.replace('./index.html');
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
                const usernameEl = document.getElementById('usuarioUsername');
                const username = usernameEl.value.trim().toLowerCase();
                const nomeEl = document.getElementById('usuarioNome');
                const nome = nomeEl.value.trim();
                const emailEl = document.getElementById('usuarioEmail');
                const email = emailEl.value.trim().toLowerCase();
                const senhaEl = document.getElementById('usuarioSenha');
                const senha = senhaEl.value;
                const cargoEl = document.getElementById('usuarioCargo');
                const cargo = cargoEl.value;
                const confirmEl = document.getElementById('usuarioSenhaConfirm');
                const senhaConfirm = confirmEl ? (confirmEl.value || '') : '';

                const msgDiv = document.getElementById('msgUsuario');
                msgDiv.textContent = '';
                msgDiv.className = 'message';

                // Limpar erros prévios
                clearFieldError(usernameEl);
                clearFieldError(nomeEl);
                clearFieldError(emailEl);
                clearFieldError(senhaEl);
                clearFieldError(cargoEl);

                // Validações inline
                if (!editUsername && username.length < 4) {
                    showFieldError(usernameEl, 'Usuário deve ter no mínimo 4 caracteres');
                    return;
                }

                // Senha obrigatória ao criar; se editar, senha pode ficar vazia
                if (!editUsername && senha.length < 6) {
                    showFieldError(senhaEl, 'Senha deve ter no mínimo 6 caracteres');
                    return;
                }
                // Se senha fornecida, checar complexidade mínima (letras, números, maiúscula e especial)
                if (senha) {
                    const okLength = senha.length >= 6;
                    const okLetters = /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(senha);
                    const okNumbers = /\d/.test(senha);
                    const okUpper = /[A-ZÀ-Ö]/.test(senha);
                    const okSpecial = /[^A-Za-z0-9\s]/.test(senha);
                    const allOk = okLength && okLetters && okNumbers && okUpper && okSpecial;

                    // Atualizar checklist visualmente se presente
                    const checklist = document.getElementById('passwordChecklist');
                    if (checklist) {
                        const map = { length: okLength, letters: okLetters, numbers: okNumbers, uppercase: okUpper, special: okSpecial };
                        Object.keys(map).forEach(rule => {
                            const el = checklist.querySelector(`[data-rule="${rule}"]`);
                            if (!el) return;
                            el.classList.remove('valid', 'invalid');
                            const icon = el.querySelector('.check-icon');
                            if (map[rule]) {
                                el.classList.add('valid');
                                if (icon) icon.textContent = '✓';
                            } else {
                                el.classList.add('invalid');
                                if (icon) icon.textContent = '✕';
                            }
                        });
                    }

                    if (!allOk) {
                        showFieldError(senhaEl, 'Senha precisa conter letras, números, ao menos uma maiúscula e um caractere especial');
                        senhaEl.classList.add('shake');
                        setTimeout(() => senhaEl.classList.remove('shake'), 400);
                        return;
                    }
                }

                // Confirmação de senha
                if (!editUsername) {
                    if (senha !== senhaConfirm) {
                        showFieldError(confirmEl, 'Senhas não coincidem');
                        return;
                    }
                } else {
                    // Ao editar, se alterar a senha, confirmação deve bater
                    if (senha && senha !== senhaConfirm) {
                        showFieldError(confirmEl, 'Senhas não coincidem');
                        return;
                    }
                }

                if (!nome) {
                    showFieldError(nomeEl, 'Preencha o nome');
                    return;
                }

                if (!email) {
                    showFieldError(emailEl, 'Preencha o email pessoal');
                    return;
                }
                if (!isValidEmail(email)) {
                    showFieldError(emailEl, 'Email inválido');
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
