from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uvicorn
from .document_processor import process_document

app = FastAPI(title="Hunter Fiscal API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Adicione seus domínios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExtractionResult(BaseModel):
    numero_processo: Optional[str] = None
    nome_contribuinte: Optional[str] = None
    cnpj_contribuinte: Optional[str] = None
    texto_extraido: str
    confianca: float

@app.post("/extract-info", response_model=ExtractionResult)
async def extract_document_info(file: UploadFile = File(...)):
    """
    Extrai informações de documentos (PDF ou imagem)
    """
    try:
        # Validar tipo de arquivo
        if not file.content_type.startswith(('application/pdf', 'image/')):
            raise HTTPException(
                status_code=400, 
                detail="Tipo de arquivo não suportado. Use PDF ou imagem."
            )
        # Processar documento
        result = await process_document(file)
        return ExtractionResult(
            numero_processo=result.get("numero_processo"),
            nome_contribuinte=result.get("nome_contribuinte"),
            cnpj_contribuinte=result.get("cnpj_contribuinte"),
            texto_extraido=result.get("texto_extraido", ""),
            confianca=result.get("confianca", 0.0)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar documento: {str(e)}")

@app.get("/health")
async def health_check():
    """Verificar se a API está funcionando"""
    return {"status": "healthy", "message": "Hunter Fiscal API está funcionando"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 