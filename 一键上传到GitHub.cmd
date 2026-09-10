@echo off
setlocal
title Huanme GitHub Uploader

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$scriptText = Get-Content -LiteralPath '%~dp0上传到GitHub.ps1' -Raw -Encoding UTF8; Invoke-Expression $scriptText"

echo.
pause
endlocal
