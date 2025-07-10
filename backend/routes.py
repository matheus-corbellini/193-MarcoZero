from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
from typing import Optional
from .document_processor import process_document

router = APIRouter()

class ExtractionResult(BaseModel):
    numero_processo: Optional[str] = None
    numero_auto_infracao: Optional[str] = None
    nome_contribuinte: Optional[str] = None
    cnpj_contribuinte: Optional[str] = None
    texto_extraido: str
    confianca: float

@router.post("/extract-info", response_model=ExtractionResult)
async def extract_document_info(file: UploadFile = File(...)):
    """
    Extrai informações de documentos (PDF ou imagem)
    """
    try:
        # Validar tipo de arquivo
        if not file.content_type or not file.content_type.startswith(('application/pdf', 'image/')):
            raise HTTPException(
                status_code=400, 
                detail="Tipo de arquivo não suportado. Use PDF ou imagem."
            )
        # Processar documento
        result = await process_document(file)
        return ExtractionResult(
            numero_processo=result.get("numero_processo"),
            numero_auto_infracao=result.get("numero_auto_infracao"),
            nome_contribuinte=result.get("nome_contribuinte"),
            cnpj_contribuinte=result.get("cnpj_contribuinte"),
            texto_extraido=result.get("texto_extraido", ""),
            confianca=result.get("confianca", 0.0)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar documento: {str(e)}")

@router.get("/health")
async def health_check():
    """Verificar se a API está funcionando"""
    return {"status": "healthy", "message": "Hunter Fiscal API está funcionando"} 