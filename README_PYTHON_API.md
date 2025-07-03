# Hunter Fiscal - API Python com SpaCy

Esta implementação utiliza Python com SpaCy para extrair informações de documentos de forma mais precisa e inteligente.

## 🚀 Funcionalidades

- **Extração de Número do Processo**: Identifica números de processo usando regex e análise contextual
- **Extração de Nome do Contribuinte**: Usa SpaCy para análise linguística e identificação de entidades nomeadas
- **Extração de CNPJ**: Reconhece CNPJs com validação de formato
- **Processamento de PDF e Imagens**: Suporte para ambos os formatos
- **Cálculo de Confiança**: Avalia a qualidade da extração

## 📋 Pré-requisitos

- Python 3.8+
- Node.js (para o frontend React)
- Tesseract OCR (para processamento de imagens)

### Instalação do Tesseract OCR

**Windows:**

```bash
# Baixar e instalar de: https://github.com/UB-Mannheim/tesseract/wiki
# Adicionar ao PATH do sistema
```

**Linux:**

```bash
sudo apt-get install tesseract-ocr tesseract-ocr-por
```

**macOS:**

```bash
brew install tesseract tesseract-lang
```

## 🛠️ Configuração

### 1. Configurar Backend Python

```bash
# Executar script de configuração
python setup_backend.py
```

Ou manualmente:

```bash
# Instalar dependências
pip install -r requirements.txt

# Baixar modelo SpaCy
python -m spacy download pt_core_news_sm
```

### 2. Iniciar Servidor Backend

```bash
cd backend
python main.py
```

O servidor estará disponível em: `http://localhost:8000`

### 3. Iniciar Frontend React

```bash
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

## 🔧 Como Funciona

### Pipeline de Processamento

1. **Upload do Documento**: O frontend envia o arquivo para a API Python
2. **Extração de Texto**:
   - PDFs: Usa `pdfplumber` para extrair texto
   - Imagens: Usa `pytesseract` para OCR
3. **Processamento com SpaCy**: Análise linguística do texto extraído
4. **Extração de Informações**: Aplica regex e análise semântica
5. **Validação**: Verifica a qualidade e validade dos dados extraídos
6. **Retorno**: Envia resultados para o frontend

### Algoritmos de Extração

#### Número do Processo

- Regex patterns para diferentes formatos
- Busca por termos como "PROCESSO Nº", "PROTOCOLO", etc.

#### Nome do Contribuinte

- **Regex**: Busca por padrões como "CONTRIBUINTE:", "PROPRIETÁRIO:"
- **SpaCy**: Identificação de entidades nomeadas (PERSON)
- **Análise Sintática**: Busca por substantivos próprios (PROPN)

#### CNPJ

- Regex para formato padrão brasileiro
- Validação de dígitos (14 números)
- Limpeza de formatação

## 📊 Métricas de Confiança

A API calcula a confiança da extração baseada em:

- **Comprimento do Texto**: Textos maiores tendem a ter mais informações
- **Entidades Encontradas**: Quantidade de entidades nomeadas identificadas
- **Qualidade do OCR**: Proporção de caracteres válidos vs inválidos

## 🧪 Testando a API

### Endpoint de Saúde

```bash
curl http://localhost:8000/health
```

### Upload de Documento

```bash
curl -X POST http://localhost:8000/extract-info \
  -F "file=@seu_documento.pdf"
```

## 🔍 Exemplo de Resposta

```json
{
  "numero_processo": "2023/123456",
  "nome_contribuinte": "EMPRESA EXEMPLO LTDA",
  "cnpj_contribuinte": "12345678000190",
  "texto_extraido": "Texto completo extraído do documento...",
  "confianca": 0.85
}
```

## 🐛 Solução de Problemas

### Erro: "Modelo SpaCy não encontrado"

```bash
python -m spacy download pt_core_news_sm
```

### Erro: "Tesseract não encontrado"

- Verificar se Tesseract está instalado e no PATH
- Para Windows: Reiniciar terminal após instalação

### Erro de CORS

- Verificar se o frontend está rodando na porta correta
- Ajustar `allow_origins` no `main.py` se necessário

## 📈 Melhorias Futuras

- [ ] Treinamento de modelo customizado para documentos fiscais
- [ ] Extração de mais campos (valor, data, local)
- [ ] Cache de resultados para melhor performance
- [ ] Interface de administração para ajustar padrões
- [ ] Suporte a múltiplos idiomas

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.
