// Carregar usuários do localStorage ou usar padrão
let users = {};

function loadUsers() {
    const stored = localStorage.getItem('users');
    if (stored) {
        users = JSON.parse(stored);
    } else {
        // Usuários padrão iniciais
        users = {
            admin: {
                password: '03@09030201Ok',
                name: 'Administrador',
                email: 'admin@lanchonete.com',
                role: 'admin',
                cargo: 'Administração',
                permissions: ['view', 'add', 'remove', 'restock']
            },
            garcom: {
                password: '69#432382Af',
                name: 'João Silva',
                email: 'joao@lanchonete.com',
                role: 'limited',
                cargo: 'Garçom',
                permissions: ['remove']
            },
            cozinha: {
                password: '349$43242Er',
                name: 'Maria Santos',
                email: 'maria@lanchonete.com',
                role: 'limited',
                cargo: 'Cozinha',
                permissions: ['remove']
            },
            chefebar: {
                password: '845&432Hg',
                name: 'Pedro Costa',
                email: 'pedro@lanchonete.com',
                role: 'limited',
                cargo: 'Bebidas',
                permissions: ['view', 'remove', 'restock']
            },
            operator: {
                password: '43243Ym!',
                name: 'Ana Souza',
                email: 'ana@lanchonete.com',
                role: 'limited',
                cargo: 'Operador',
                permissions: ['remove']
            }
        };
        saveUsers();
    }
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Função para alternar entre login, cadastro e recuperação
function toggleForms(formName) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const recoveryForm = document.getElementById('recoveryForm');
    const resetForm = document.getElementById('resetForm');
    
    // Esconder todos
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    recoveryForm.style.display = 'none';
    resetForm.style.display = 'none';
    
    // Mostrar o selecionado
    if (formName === 'login') {
        loginForm.style.display = 'block';
    } else if (formName === 'register') {
        registerForm.style.display = 'block';
    } else if (formName === 'recovery') {
        recoveryForm.style.display = 'block';
    } else if (formName === 'reset') {
        resetForm.style.display = 'block';
    }
    
    document.getElementById('loginError').textContent = '';
}

// Event listener para login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.textContent = '';
    
    // Validar credenciais
    if (users[username] && users[username].password === password) {
        // Armazenar usuário logado
        const user = users[username];
        localStorage.setItem('currentUser', JSON.stringify({
            username,
            name: user.name,
            role: user.role,
            cargo: user.cargo,
            permissions: user.permissions
        }));
        
        // Redirecionar para dashboard
        window.location.href = './dashboard.html';
    } else {
        errorDiv.textContent = 'Usuário ou senha inválidos!';
        errorDiv.style.display = 'block';
    }
});

