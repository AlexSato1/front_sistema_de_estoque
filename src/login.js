// Usuários predefinidos
const users = {
    admin: {
        password: '932544231321',
        name: 'Administrador',
        role: 'admin',
        cargo: 'Administração',
        permissions: ['view', 'add', 'remove', 'restock']
    },
    garcom: {
        password: '4324213',
        name: 'João Silva',
        role: 'limited',
        cargo: 'Garçom',
        permissions: ['remove']
    },
    cozinha: {
        password: '32132142',
        name: 'Maria Santos',
        role: 'limited',
        cargo: 'Cozinha',
        permissions: ['remove']
    },
    chefebar: {
        password: '432421435211',
        name: 'Pedro Costa',
        role: 'limited',
        cargo: 'Bebidas',
        permissions: ['view', 'remove', 'restock']
    },
    operator: {
        password: '213213121',
        name: 'Ana Souza',
        role: 'limited',
        cargo: 'Operador',
        permissions: ['remove']
    }
};

// Event listener para o formulário de login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
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

// Limpar erro quando começar a digitar
document.getElementById('username').addEventListener('input', function() {
    document.getElementById('loginError').textContent = '';
});

document.getElementById('password').addEventListener('input', function() {
    document.getElementById('loginError').textContent = '';
});
