# Guia de Simulação de Pagamento (Mercado Pago)

Para verificar se o seu sistema está funcionando corretamente sem gastar dinheiro real, siga estes passos.

## 1. Usar Cartões de Teste
Ao abrir le link de pagamento gerado pelo sistema (na página de Assinaturas), o Mercado Pago abrirá o checkout. **Não use seu cartão real!**

Use um dos cartões de teste oficiais:
*   **Link Oficial:** [Cartões de Teste do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards)

| Bandeira | Número do Cartão | CVV | Data de Expiração |
| :--- | :--- | :--- | :--- |
| **Visa** | 4000 0113 5406 0013 | 123 | Qualquer data futura |
| **Mastercard** | 5031 7500 0113 4104 | 123 | Qualquer data futura |

No campo de "Nome", coloque `APRO` para garantir que o pagamento seja aprovado.

---

## 2. Simular Webhook (Teste Técnico)
O Webhook é o que avisa o seu sistema que o pagamento foi feito. Você pode simular esse aviso sem precisar passar pelo site do Mercado Pago.

### Usando o Script PowerShell
Eu criei o arquivo `simulate_webhook.ps1` na raiz do seu projeto. 
1. Abra o PowerShell na pasta do projeto.
2. Execute: `.\simulate_webhook.ps1`

Este script enviará um sinal para sua função no Supabase (`mp-webhook`) fingindo ser o Mercado Pago confirmando um pagamento para o e-mail de teste.

---

## 3. Como Verificar se Funcionou

### Passo A: Logs do Supabase
1. Vá ao [Painel do Supabase](https://supabase.com).
2. Vá em **Edge Functions > mp-webhook**.
3. Clique na aba **Invocations** ou **Logs**.
4. Você verá mensagens como `MP Notification received` e `Status updated`.

### Passo B: Banco de Dados
1. Vá na aba **Table Editor** no Supabase.
2. Procure a tabela `customers`.
3. Verifique se a coluna `subscription_status` do cliente agora está como `active`.

### Passo C: No Sistema
1. Faça login no seu sistema.
2. O dashboard deve estar liberado (sem a mensagem de "Assinatura Pendente" se você tiver essa trava).
