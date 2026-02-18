import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')

serve(async (req) => {
    const { method } = req

    if (method === 'POST') {
        try {
            const body = await req.json()
            console.log('MP Notification received:', body)

            // Verificando o tipo da notificação (Subscription / Preapproval)
            if (body.type === 'preapproval') {
                const id = body.data.id

                // Buscar detalhes da assinatura no Mercado Pago
                const response = await fetch(`https://api.mercadopago.com/preapproval/${id}`, {
                    headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` }
                })
                const preapproval = await response.json()

                // Inicializar cliente Supabase
                const supabase = createClient(
                    Deno.env.get('SUPABASE_URL') ?? '',
                    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
                )

                // Atualizar status no banco de dados
                // Mapeamos o status do MP para o nosso sistema
                const status = preapproval.status === 'authorized' ? 'active' : 'inactive'

                const { error } = await supabase
                    .from('customers')
                    .update({ subscription_status: status })
                    .eq('email', preapproval.payer_email) // Usamos o email como chave de busca

                if (error) throw error

                return new Response(JSON.stringify({ message: "Status updated" }), { status: 200 })
            }

            return new Response(JSON.stringify({ message: "Notification ignored" }), { status: 200 })
        } catch (err) {
            console.error('Webhook Error:', err)
            return new Response(JSON.stringify({ error: err.message }), { status: 500 })
        }
    }

    return new Response("Method not allowed", { status: 405 })
})
