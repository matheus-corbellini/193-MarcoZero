#!/usr/bin/env python3
"""
Script de teste para a API Hunter Fiscal
"""

import requests
import json
import os
from pathlib import Path

def test_health_endpoint():
    """Testar endpoint de saúde"""
    print("🔍 Testando endpoint de saúde...")
    try:
        response = requests.get("http://localhost:8000/health")
        if response.status_code == 200:
            print("✅ Endpoint de saúde funcionando!")
            print(f"Resposta: {response.json()}")
            return True
        else:
            print(f"❌ Erro no endpoint de saúde: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Não foi possível conectar ao servidor. Verifique se está rodando em http://localhost:8000")
        return False

def test_file_upload(file_path):
    """Testar upload de arquivo"""
    print(f"\n📁 Testando upload de arquivo: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"❌ Arquivo não encontrado: {file_path}")
        return False
    
    try:
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post("http://localhost:8000/extract-info", files=files)
        
        if response.status_code == 200:
            print("✅ Upload realizado com sucesso!")
            result = response.json()
            
            print("\n📊 Resultados da extração:")
            print(f"  Número do Processo: {result.get('numero_processo', 'Não encontrado')}")
            print(f"  Nome do Contribuinte: {result.get('nome_contribuinte', 'Não encontrado')}")
            print(f"  CNPJ do Contribuinte: {result.get('cnpj_contribuinte', 'Não encontrado')}")
            print(f"  Confiança: {result.get('confianca', 0):.1%}")
            print(f"  Tamanho do texto: {len(result.get('texto_extraido', ''))} caracteres")
            
            return True
        else:
            print(f"❌ Erro no upload: {response.status_code}")
            print(f"Erro: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao testar upload: {str(e)}")
        return False

def create_test_files():
    """Criar arquivos de teste se não existirem"""
    test_dir = Path("test_files")
    test_dir.mkdir(exist_ok=True)
    
    # Criar arquivo de teste simples
    test_file = test_dir / "test.txt"
    if not test_file.exists():
        with open(test_file, 'w', encoding='utf-8') as f:
            f.write("""AUTO DE INFRAÇÃO ICMS

PROCESSO Nº 2023/123456
CONTRIBUINTE: EMPRESA EXEMPLO LTDA
CNPJ: 12.345.678/0001-90

Este é um documento de teste para verificar a extração de informações.
""")
        print(f"📝 Arquivo de teste criado: {test_file}")
    
    return test_file

def main():
    print("🧪 Testando API Hunter Fiscal")
    print("=" * 40)
    
    # Testar endpoint de saúde
    if not test_health_endpoint():
        print("\n❌ Servidor não está funcionando. Execute primeiro:")
        print("cd backend")
        print("python main.py")
        return
    
    # Criar arquivo de teste
    test_file = create_test_files()
    
    # Testar upload
    test_file_upload(str(test_file))
    
    print("\n🎉 Testes concluídos!")
    print("\nPara testar com arquivos reais:")
    print("1. Coloque seus PDFs/imagens na pasta test_files/")
    print("2. Execute: python test_api.py")

if __name__ == "__main__":
    main() 