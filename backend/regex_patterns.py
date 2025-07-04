PATTERNS = {
    "numero_processo": [
        r"PROCESSO\s*N[º°]?\s*([0-9\-\./]+)",
        r"N[º°]?\s*PROCESSO[:\s]*([0-9\-\./]+)",
        r"PROC\s*N[º°]?\s*([0-9\-\./]+)",
        r"PROTOCOLO\s*N[º°]?\s*([0-9\-\./]+)",
    ],
    "cnpj": [
        r"\b\d{2}[.\s]?\d{3}[.\s]?\d{3}[/\.\s]?\d{4}[-\s]?\d{2}\b",
        r"CNPJ[:\s]*(\d{2}[.\s]?\d{3}[.\s]?\d{3}[/\.\s]?\d{4}[-\s]?\d{2})",
    ],
    "nome_contribuinte": [
        r"CONTRIBUINTE[:\s]+([A-ZÀ-Ý'\-\s]{5,})",
        r"PROPRIET[ÁA]RIO[:\s]+([A-ZÀ-Ý'\-\s]{5,})",
        r"NOME[:\s]+([A-ZÀ-Ý'\-\s]{5,})",
        r"RAZÃO\s+SOCIAL[:\s]+([A-ZÀ-Ý'\-\s]{5,})",
    ]
} 