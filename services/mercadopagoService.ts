import { supabase } from './supabaseClient';


export const createSubscriptionPlan = async (data: {
    reason: string,
    auto_recurring: {
        frequency: number,
        frequency_type: 'months' | 'days',
        transaction_amount: number,
        currency_id: 'BRL',
        free_trial?: {
            frequency: number,
            frequency_type: 'months' | 'days'
        }
    }
}) => {
    try {
        const { data: response, error } = await supabase.functions.invoke('mercadopago', {
            body: {
                url: 'https://api.mercadopago.com/preapproval_plan',
                method: 'POST',
                body: {
                    ...data,
                    back_url: window.location.origin
                }
            }
        });

        if (error) throw error;
        return response;
    } catch (error) {
        console.error('Error creating MP plan via proxy:', error);
        throw error;
    }
};

export const initMPCheckout = async (preapprovalPlanId: string) => {
    // O checkout de assinatura do MP geralmente requer redirecionamento para o init_point do plano
    // ou uso do Brick de assinaturas. Para simplicidade inicial, buscaremos o link de pagamento.
    try {
        const { data: plan, error } = await supabase.functions.invoke('mercadopago', {
            body: {
                url: `https://api.mercadopago.com/preapproval_plan/${preapprovalPlanId}`,
                method: 'GET'
            }
        });

        if (error) throw error;
        return plan.init_point;
    } catch (error) {
        console.error('Error getting MP plan init point via proxy:', error);
        throw error;
    }
};
export const checkMPConnection = async () => {
    try {
        const { data, error } = await supabase.functions.invoke('mercadopago', {
            body: {
                url: 'https://api.mercadopago.com/users/me',
                method: 'GET'
            }
        });

        if (error) return { ok: false, message: error.message };
        if (data && data.id) return { ok: true, message: 'Conectado com sucesso' };
        return { ok: false, message: data?.message || 'Erro Desconhecido' };
    } catch (error: any) {
        return { ok: false, message: error.message };
    }
};
