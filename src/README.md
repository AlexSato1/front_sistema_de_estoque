# 🍔 Sistema de Estoque para Lanchonete

Um sistema de gerenciamento de estoque completo para lanchonetes, desenvolvido em HTML, CSS e JavaScript vanilla (sem dependências externas).

## 📋 Funcionalidades

### 👥 Controle de Usuários e Permissões
- **Usuários predefinidos** com diferentes níveis de acesso
- **Sistema de cargos** (Administração, Cozinha, Garçom, Bebidas, Retirada e Reposição)
- **Permissões diferenciadas** por usuário

### 📦 Gestão de Estoque
- ✅ **Adicionar items** ao estoque (apenas administrador)
- ✅ **Retirar items** do estoque (todos os usuários)
- ✅ **Repor items** (administrador e responsável de retirada/reposição)
- ✅ **Editar items** (apenas administrador)
- ✅ **Deletar items** (apenas administrador)
- ✅ **Buscar items** por nome
- ✅ **Visualizar histórico** de movimentações

### 📊 Dashboard Intuitivo
- Interface responsiva e intuitiva
- Painel lateral com navegação
- Tabelas com informações detalhadas
- Histórico completo de movimentações

## 👤 Usuários e Permissões

### Administrador
- **Usuário**: `admin`
- **Senha**: `123456`
- **Cargo**: Administração
- **Permissões**: Adicionar, Retirar, Repor, Editar e Deletar items

### Usuários Limitados
| Usuário | Senha | Cargo | Permissões |
|---------|-------|-------|-----------|
| user2 | 123456 | Garçom | Ver e Retirar |
| user3 | 123456 | Cozinha | Ver e Retirar |
| user4 | 123456 | Bebidas | Ver e Retirar |
| user5 | 123456 | Retirada e Reposição | Ver, Retirar e Repor |

## 🚀 Como Usar

### 1. Abrir o Sistema
Abra o arquivo `index.html` em um navegador web.

### 2. Fazer Login
1. Insira o nome de usuário
2. Insira a senha
3. Clique em "Entrar"

### 3. Navegar pelo Sistema
Use o menu lateral (📦 Estoque, ➕ Adicionar Item, ➖ Retirar Item, 🔄 Reposição, 📋 Histórico)

### 4. Operações Disponíveis

#### 📦 Visualizar Estoque
- Lista todos os items com quantidade e categoria
- Busque items pelo nome
- Edite ou delete items (apenas admin)

#### ➕ Adicionar Item (Admin)
1. Preencha os dados do item
2. Clique em "Adicionar Item"
3. O item será adicionado e registrado no histórico

#### ➖ Retirar Item
1. Selecione o item
2. Digite a quantidade a retirar
3. Selecione o motivo (Uso, Descarte, Danos, etc)
4. Clique em "Retirar Item"
5. A operação é registrada no histórico

#### 🔄 Reposição (Admin e User5)
1. Selecione o item
2. Digite a quantidade a repor
3. Preencha data, fornecedor e custo (opcionais)
4. Clique em "Fazer Reposição"

#### 📋 Histórico
- Visualize todas as movimentações
- Filtre por tipo (Adicionado, Removido, Reposição)
- Veja quem fez cada operação e quando

## 🗄️ Armazenamento de Dados

O sistema usa `localStorage` do navegador para armazenar:
- **Estoque**: Lista de items com quantidades
- **Histórico**: Registro de todas as movimentações
- **Usuário logado**: Dados da sessão atual

**Dados são persistidos entre sessões**, mas são específicos de cada navegador/computador.

## 📱 Responsividade

O sistema é responsivo e funciona bem em:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

## 🎨 Design

- **Cores**: Tema laranja/vermelho moderno
- **Tipografia**: Segoe UI com fallbacks
- **Ícones**: Emojis para melhor visualização
- **Animações**: Transições suaves e agradáveis

## ⚙️ Configuração

Para personalizar o sistema, edite:

- **login.js**: Modificar usuários e permissões
- **styles.css**: Cores, fontes e estilos
- **dashboard.js**: Lógica e funcionalidades

## 📝 Tecnologias

- ✅ HTML5
- ✅ CSS3
- ✅ JavaScript ES6+
- ✅ LocalStorage API
- ✅ Sem dependências externas

## 📞 Suporte

Dúvidas sobre funcionalidades? Verifique:
1. Se você tem permissão para a operação
2. Os dados no localStorage (F12 > Application > LocalStorage)
3. O console do navegador para erros (F12 > Console)

## 📄 Licença

Livre para uso e modificação.

---

**Desenvolvido para gerenciamento eficiente de estoque em lanchonetes! 🍔**
