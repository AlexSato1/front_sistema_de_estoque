# Sistema de Estoque — Frontend (local)

Breve guia para testar o frontend localmente e verificar as melhorias (tipografia, animações, responsividade, microinterações).

## Estrutura principal
- `src/index.html` — tela de login
- `src/dashboard.html` — painel principal
- `src/styles.css` — estilos principais (tipografia, animações, responsividade)
- `src/dashboard.js` — lógica do dashboard, navegação e interações

## Usuários de demonstração
Use um dos usuários abaixo para entrar na aplicação (não há backend — o login espera um objeto em `localStorage` ou você pode simular um `currentUser`):

- Admin (exemplo): usuário `admin`, senha `03@09030201Ok`

OBS: a aplicação atualmente usa dados locais em `localStorage` para demonstrar o fluxo.

## Rodar localmente

Opção 1 — Python 3 (recomendado, simples):

```powershell
# abra um terminal no diretório do projeto (pasta que contém src/)
python -m http.server 8000
# depois abra http://localhost:8000/src/index.html
```

Opção 2 — Live Server (VS Code):

- Instale a extensão Live Server e clique com o botão direito em `src/index.html` → "Open with Live Server".

Opção 3 — http-server (Node.js):

```powershell
npm install -g http-server
http-server -p 8000
# abrir http://localhost:8000/src/index.html
```

## Passos rápidos para testar
1. Abra `src/index.html` no navegador via um dos métodos acima.
2. Faça login (ou carregue manualmente um objeto `currentUser` no console do DevTools):

```js
localStorage.setItem('currentUser', JSON.stringify({ name: 'Demo', cargo: 'Admin', role: 'admin', permissions: ['add','remove','restock'] }));
window.location.href = './src/dashboard.html';
```

3. Navegue pelo menu — as páginas trocam imediatamente (sem delay). Observe:
   - animações de entrada dos cartões no dashboard;
   - hover e ripple em botões;
   - tabelas responsivas se adaptando em telas pequenas.

4. Clique em `Sair` — o logout é imediato e sobrescreve o `currentUser` em `localStorage`.

## Onde ajustar comportamentos
- Para alterar estilos e animações: edite `src/styles.css`.
- Para lógica de navegação e logout: `src/dashboard.js`.

## Notas finais
- Foi adicionada a fonte `Inter` para melhor legibilidade.
- Tabelas pequenas são apresentadas como cards em mobile (use DevTools para testar responsividade).

Se quiser, eu posso acrescentar scripts npm, otimizações de assets (compressão de imagens) ou tema claro/escuro.
