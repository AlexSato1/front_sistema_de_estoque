# 📷 Pasta de Imagens

Esta pasta é reservada para armazenar imagens dos produtos (opcional).

## ℹ️ Como as Imagens Funcionam

O sistema de estoque utiliza **upload de imagens através do navegador**, que são automaticamente convertidas para **Base64** e armazenadas no **localStorage** do navegador.

Isso significa que:
- ✅ As imagens são salvas junto com os dados do produto
- ✅ Não é necessário usar a pasta `images/`
- ✅ As imagens são persistentes entre sessões
- ℹ️ Cada imagem é convertida para texto e armazenada no localStorage

## 📁 Uso (Opcional)

Se desejar, você pode:
1. Colocar imagens dos produtos nesta pasta
2. Usar como referência para upload via interface do sistema

## 🖼️ Formatos Suportados

O sistema aceita os seguintes formatos de imagem:
- JPG / JPEG
- PNG
- GIF
- WebP
- SVG

## 💾 Capacidade de Armazenamento

**Atenção**: O localStorage tem limite de ~5-10MB por domínio, dependendo do navegador. Se adicionar muitas imagens grandes, este limite pode ser atingido.

Para evitar problemas:
- Use imagens em tamanho menor
- Comprima as imagens antes de fazer upload
- Considere redimensionar para ~300x300px antes de fazer upload

---

**Desenvolvido para sistema de estoque de lanchonete 🍔**
