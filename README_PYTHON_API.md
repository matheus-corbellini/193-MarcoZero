# Hunter Fiscal - API Python com SpaCy

## Visão Geral do Projeto

Este sistema é composto por dois módulos principais:

- **Backend Python (FastAPI + SpaCy)**: Responsável pela extração de informações de documentos fiscais (PDFs e imagens) usando OCR (Tesseract) e NLP (SpaCy).
- **Frontend React + TypeScript**: Interface web para upload de documentos, visualização e interação com os dados extraídos.

## Arquitetura

```
Usuário ⇄ Frontend (React) ⇄ Backend (FastAPI/Python) ⇄ Tesseract/SpaCy
```

- O frontend envia arquivos para o backend via API REST.
- O backend processa, extrai informações e retorna os resultados para o frontend.

## 📋 Pré-requisitos

- Python 3.8+
- Node.js (para o frontend React)
- Tesseract OCR (para processamento de imagens)

## 🛠️ Instalação e Configuração

### Backend Python

```bash
# Instalar dependências
pip install -r requirements.txt
# Baixar modelo SpaCy
python -m spacy download pt_core_news_sm
```

### Frontend React

```bash
npm install
```

### Instalar Tesseract OCR

- Windows: Baixe de https://github.com/UB-Mannheim/tesseract/wiki e adicione ao PATH
- Linux: `sudo apt-get install tesseract-ocr tesseract-ocr-por`
- macOS: `brew install tesseract tesseract-lang`

## 🚀 Como Rodar

### Backend

```bash
cd backend
python main.py
```

Acesse: http://localhost:8000

### Frontend

```bash
npm run dev
```

Acesse: http://localhost:5173

## 📁 Estrutura do Projeto

- `backend/` - Código Python (API, extração, utilitários)
- `src/` - Frontend React
  - `components/` - Componentes reutilizáveis
  - `context/` - Contextos globais
  - `hooks/` - Hooks customizados
  - `pages/` - Páginas principais
  - `styles/` - CSS modularizado
  - `api/` - Rotas de integração
  - `type/` - Tipagens TypeScript

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT
