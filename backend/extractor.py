import pdfplumber
import pytesseract
from PIL import Image
import io
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class TextExtractor:
    def __init__(self):
        self.tesseract_available = self._check_tesseract()

    def _check_tesseract(self) -> bool:
        try:
            pytesseract.get_tesseract_version()
            return True
        except Exception as e:
            logger.warning(f"Tesseract não disponível: {str(e)}")
            return False

    def extract_from_pdf(self, content: bytes) -> str:
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

    def extract_from_image(self, content: bytes) -> str:
        if not self.tesseract_available:
            raise Exception("Tesseract OCR não está instalado. Por favor, instale o Tesseract para processar imagens.")
        try:
            image = Image.open(io.BytesIO(content))
            texto = pytesseract.image_to_string(image, lang='por')
            return texto
        except Exception as e:
            logger.error(f"Erro ao extrair texto da imagem: {str(e)}")
            raise 