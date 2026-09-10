$ErrorActionPreference = "Stop"

$repository = "a3292948711-sketch/huanme"
$remoteUrl = "https://github.com/$repository.git"
$projectPath = $PSScriptRoot
$workspacePath = Split-Path -Parent $projectPath
$gitExe = Join-Path $workspacePath ".local-tools\mingit-2.55.0.5\cmd\git.exe"
$gitBinPath = Join-Path $workspacePath ".local-tools\mingit-2.55.0.5\mingw64\bin"
$askPassPath = Join-Path ([System.IO.Path]::GetTempPath()) ("huanme-askpass-" + [Guid]::NewGuid().ToString("N") + ".cmd")
$tokenPointer = [IntPtr]::Zero
$plainToken = $null
$originalPath = $env:Path

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Invoke-Git {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments,
    [switch]$AllowFailure
  )

  & $gitExe -C $projectPath @Arguments
  $exitCode = $LASTEXITCODE
  if (!$AllowFailure -and $exitCode -ne 0) {
    throw "Git 命令执行失败：git $($Arguments -join ' ')"
  }
  return $exitCode
}

try {
  Clear-Host
  Write-Host "换么 Web App · GitHub 一键上传" -ForegroundColor Green
  Write-Host "目标仓库：https://github.com/$repository" -ForegroundColor DarkGray

  if (!(Test-Path -LiteralPath $gitExe -PathType Leaf)) {
    throw "没有找到 Git：$gitExe"
  }
  if (!(Test-Path -LiteralPath $gitBinPath -PathType Container)) {
    throw "Git 的网络组件目录不存在：$gitBinPath"
  }
  if (!(Test-Path -LiteralPath (Join-Path $projectPath "package.json") -PathType Leaf)) {
    throw "当前目录不是换么 Web App 项目：$projectPath"
  }

  Write-Host ""
  Write-Host "请粘贴 GitHub Personal Access Token。" -ForegroundColor Yellow
  Write-Host "输入过程不会显示字符；粘贴后直接按 Enter。" -ForegroundColor DarkGray
  $secureToken = Read-Host "Token" -AsSecureString
  $tokenPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
  $plainToken = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($tokenPointer)
  if ([string]::IsNullOrWhiteSpace($plainToken)) {
    throw "令牌不能为空。"
  }

  # Git reads credentials from memory through this temporary helper. The token
  # itself is never written into this file, the repository URL, or Git config.
  $askPassContent = @'
@echo off
echo %~1 | findstr /I "Username" >nul
if not errorlevel 1 (
  echo a3292948711-sketch
) else (
  echo %HUANME_GITHUB_TOKEN%
)
'@
  Set-Content -LiteralPath $askPassPath -Value $askPassContent -Encoding ASCII
  $env:GIT_ASKPASS = $askPassPath
  $env:GIT_TERMINAL_PROMPT = "0"
  $env:HUANME_GITHUB_TOKEN = $plainToken
  $env:Path = "$gitBinPath;$originalPath"

  Write-Step "检查并初始化 Git 仓库"
  if (!(Test-Path -LiteralPath (Join-Path $projectPath ".git"))) {
    Invoke-Git -Arguments @("init") | Out-Null
  }
  Invoke-Git -Arguments @("config", "user.name", "a3292948711-sketch") | Out-Null
  Invoke-Git -Arguments @("config", "user.email", "a3292948711-sketch@users.noreply.github.com") | Out-Null
  Invoke-Git -Arguments @("config", "http.version", "HTTP/1.1") | Out-Null

  Write-Step "整理并提交全部项目文件"
  Invoke-Git -Arguments @("add", "--all") | Out-Null
  & $gitExe -C $projectPath diff --cached --quiet
  if ($LASTEXITCODE -ne 0) {
    Invoke-Git -Arguments @("commit", "-m", "feat: update Huanme mobile web app") | Out-Null
    Write-Host "已创建新的本地提交。" -ForegroundColor Green
  } else {
    Write-Host "文件已经提交，无需重复提交。" -ForegroundColor DarkGray
  }
  Invoke-Git -Arguments @("branch", "-M", "main") | Out-Null

  Write-Step "连接目标 GitHub 仓库"
  & $gitExe -C $projectPath remote get-url origin *> $null
  if ($LASTEXITCODE -eq 0) {
    Invoke-Git -Arguments @("remote", "set-url", "origin", $remoteUrl) | Out-Null
  } else {
    Invoke-Git -Arguments @("remote", "add", "origin", $remoteUrl) | Out-Null
  }

  Write-Step "上传到 GitHub"
  & $gitExe -C $projectPath push -u origin main
  $pushExitCode = $LASTEXITCODE

  if ($pushExitCode -ne 0) {
    Write-Host "首次推送未成功，正在检查远程是否已有 README 或初始提交……" -ForegroundColor Yellow
    & $gitExe -C $projectPath fetch origin main
    if ($LASTEXITCODE -ne 0) {
      throw "无法读取远程仓库。请检查网络以及令牌的仓库访问权限。"
    }

    & $gitExe -C $projectPath merge origin/main --allow-unrelated-histories --no-edit
    if ($LASTEXITCODE -ne 0) {
      & $gitExe -C $projectPath merge --abort *> $null
      throw "远程仓库与本地项目存在文件冲突，已安全停止，没有强制覆盖远程内容。"
    }

    Invoke-Git -Arguments @("push", "-u", "origin", "main") | Out-Null
  }

  Write-Step "核对上传结果"
  $commitSha = (& $gitExe -C $projectPath rev-parse --short HEAD).Trim()
  Write-Host "上传成功！" -ForegroundColor Green
  Write-Host "Commit：$commitSha" -ForegroundColor Green
  Write-Host "仓库地址：https://github.com/$repository" -ForegroundColor Green
}
catch {
  Write-Host ""
  Write-Host "上传没有完成：$($_.Exception.Message)" -ForegroundColor Red
  Write-Host ""
  Write-Host "请确认令牌已选择 huanme 仓库，并具有 Contents: Read and write 权限。" -ForegroundColor Yellow
  Write-Host "不要把令牌或令牌截图发送给任何人。" -ForegroundColor DarkGray
  exit 1
}
finally {
  $env:Path = $originalPath
  $env:HUANME_GITHUB_TOKEN = $null
  $env:GIT_ASKPASS = $null
  $env:GIT_TERMINAL_PROMPT = $null
  if (Test-Path -LiteralPath $askPassPath) {
    Remove-Item -LiteralPath $askPassPath -Force
  }
  if ($plainToken) {
    $plainToken = $null
  }
  if ($tokenPointer -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($tokenPointer)
  }
  if ($secureToken) {
    $secureToken = $null
  }
}
