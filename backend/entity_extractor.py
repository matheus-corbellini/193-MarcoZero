import re
import spacy
import logging
from typing import Optional
from .regex_patterns import PATTERNS

logger = logging.getLogger(__name__)

class EntityExtractor:
    def __init__(self):
        self.nlp = spacy.load("pt_core_news_sm")
        self.patterns = PATTERNS

    def extract_numero_processo(self, texto: str) -> Optional[str]:
        for pattern in self.patterns["numero_processo"]:
            match = re.search(pattern, texto, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return None

    def extract_cnpj(self, texto: str) -> Optional[str]:
        for pattern in self.patterns["cnpj"]:
            match = re.search(pattern, texto)
            if match:
                cnpj = match.group(1) if len(match.groups()) > 0 else match.group(0)
                cnpj_limpo = re.sub(r'[^\d]', '', cnpj)
                if len(cnpj_limpo) == 14:
                    return cnpj_limpo
        return None

    def extract_nome_contribuinte(self, texto: str) -> Optional[str]:
        doc = self.nlp(texto)
        for pattern in self.patterns["nome_contribuinte"]:
            match = re.search(pattern, texto, re.IGNORECASE)
            if match:
                nome = match.group(1).strip()
                if self._is_valid_name(nome):
                    return nome
        return self._extract_name_with_spacy(doc)

    def extract_numero_auto_infracao(self, texto: str) -> Optional[str]:
        for pattern in self.patterns["numero_auto_infracao"]:
            match = re.search(pattern, texto, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        return None

    def _extract_name_with_spacy(self, doc) -> Optional[str]:
        for ent in doc.ents:
            if ent.label_ == "PERSON" and len(ent.text.split()) >= 2:
                nome = ent.text.strip()
                if self._is_valid_name(nome):
                    return nome
        for token in doc:
            if (token.pos_ == "PROPN" and len(token.text) > 2 and not token.is_stop and not token.like_num):
                nome_completo = self._build_full_name(token, doc)
                if nome_completo and self._is_valid_name(nome_completo):
                    return nome_completo
        return None

    def _build_full_name(self, token, doc) -> Optional[str]:
        nome_parts = [token.text]
        for i in range(token.i + 1, min(token.i + 5, len(doc))):
            next_token = doc[i]
            if (next_token.pos_ in ["PROPN", "NOUN"] and not next_token.is_stop and not next_token.like_num and len(next_token.text) > 2):
                nome_parts.append(next_token.text)
            else:
                break
        if len(nome_parts) >= 2:
            return " ".join(nome_parts)
        return None

    def _is_valid_name(self, nome: str) -> bool:
        if not nome or len(nome) < 5:
            return False
        if not re.match(r"^[A-ZÀ-Ý'\-\s]+$", nome, re.IGNORECASE):
            return False
        palavras = nome.split()
        if len(palavras) < 2:
            return False
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