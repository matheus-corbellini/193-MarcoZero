# MarcoZERO - Sistema de Extração de Dados Fiscais

## Visão Geral

Este projeto é composto por um frontend em React + TypeScript (Vite) e um backend em Python (FastAPI + SpaCy) para extração inteligente de informações de documentos fiscais (PDFs e imagens). O sistema utiliza OCR (Tesseract) e NLP (SpaCy) para identificar dados como número do processo, nome do contribuinte e CNPJ.

## Pré-requisitos

- Node.js 18+
- Python 3.8+
- Tesseract OCR

## Instalação e Configuração

### 1. Backend Python

- Instale as dependências:
  ```bash
  pip install -r requirements.txt
  ```
- Baixe o modelo SpaCy:
  ```bash
  python -m spacy download pt_core_news_sm
  ```
- (Opcional) Execute o script de setup:
  ```bash
  python setup_backend.py
  ```
- Instale o Tesseract OCR:
  - Windows: Baixe de https://github.com/UB-Mannheim/tesseract/wiki e adicione ao PATH
  - Linux: `sudo apt-get install tesseract-ocr tesseract-ocr-por`
  - macOS: `brew install tesseract tesseract-lang`

### 2. Frontend React

- Instale as dependências:
  ```bash
  npm install
  ```

## Como Rodar

### Backend

```bash
cd backend
python main.py
```

O backend estará disponível em: http://localhost:8000

### Frontend

```bash
npm run dev
```

O frontend estará disponível em: http://localhost:5173

## Estrutura do Projeto

- `src/` - Código fonte do frontend
  - `components/` - Componentes React reutilizáveis
  - `context/` - Contextos globais (ex: AuthContext, PdfDataContext)
  - `hooks/` - Hooks customizados (ex: useAuth, usePdfData)
  - `pages/` - Páginas principais (login, register, upload, results)
  - `styles/` - CSS modularizado por componente/página
  - `api/` - Rotas de integração frontend-backend
  - `type/` - Tipagens TypeScript
- `backend/` - Código fonte do backend Python
  - `main.py` - Inicialização da API FastAPI
  - `routes.py` - Rotas da API
  - `entity_extractor.py`, `extractor.py` - Lógica de extração
  - `confidence.py` - Cálculo de confiança

## Como Contribuir

1. Fork este repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## Licença

MIT
