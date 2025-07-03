import spacy
import re
import pdfplumber
import pytesseract
from PIL import Image
import io
from typing import Dict, Any, Optional
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DocumentProcessor:
    def __init__(self):
        """Inicializar o processador com modelo SpaCy"""
        try:
            # Carregar modelo português do SpaCy
            self.nlp = spacy.load("pt_core_news_sm")
            logger.info("Modelo SpaCy carregado com sucesso")
        except OSError:
            logger.warning("Modelo pt_core_news_sm não encontrado. Instalando...")
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "pt_core_news_sm"])
            self.nlp = spacy.load("pt_core_news_sm")
        
        # Padrões regex para extração
        self.patterns = {
            "numero_processo": [
                r"PROCESSO\s*N[º°]?\s*([0-9\-\.\/]+)",
                r"N[º°]?\s*PROCESSO[:\s]*([0-9\-\.\/]+)",
                r"PROC\s*N[º°]?\s*([0-9\-\.\/]+)",
                r"PROTOCOLO\s*N[º°]?\s*([0-9\-\.\/]+)",
            ],
            "cnpj": [
                r"\b\d{2}[.\s]?\d{3}[.\s]?\d{3}[/.\s]?\d{4}[-\s]?\d{2}\b",
                r"CNPJ[:\s]*(\d{2}[.\s]?\d{3}[.\s]?\d{3}[/.\s]?\d{4}[-\s]?\d{2})",
            ],
            "nome_contribuinte": [
                r"CONTRIBUINTE[:\s]+([A-ZÀ-Ý'\-\s]{5,})",
                r"PROPRIET[ÁA]RIO[:\s]+([A-ZÀ-Ý'\-\s]{5,})",
                r"NOME[:\s]+([A-ZÀ-Ý'\-\s]{5,})",
                r"RAZÃO\s+SOCIAL[:\s]+([A-ZÀ-Ý'\-\s]{5,})",
            ]
        }

    async def process_document(self, file) -> Dict[str, Any]:
        """Processar documento e extrair informações"""
        try:
            # Extrair texto do documento
            texto = await self._extract_text(file)
            
            # Processar com SpaCy
            doc = self.nlp(texto)
            
            # Extrair informações usando regex e SpaCy
            resultado = {
                "texto_extraido": texto,
                "numero_processo": self._extract_numero_processo(texto),
                "nome_contribuinte": self._extract_nome_contribuinte(texto, doc),
                "cnpj_contribuinte": self._extract_cnpj(texto),
                "confianca": self._calculate_confidence(texto, doc)
            }
            
            logger.info(f"Informações extraídas: {resultado}")
            return resultado
            
        except Exception as e:
            logger.error(f"Erro ao processar documento: {str(e)}")
            raise

    async def _extract_text(self, file) -> str:
        """Extrair texto de PDF ou imagem"""
        content = await file.read()
        
        if file.content_type == "application/pdf":
            return self._extract_from_pdf(content)
        else:
            # Verificar se Tesseract está disponível
            try:
                import pytesseract
                # Testar se Tesseract está instalado
                pytesseract.get_tesseract_version()
                return self._extract_from_image(content)
            except Exception as e:
                logger.error(f"Tesseract não disponível: {str(e)}")
                raise Exception("Tesseract OCR não está instalado. Por favor, instale o Tesseract para processar imagens.")

    def _extract_from_pdf(self, content: bytes) -> str:
        """Extrair texto de PDF usando pdfplumber"""
        try:
            texto_completo = ""
            with pdfplumber.open(io.BytesIO(content)) as pdf:
                for page in pdf.pages:
                    texto = page.extract_text()
                    if texto:
                        texto_completo += texto + "\n"
            return texto_completo
        except Exception as e:
            logger.error(f"Erro ao extrair texto do PDF: {str(e)}")
            raise

    def _extract_from_image(self, content: bytes) -> str:
        """Extrair texto de imagem usando OCR"""
        try:
            image = Image.open(io.BytesIO(content))
            texto = pytesseract.image_to_string(image, lang='por')
            return texto
        except Exception as e:
            logger.error(f"Erro ao extrair texto da imagem: {str(e)}")
            raise

    def _extract_numero_processo(self, texto: str) -> Optional[str]:
        """Extrair número do processo usando regex"""
        for pattern in self.patterns["numero_processo"]:
            match = re.search(pattern, texto, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return None

    def _extract_cnpj(self, texto: str) -> Optional[str]:
        """Extrair CNPJ usando regex"""
        for pattern in self.patterns["cnpj"]:
            match = re.search(pattern, texto)
            if match:
                cnpj = match.group(1) if len(match.groups()) > 0 else match.group(0)
                # Limpar formatação
                cnpj_limpo = re.sub(r'[^\d]', '', cnpj)
                if len(cnpj_limpo) == 14:
                    return cnpj_limpo
        return None

    def _extract_nome_contribuinte(self, texto: str, doc) -> Optional[str]:
        """Extrair nome do contribuinte usando SpaCy e regex"""
        # Primeiro tentar com regex
        for pattern in self.patterns["nome_contribuinte"]:
            match = re.search(pattern, texto, re.IGNORECASE)
            if match:
                nome = match.group(1).strip()
                if self._is_valid_name(nome):
                    return nome
        
        # Se não encontrar com regex, usar SpaCy
        return self._extract_name_with_spacy(doc)

    def _extract_name_with_spacy(self, doc) -> Optional[str]:
        """Extrair nome usando análise linguística do SpaCy"""
        # Procurar por entidades nomeadas (PERSON)
        for ent in doc.ents:
            if ent.label_ == "PERSON" and len(ent.text.split()) >= 2:
                nome = ent.text.strip()
                if self._is_valid_name(nome):
                    return nome
        
        # Procurar por padrões de nome próprio
        for token in doc:
            if (token.pos_ == "PROPN" and 
                len(token.text) > 2 and 
                not token.is_stop and
                not token.like_num):
                
                # Verificar se há outros tokens próximos que formam um nome
                nome_completo = self._build_full_name(token, doc)
                if nome_completo and self._is_valid_name(nome_completo):
                    return nome_completo
        
        return None

    def _build_full_name(self, token, doc) -> Optional[str]:
        """Construir nome completo a partir de um token"""
        nome_parts = [token.text]
        
        # Procurar tokens próximos que podem ser parte do nome
        for i in range(token.i + 1, min(token.i + 5, len(doc))):
            next_token = doc[i]
            if (next_token.pos_ in ["PROPN", "NOUN"] and 
                not next_token.is_stop and
                not next_token.like_num and
                len(next_token.text) > 2):
                nome_parts.append(next_token.text)
            else:
                break
        
        if len(nome_parts) >= 2:
            return " ".join(nome_parts)
        return None

    def _is_valid_name(self, nome: str) -> bool:
        """Validar se o nome extraído é válido"""
        if not nome or len(nome) < 5:
            return False
        
        # Verificar se contém apenas letras, espaços e caracteres especiais válidos
        if not re.match(r"^[A-ZÀ-Ý'\-\s]+$", nome, re.IGNORECASE):
            return False
        
        # Verificar se tem pelo menos duas palavras
        palavras = nome.split()
        if len(palavras) < 2:
            return False
        
        # Verificar se não contém palavras comuns que não são nomes
        palavras_invalidas = {
            "PREFEITURA", "SECRETARIA", "NOTIFICAÇÃO", "MENSAGEM", 
            "INFORMAÇÕES", "DEFESA", "AUTUAÇÃO", "LOCAL", "DATA", 
            "HORA", "PLACA", "CÓDIGO", "ARTIGO", "VALOR", "PONTOS",
            "OBSERVAÇÃO", "CONDUTOR", "IDENTIFICADO", "NÃO", "ATO",
            "INFRAÇÃO", "VEÍCULO", "CATEGORIA", "ESPÉCIE", "PASSAGEIRO",
            "EMISSÃO", "ART", "INCISO", "MÉDIA", "GRAVE", "LEVE", "GRAVÍSSIMA"
        }
        
        for palavra in palavras:
            if palavra.upper() in palavras_invalidas:
                return False
        
        return True

    def _calculate_confidence(self, texto: str, doc) -> float:
        """Calcular confiança da extração baseada na qualidade do texto"""
        # Fatores para calcular confiança
        fatores = {
            "comprimento_texto": min(len(texto) / 1000, 1.0),  # Normalizar por 1000 chars
            "entidades_encontradas": min(len(doc.ents) / 10, 1.0),  # Normalizar por 10 entidades
            "qualidade_ocr": self._assess_ocr_quality(texto)
        }
        
        # Média ponderada dos fatores
        confianca = (
            fatores["comprimento_texto"] * 0.3 +
            fatores["entidades_encontradas"] * 0.4 +
            fatores["qualidade_ocr"] * 0.3
        )
        
        return min(confianca, 1.0)

    def _assess_ocr_quality(self, texto: str) -> float:
        """Avaliar qualidade do OCR baseado em características do texto"""
        if not texto:
            return 0.0
        
        # Contar caracteres válidos vs inválidos
        chars_validos = len(re.findall(r'[a-zA-ZÀ-Ý0-9\s]', texto))
        total_chars = len(texto)
        
        if total_chars == 0:
            return 0.0
        
        # Proporção de caracteres válidos
        proporcao_valida = chars_validos / total_chars
        
        # Verificar se há muitas quebras de linha ou caracteres estranhos
        quebras_linha = texto.count('\n')
        chars_estranhos = len(re.findall(r'[^\w\s]', texto))
        
        # Penalizar por muitos caracteres estranhos
        penalidade = min(chars_estranhos / len(texto), 0.5)
        
        qualidade = proporcao_valida - penalidade
        return max(qualidade, 0.0) 