// Event listener para cadastro
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value.trim();
    const username = document.getElementById('regUsername').value.trim().toLowerCase();
    const password = document.getElementById('regPassword').value;
    const email = document.getElementById('regEmail').value.trim();
    const cargo = document.getElementById('regCargo').value;
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.textContent = '';
    
    // Validações
    if (username.length < 4) {
        errorDiv.textContent = 'Usuário deve ter no mínimo 4 caracteres!';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (password.length < 6) {
        errorDiv.textContent = 'Senha deve ter no mínimo 6 caracteres!';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (users[username]) {
        errorDiv.textContent = 'Este usuário já existe!';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (!name) {
        errorDiv.textContent = 'Preencha o nome completo!';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (!email) {
        errorDiv.textContent = 'Preencha o email!';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Determinar permissões baseado no cargo
    let permissions = ['view'];
    if (cargo === 'Cozinha' || cargo === 'Bebidas') {
        permissions = ['view', 'remove'];
    } else if (cargo === 'Estoque') {
        permissions = ['view', 'add', 'remove', 'restock'];
    }
    
    // Criar novo usuário
    users[username] = {
        password: password,
        name: name,
        email: email,
        role: 'limited',
        cargo: cargo,
        permissions: permissions
    };
    
    saveUsers();
    
    // Sucesso - redirecionar para login
    errorDiv.style.color = 'green';
    errorDiv.textContent = '✅ Cadastro realizado com sucesso! Redirecionando...';
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('regName').value = '';
        document.getElementById('regUsername').value = '';
        document.getElementById('regEmail').value = '';
        document.getElementById('regPassword').value = '';
        document.getElementById('regCargo').value = '';
        toggleForms('login');
    }, 2000);
});

// ==================== RECUPERAÇÃO DE SENHA ====================

// Event listener para formulário de recuperação
document.getElementById('recoveryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('recoveryUsername').value.trim().toLowerCase();
    const email = document.getElementById('recoveryEmail').value.trim().toLowerCase();
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.textContent = '';
    
    const usersData = localStorage.getItem('users');
    const usersObj = JSON.parse(usersData);
    
    if (!usersObj[username]) {
        errorDiv.textContent = '❌ Usuário não encontrado!';
        errorDiv.style.color = '#c0392b';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Verificar se o email corresponde
    if (usersObj[username].email.toLowerCase() !== email) {
        errorDiv.textContent = '❌ Email não corresponde ao usuário informado!';
        errorDiv.style.color = '#c0392b';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Gerar código de verificação (6 dígitos)
    const verificationCode = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
    
    // Salvar dados de recuperação temporários
    const recoveryData = {
        username: username,
        code: verificationCode,
        timestamp: Date.now()
    };
    
    localStorage.setItem('passwordRecovery', JSON.stringify(recoveryData));
    
    // Obter email do usuário
    const userEmail = usersObj[username].email;
    const userName = usersObj[username].name;
    
    // Mascarar email para mostrar com segurança (ex: ad***@gmail.com)
    const emailParts = userEmail.split('@');
    const maskedEmail = emailParts[0].substring(0, 2) + '***@' + emailParts[1];
    
    // Verificar se EmailJS está configurado
    if (typeof emailjs === 'undefined' || !emailjs) {
        // Fallback: mostrar código na tela (para testes sem EmailJS)
        errorDiv.style.color = 'orange';
        errorDiv.innerHTML = `
            ⚠️ <strong>Modo de Teste - EmailJS não configurado</strong><br>
            📧 Código será enviado para: <strong>${maskedEmail}</strong><br>
            🔐 <strong>Seu código de verificação:</strong> <strong style="font-size: 18px; color: #2196F3;">${verificationCode}</strong><br>
            <small style="color: #666;">Confira o email em seu cliente de email pessoal</small>
        `;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            toggleForms('reset');
        }, 3000);
        return;
    }
    
    // Enviar email com EmailJS
    emailjs.send('service_lanchonete', 'template_recovery', {
        to_email: userEmail,
        user_name: userName,
        verification_code: verificationCode,
        expires_in: '10 minutos'
    }).then(function(response) {
        errorDiv.style.color = 'green';
        errorDiv.textContent = `✅ Código de verificação enviado para ${maskedEmail}. Defina uma nova senha.`;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            toggleForms('reset');
        }, 2000);
    }).catch(function(error) {
        // Se falhar com EmailJS, mostrar código como fallback
        errorDiv.style.color = 'orange';
        errorDiv.innerHTML = `
            ⚠️ <strong>Não conseguimos enviar por email</strong><br>
            🔐 <strong>Código de recuperação:</strong> <strong style="font-size: 18px; color: #2196F3;">${verificationCode}</strong><br>
            <small style="color: #666;">Procure pela mensagem no seu cliente de email pessoal</small>
        `;
        errorDiv.style.display = 'block';
        console.error('Erro ao enviar email:', error);
        
        setTimeout(() => {
            toggleForms('reset');
        }, 3000);
    });
});

// Event listener para redefinir senha
document.getElementById('resetForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    errorDiv.textContent = '';
    
    if (newPassword.length < 6) {
        errorDiv.textContent = '❌ Senha deve ter no mínimo 6 caracteres!';
        errorDiv.style.color = '#c0392b';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        errorDiv.textContent = '❌ As senhas não conferem!';
        errorDiv.style.color = '#c0392b';
        errorDiv.style.display = 'block';
        return;
    }
    
    const recoveryData = localStorage.getItem('passwordRecovery');
    if (!recoveryData) {
        errorDiv.textContent = '❌ Erro na recuperação. Tente novamente.';
        errorDiv.style.color = '#c0392b';
        errorDiv.style.display = 'block';
        return;
    }
    
    const data = JSON.parse(recoveryData);
    const usersData = localStorage.getItem('users');
    const users = JSON.parse(usersData);
    
    // Atualizar senha
    users[data.username].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Limpar dados de recuperação
    localStorage.removeItem('passwordRecovery');
    
    // Sucesso
    errorDiv.style.color = 'green';
    errorDiv.textContent = '✅ Senha redefinida com sucesso! Redirecionando para login...';
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        toggleForms('login');
    }, 2000);
});

// Limpar erros ao digitar
document.getElementById('username').addEventListener('input', function() {
    document.getElementById('loginError').textContent = '';
});

document.getElementById('password').addEventListener('input', function() {
    document.getElementById('loginError').textContent = '';
});

// Inicializar
loadUsers();
