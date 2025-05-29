# 🚀 Conectar ao GitHub - Instruções

## Passo a Passo para Conectar seu Projeto ao GitHub

### 1. Criar Repositório no GitHub
- Acesse: https://github.com/new
- Nome sugerido: `birthday-history-app`
- Descrição: `Homepage showing famous birthdays and historical events for any date`
- **NÃO** marque "Initialize with README"

### 2. COMANDOS PRONTOS PARA USAR:

**Copie e cole estes comandos no terminal do Emergent** (substitua pela sua URL do GitHub):

```bash
# Passo 1: Adicionar o remote do GitHub (SUBSTITUA PELA SUA URL)
git remote add origin https://github.com/SEU_USUARIO/birthday-history-app.git

# Passo 2: Verificar se foi adicionado
git remote -v

# Passo 3: Fazer push para o GitHub
git push -u origin main
```

### 3. Exemplo Real:
Se sua URL for `https://github.com/joao123/birthday-app.git`:

```bash
git remote add origin https://github.com/joao123/birthday-app.git
git remote -v
git push -u origin main
```

### 3. Exemplo Completo
Se seu usuário for `joao123` e o repositório `birthday-app`:

```bash
git remote add origin https://github.com/joao123/birthday-app.git
git remote -v
git add .
git commit -m "feat: Add birthday and historical events homepage"
git push -u origin main
```

### 4. Verificar no GitHub
Após executar os comandos, acesse seu repositório no GitHub para ver o código!

## 📁 Estrutura do Projeto que será enviada:

```
/app/
├── frontend/
│   ├── src/
│   │   ├── App.js          # ← Seu código React principal
│   │   ├── App.css         # ← Estilos customizados
│   │   └── ...
│   ├── package.json        # ← Dependências
│   └── ...
├── backend/
├── README.md
└── ...
```

## 🎯 Recursos do Projeto:
- ✅ Homepage com aniversários famosos
- ✅ Eventos históricos por data
- ✅ Design responsivo com Tailwind CSS
- ✅ Integração com API da Wikipedia
- ✅ Seletor de datas interativo
- ✅ Imagens profissionais do Unsplash