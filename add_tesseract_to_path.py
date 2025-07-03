#!/usr/bin/env python3
"""
Script para adicionar Tesseract OCR ao PATH do sistema Windows
"""

import os
import sys
import winreg
import subprocess
import ctypes
from pathlib import Path

def add_to_system_path(new_path):
    """Adiciona um caminho ao PATH do sistema"""
    try:
        # Abrir a chave do registro do sistema
        key = winreg.OpenKey(
            winreg.HKEY_LOCAL_MACHINE,
            r"SYSTEM\CurrentControlSet\Control\Session Manager\Environment",
            0,
            winreg.KEY_READ | winreg.KEY_WRITE
        )
        
        # Ler o PATH atual
        current_path, _ = winreg.QueryValueEx(key, "Path")
        
        # Verificar se o caminho já existe
        if new_path in current_path:
            print(f"✅ O caminho {new_path} já está no PATH do sistema")
            return True
        
        # Adicionar o novo caminho
        new_path_value = current_path + ";" + new_path
        winreg.SetValueEx(key, "Path", 0, winreg.REG_EXPAND_SZ, new_path_value)
        
        print(f"✅ Caminho {new_path} adicionado ao PATH do sistema")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao adicionar ao PATH do sistema: {e}")
        return False
    finally:
        try:
            winreg.CloseKey(key)
        except:
            pass

def add_to_user_path(new_path):
    """Adiciona um caminho ao PATH do usuário"""
    try:
        # Abrir a chave do registro do usuário
        key = winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            r"Environment",
            0,
            winreg.KEY_READ | winreg.KEY_WRITE
        )
        
        try:
            # Ler o PATH atual do usuário
            current_path, _ = winreg.QueryValueEx(key, "Path")
        except FileNotFoundError:
            # Se não existir, criar um novo
            current_path = ""
        
        # Verificar se o caminho já existe
        if new_path in current_path:
            print(f"✅ O caminho {new_path} já está no PATH do usuário")
            return True
        
        # Adicionar o novo caminho
        if current_path:
            new_path_value = current_path + ";" + new_path
        else:
            new_path_value = new_path
            
        winreg.SetValueEx(key, "Path", 0, winreg.REG_EXPAND_SZ, new_path_value)
        
        print(f"✅ Caminho {new_path} adicionado ao PATH do usuário")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao adicionar ao PATH do usuário: {e}")
        return False
    finally:
        try:
            winreg.CloseKey(key)
        except:
            pass

def check_tesseract_installation():
    """Verifica se o Tesseract está instalado"""
    possible_paths = [
        r"C:\Program Files\Tesseract-OCR",
        r"C:\Program Files (x86)\Tesseract-OCR",
        r"C:\Tesseract-OCR"
    ]
    
    for path in possible_paths:
        tesseract_exe = Path(path) / "tesseract.exe"
        if tesseract_exe.exists():
            print(f"✅ Tesseract encontrado em: {path}")
            return path
    
    print("❌ Tesseract não encontrado nos caminhos padrão")
    return None

def test_tesseract():
    """Testa se o Tesseract está funcionando"""
    try:
        result = subprocess.run(
            ["tesseract", "--version"], 
            capture_output=True, 
            text=True, 
            timeout=10
        )
        if result.returncode == 0:
            print("✅ Tesseract está funcionando corretamente!")
            print(f"Versão: {result.stdout.split()[1]}")
            return True
        else:
            print("❌ Tesseract não está funcionando")
            return False
    except Exception as e:
        print(f"❌ Erro ao testar Tesseract: {e}")
        return False

def main():
    print("🔧 Configurando Tesseract OCR no PATH")
    print("=" * 50)
    
    # Verificar se é Windows
    if os.name != 'nt':
        print("❌ Este script é apenas para Windows")
        return
    
    # Verificar se está rodando como administrador
    try:
        is_admin = os.getuid() == 0
    except AttributeError:
        is_admin = ctypes.windll.shell32.IsUserAnAdmin() != 0
    
    if not is_admin:
        print("⚠️  Este script precisa ser executado como administrador")
        print("   Para adicionar ao PATH do sistema")
        print("   Execute: python add_tesseract_to_path.py")
        print("   Ou adicione manualmente nas variáveis de ambiente")
    
    # Encontrar Tesseract
    tesseract_path = check_tesseract_installation()
    if not tesseract_path:
        print("\n📥 Para instalar o Tesseract:")
        print("1. Baixe de: https://github.com/UB-Mannheim/tesseract/wiki")
        print("2. Instale e marque 'Add to PATH' durante a instalação")
        print("3. Execute este script novamente")
        return
    
    print(f"\n📁 Adicionando {tesseract_path} ao PATH...")
    
    # Tentar adicionar ao PATH do sistema (requer admin)
    if is_admin:
        system_success = add_to_system_path(tesseract_path)
    else:
        print("⚠️  Não foi possível adicionar ao PATH do sistema (não é admin)")
        system_success = False
    
    # Adicionar ao PATH do usuário
    user_success = add_to_user_path(tesseract_path)
    
    if system_success or user_success:
        print("\n🔄 Atualizando variáveis de ambiente...")
        
        # Notificar o sistema sobre a mudança
        try:
            subprocess.run(["setx", "PATH", os.environ["PATH"]], check=True)
        except:
            pass
        
        print("\n✅ Configuração concluída!")
        print("\n📋 Próximos passos:")
        print("1. Feche todos os terminais e editores")
        print("2. Abra um novo terminal")
        print("3. Teste: tesseract --version")
        print("4. Se funcionar, reinicie o backend: cd backend && python main.py")
        
        print("\n🧪 Testando Tesseract...")
        if test_tesseract():
            print("\n🎉 Tesseract está pronto para uso!")
        else:
            print("\n⚠️  Tesseract ainda não está no PATH")
            print("   Reinicie o terminal ou o computador")
    else:
        print("\n❌ Não foi possível adicionar ao PATH")
        print("   Adicione manualmente nas variáveis de ambiente")

if __name__ == "__main__":
    main() 