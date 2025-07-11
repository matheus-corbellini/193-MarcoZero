FROM python:3.10-slim

# Instala dependências do sistema
RUN apt-get update && \
    apt-get install -y tesseract-ocr tesseract-ocr-por && \
    rm -rf /var/lib/apt/lists/*

# Instala dependências Python
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Baixa o modelo SpaCy
RUN python -m spacy download pt_core_news_sm

# Copia o restante do código
COPY . .

# Expõe a porta
EXPOSE 8000

# Comando de start
CMD ["python", "-m", "backend.main"]