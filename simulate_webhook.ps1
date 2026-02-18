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
