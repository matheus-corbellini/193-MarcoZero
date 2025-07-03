@echo off
echo 🔧 Configurando Tesseract OCR no PATH
echo ================================================

REM Verificar se Tesseract está instalado
if exist "C:\Program Files\Tesseract-OCR\tesseract.exe" (
    echo ✅ Tesseract encontrado em C:\Program Files\Tesseract-OCR
    set TESSERACT_PATH=C:\Program Files\Tesseract-OCR
) else if exist "C:\Program Files (x86)\Tesseract-OCR\tesseract.exe" (
    echo ✅ Tesseract encontrado em C:\Program Files (x86)\Tesseract-OCR
    set TESSERACT_PATH=C:\Program Files (x86)\Tesseract-OCR
) else (
    echo ❌ Tesseract não encontrado!
    echo.
    echo 📥 Para instalar o Tesseract:
    echo 1. Baixe de: https://github.com/UB-Mannheim/tesseract/wiki
    echo 2. Instale e marque 'Add to PATH' durante a instalação
    echo 3. Execute este script novamente
    pause
    exit /b 1
)

REM Adicionar ao PATH do usuário
echo.
echo 📁 Adicionando Tesseract ao PATH do usuário...
setx PATH "%PATH%;%TESSERACT_PATH%"

if %ERRORLEVEL% EQU 0 (
    echo ✅ Tesseract adicionado ao PATH com sucesso!
    echo.
    echo 📋 Próximos passos:
    echo 1. Feche todos os terminais e editores
    echo 2. Abra um novo terminal
    echo 3. Teste: tesseract --version
    echo 4. Se funcionar, reinicie o backend: cd backend ^&^& python main.py
) else (
    echo ❌ Erro ao adicionar ao PATH
    echo.
    echo 🔧 Solução manual:
    echo 1. Pressione Windows + R
    echo 2. Digite: sysdm.cpl
    echo 3. Clique em "Variáveis de Ambiente"
    echo 4. Em "Variáveis do Sistema", encontre "Path"
    echo 5. Clique em "Editar" e adicione: %TESSERACT_PATH%
)

echo.
echo 🧪 Testando Tesseract...
"%TESSERACT_PATH%\tesseract.exe" --version

if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🎉 Tesseract está pronto para uso!
) else (
    echo.
    echo ⚠️  Tesseract ainda não está no PATH
    echo    Reinicie o terminal ou o computador
)

pause 