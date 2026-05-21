# 🍔 Sistema de Estoque para Lanchonete - Pasta SRC

Bem-vindo! Esta pasta contém todos os arquivos do sistema de estoque.

## 📂 Estrutura de Arquivos

```
src/
├── index.html              # Página de login
├── dashboard.html          # Dashboard principal do sistema
├── login.js               # Lógica de autenticação
├── dashboard.js           # Lógica completa do sistema
├── styles.css             # Estilos do aplicativo
├── images/                # Pasta para referência de imagens
│   └── README.md          # Informações sobre upload de imagens
└── README.md              # Este arquivo
```

## 🚀 Como Usar

1. Abra o arquivo **`index.html`** em seu navegador
2. Use as credenciais de teste (consulte o login para usuários disponíveis)
3. Navegue pelo dashboard

## ✨ Novidades - Campos Adicionados

### 📦 Campo de Fornecedor
- Ao adicionar um produto, você pode especificar o fornecedor
- O fornecedor é exibido na tabela de estoque
- Pode ser editado ao editar um produto

### 📷 Upload de Imagens
- Clique na área de upload para selecionar uma imagem
- As imagens são automaticamente convertidas para Base64
- São armazenadas junto com os dados do produto
- Thumbnails aparecem na tabela de estoque
- Você pode editar a imagem ao editar um produto

## 📋 Funcionalidades Completas

### Dashboard
- ✅ Visualizar estoque com imagens e fornecedor
- ✅ Buscar produtos por nome
- ✅ Adicionar novos produtos com foto e fornecedor
- ✅ Editar produtos existentes
- ✅ Deletar produtos
- ✅ Retirar itens do estoque
- ✅ Fazer reposição (usuários com permissão)
- ✅ Visualizar histórico de movimentações
- ✅ Sistema de permissões por cargo

## 👥 Usuários Disponíveis

Todos com senha: `123456`

| Usuário | Cargo | Permissões |
|---------|-------|-----------|
| admin | Administração | ✅ Tudo (Adicionar, Editar, Deletar, Repor) |
| user2 | Garçom | ✅ Ver e Retirar |
| user3 | Cozinha | ✅ Ver e Retirar |
| user4 | Bebidas | ✅ Ver e Retirar |
| user5 | Retirada e Reposição | ✅ Ver, Retirar e Repor |

## 🗄️ Armazenamento de Dados

- **Estoque**: Armazenado em localStorage
- **Histórico**: Armazenado em localStorage
- **Imagens**: Convertidas para Base64 e salvas em localStorage
- **Dados do Usuário**: Mantidos durante a sessão

## 📱 Responsividade

Sistema totalmente responsivo para:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

## 🔒 Segurança

- ⚠️ **Importante**: Este é um sistema de demonstração usando localStorage
- As credenciais são armazenadas no cliente (não use em produção)
- Para produção, implemente um backend com autenticação segura

## 💡 Dicas

1. **Ao adicionar imagens**: Use imagens de tamanho pequeno para evitar exceder o limite do localStorage
2. **Editar produtos**: Clique no botão "✏️ Editar" na tabela de estoque
3. **Histórico**: Acesse o histórico para ver todas as movimentações
4. **Permissões**: As opções de menu mudam conforme o cargo do usuário

## 🎨 Personalização

Para personalizar o sistema:

- **Cores**: Edite as variáveis CSS em `styles.css` (`:root`)
- **Usuários**: Edite `login.js` para adicionar/remover usuários
- **Categorias**: Edite `dashboard.html` nas opções de categoria

## ⚙️ Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- LocalStorage disponível

## 📞 Suporte

Dúvidas frequentes:

**P: Onde as imagens são salvas?**
R: As imagens são convertidas para Base64 e salvas no localStorage do navegador junto com os dados do produto.

**P: Como fazer backup dos dados?**
R: Abra o DevTools (F12), vá para Application > LocalStorage e exporte os dados manualmente.

**P: Posso usar em múltiplos computadores?**
R: Os dados são específicos do navegador/computador. Para sincronizar, você precisa de um backend.

**P: Qual o limite de produtos?**
R: Teoricamente ilimitado, mas o localStorage tem limite de ~5-10MB. Com imagens grandes, pode atingir o limite mais rápido.

---

**Desenvolvido para gerenciamento eficiente de estoque em lanchonetes! 🍔**

Data: Maio/2026
