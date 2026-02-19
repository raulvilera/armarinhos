# Script para Simular o Webhook do Mercado Pago no Supabase

$URL = "https://vzszzdeqbrjrepbzeiqq.supabase.co/functions/v1/mp-webhook"

# Payload simulando uma notificação de Assinatura (Preapproval)
$JSON = @{
    action       = "created"
    api_version  = "v1"
    data         = @{
        id = "8c08139d892d4ee5903b2909477e682d" # ID de Exemplo
    }
    date_created = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    id           = 123456789
    live_mode    = $false
    type         = "preapproval"
} | ConvertTo-Json

Write-Host "`n--- INICIANDO SIMULAÇÃO DE PAGAMENTO ---" -ForegroundColor Yellow
Write-Host "Enviando sinal para a Edge Function no Supabase..." -ForegroundColor Gray

try {
    $Response = Invoke-RestMethod -Uri $URL -Method Post -Body $JSON -ContentType "application/json"
    Write-Host "`n[OK] RESPOSTA DO SERVIDOR:" -ForegroundColor Green -NoNewline
    Write-Host " Status 200 (Sucesso)" -ForegroundColor White
    Write-Host " Mensagem: $($Response.message)" -ForegroundColor White
    
    Write-Host "`n==========================================" -ForegroundColor Cyan
    Write-Host " SUCESSO! O Webhook foi processado. " -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "Isso confirma que o seu sistema está ouvindo o Mercado Pago."
    Write-Host "Para ver a mudança no banco de dados, use um e-mail real no script."
}
catch {
    Write-Host "`n[ERRO] Falha ao conectar com a Function." -ForegroundColor Red
    Write-Host "Mensagem de Erro: $_" -ForegroundColor White
}
# Script para Simular o Webhook do Mercado Pago no Supabase

$URL = "https://vzszzdeqbrjrepbzeiqq.supabase.co/functions/v1/mp-webhook"

# Payload simulando uma notificação de Assinatura (Preapproval)
$JSON = @{
    action       = "created"
    api_version  = "v1"
    data         = @{
        id = "8c08139d892d4ee5903b2909477e682d" # ID de Exemplo
    }
    date_created = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    id           = 123456789
    live_mode    = $false
    type         = "preapproval"
} | ConvertTo-Json

Write-Host "Enviando simulação para: $URL" -ForegroundColor Cyan

try {
    $Response = Invoke-RestMethod -Uri $URL -Method Post -Body $JSON -ContentType "application/json"
    Write-Host "Resposta do Servidor:" -ForegroundColor Green
    $Response | Format-List
    Write-Host "`nSucesso! O sistema recebeu a notificação simulada." -ForegroundColor Green
}
catch {
    Write-Host "Erro ao enviar notificação: $_" -ForegroundColor Red
    Write-Host "Verifique se a URL da sua Function está correta." -ForegroundColor Yellow
}
