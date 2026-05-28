# 📧 Configurar Envio de Email - EmailJS

## O que é?
EmailJS é um serviço que permite enviar emails diretamente do frontend (sem backend) de forma gratuita.

## Como Configurar?

### 1️⃣ Criar Conta no EmailJS

1. Acesse: https://www.emailjs.com/
2. Clique em **"Sign Up"**
3. Preencha com:
   - Email
   - Senha
   - Nome

### 2️⃣ Conectar seu Email (Gmail)

1. Após fazer login, vá em **"Email Services"** (lado esquerdo)
2. Clique em **"Add Service"**
3. Selecione **"Gmail"**
4. Siga os passos:
   - Você será redirecionado para autorizar o acesso
   - Clique em "Continue"
   - Selecione sua conta Gmail
   - Clique em "Allow"
5. Volte ao EmailJS e finalize

### 3️⃣ Criar Template de Email

1. Vá em **"Email Templates"**
2. Clique em **"Create New Template"**
3. Preencha:
   - **Template ID**: `template_recovery`
   - **Subject**: `🔐 Código de Recuperação de Senha`

4. Na seção **"Content"**, use este template:

```html
Olá {{user_name}},

Você solicitou a recuperação de senha da sua conta no Sistema de Estoque.

🔐 Seu código de verificação é:
{{verification_code}}

⏰ Este código é válido por {{expires_in}}.

Se você não solicitou esta recuperação, ignore este email.

Atenciosamente,
Sistema de Estoque 🍔
```

5. Clique em **"Save"**

### 4️⃣ Criar Service ID

1. Volte para **"Email Services"**
2. Clique no serviço Gmail que você criou
3. Copie o **"Service ID"** (exemplo: `service_lanchonete`)
4. Salve este ID

### 5️⃣ Obter Public Key (Chave Pública)

1. Vá em **"Account"** (ícone de engrenagem)
2. Clique em **"API Keys"**
3. Copie a **"Public Key"**

### 6️⃣ Atualizar o Código

No arquivo `src/index.html`, encontre esta linha:

```html
emailjs.init('YOUR_PUBLIC_KEY');
```

E substitua `YOUR_PUBLIC_KEY` pela sua chave pública. Exemplo:

```html
emailjs.init('abc123def456ghi789');
```

### 7️⃣ Testar

1. Abra a página no navegador
2. Clique em "Esqueci a senha"
3. Digite um usuário (ex: `admin`)
4. Clique em "Enviar Código"
5. Verifique seu email! ✅

## 📋 Usuários de Teste

| Usuário | Email | Senha |
|---------|-------|-------|
| admin | admin@lanchonete.com | 03@09030201Ok |
| garcom | joao@lanchonete.com | 69#432382Af |
| cozinha | maria@lanchonete.com | 349$43242Er |
| chefebar | pedro@lanchonete.com | 845&432Hg |
| operator | ana@lanchonete.com | 43243Ym! |

> **Obs**: Você pode alterar esses emails para os seus próprios no localStorage após criar novos usuários.

## ⚠️ Importante

- O EmailJS é **GRATUITO** para até 200 emails/mês
- Não compartilhe sua **Private Key**
- A **Public Key** é segura para usar no frontend

## 🆘 Problemas?

Se receber erro "Falha ao enviar email":

1. Verifique se a Public Key está correta
2. Verifique se o Service ID no código está correto
3. Verifique se o Template ID no código está correto
4. Tente novamente em alguns minutos

---

**Pronto! Agora os códigos de recuperação serão enviados por email! 🚀**
