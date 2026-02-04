import os
import json
import google.generativeai as genai
from pdf2image import convert_from_path
from django.conf import settings
from PIL import Image

genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

class GeminiProcessor:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def process_statement(self, file_path):
        try:
            image_parts = self._load_image_parts(file_path)
            
            prompt = """
            Você é um assistente financeiro especializado em OCR de extratos bancários.
            Analise esta imagem e extraia TODAS as transações financeiras.
            
            Retorne APENAS um JSON válido seguindo estritamente este formato, sem markdown (```json):
            [
                {
                    "date": "YYYY-MM-DD",
                    "description": "Nome do estabelecimento ou descrição",
                    "amount": 00.00 (positivo para crédito, negativo para débito/gasto),
                    "category": "Sugira uma categoria simples (Ex: Alimentação, Transporte, Lazer, Contas, Salário)"
                }
            ]
            Se houver várias páginas ou imagens, consolide tudo em uma única lista.
            Se a imagem não for um extrato legível, retorne uma lista vazia [].
            """

            response = self.model.generate_content([prompt, *image_parts])
            
            cleaned_text = response.text.replace("```json", "").replace("```", "").strip()
            return json.loads(cleaned_text)

        except Exception as e:
            print(f"Erro ao processar com Gemini: {e}")
            return []

    def _load_image_parts(self, file_path):
        images = []
        
        if file_path.lower().endswith('.pdf'):
            pages = convert_from_path(file_path)
            for page in pages:
                images.append(page)
        else:
            images.append(Image.open(file_path))
            
        return images
