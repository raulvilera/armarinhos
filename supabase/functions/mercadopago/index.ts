import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')

        if (!ACCESS_TOKEN) {
            throw new Error('MP_ACCESS_TOKEN is not set')
        }

        const { url, method, body } = await req.json()

        console.log(`Proxying ${method} request to ${url}`)

        const response = await fetch(url, {
            method: method || 'GET',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        })

        const data = await response.json()

        return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: response.status,
        })
    } catch (error) {
        console.error('Error in mercadopago proxy:', error.message)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
