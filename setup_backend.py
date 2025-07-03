#!/usr/bin/env python3
"""
Script para configurar o ambiente Python do Hunter Fiscal
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Executar comando e mostrar resultado"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} concluído com sucesso!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao {description.lower()}: {e}")
        print(f"Erro: {e.stderr}")
        return False

def main():
    print("🚀 Configurando ambiente Python para Hunter Fiscal")
    print("=" * 50)
    
    # Verificar se Python está instalado
    if not run_command("python --version", "Verificando versão do Python"):
        print("❌ Python não encontrado. Instale Python 3.8+ primeiro.")
        return
    
    # Instalar dependências
    if not run_command("pip install -r requirements.txt", "Instalando dependências Python"):
        print("❌ Falha ao instalar dependências.")
        return
    
    # Baixar modelo SpaCy
    if not run_command("python -m spacy download pt_core_news_sm", "Baixando modelo SpaCy para português"):
        print("❌ Falha ao baixar modelo SpaCy.")
        return
    
    print("\n🎉 Configuração concluída com sucesso!")
    print("\nPara iniciar o servidor backend:")
    print("cd backend")
    print("python main.py")
    print("\nO servidor estará disponível em: http://localhost:8000")

if __name__ == "__main__":
    main() 