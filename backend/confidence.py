import re
from typing import Any

def calculate_confidence(texto: str, doc: Any) -> float:
    """Calcular confiança da extração baseada na qualidade do texto e entidades."""
    fatores = {
        "comprimento_texto": min(len(texto) / 1000, 1.0),
        "entidades_encontradas": min(len(getattr(doc, 'ents', [])) / 10, 1.0),
        "qualidade_ocr": assess_ocr_quality(texto)
    }
    confianca = (
        fatores["comprimento_texto"] * 0.3 +
        fatores["entidades_encontradas"] * 0.4 +
        fatores["qualidade_ocr"] * 0.3
    )
    return min(confianca, 1.0)

def assess_ocr_quality(texto: str) -> float:
    """Avaliar qualidade do OCR baseado em características do texto."""
    if not texto:
        return 0.0
    chars_validos = len(re.findall(r'[a-zA-ZÀ-Ý0-9\s]', texto))
    total_chars = len(texto)
    if total_chars == 0:
        return 0.0
    proporcao_valida = chars_validos / total_chars
    quebras_linha = texto.count('\n')
    chars_estranhos = len(re.findall(r'[^\w\s]', texto))
    penalidade = min(chars_estranhos / len(texto), 0.5)
    qualidade = proporcao_valida - penalidade
    return max(qualidade, 0.0) 