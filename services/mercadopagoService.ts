// @ts-ignore
const ACCESS_TOKEN = import.meta.env.VITE_MP_ACCESS_TOKEN;
// @ts-ignore
const PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

export const createSubscriptionPlan = async (data: {
    reason: string,
    auto_recurring: {
        frequency: number,
<<<<<<< HEAD
        frequency_type: 'months' | 'days',
        transaction_amount: number,
        currency_id: 'BRL',
        free_trial?: {
            frequency: number,
            frequency_type: 'months' | 'days'
        }
=======
        frequency_type: 'months',
        transaction_amount: number,
        currency_id: 'BRL'
>>>>>>> 25cf02f (update: SaaS subscription module and Supabase integration)
    }
}) => {
    try {
        const response = await fetch('https://api.mercadopago.com/preapproval_plan', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                back_url: window.location.origin
            })
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating MP plan:', error);
        throw error;
    }
};

export const initMPCheckout = async (preapprovalPlanId: string) => {
    // O checkout de assinatura do MP geralmente requer redirecionamento para o init_point do plano
    // ou uso do Brick de assinaturas. Para simplicidade inicial, buscaremos o link de pagamento.
    try {
        const response = await fetch(`https://api.mercadopago.com/preapproval_plan/${preapprovalPlanId}`, {
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        });
        const plan = await response.json();
        return plan.init_point;
    } catch (error) {
        console.error('Error getting MP plan init point:', error);
        throw error;
    }
};
