
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { createSubscriptionPlan, initMPCheckout } from '../services/mercadopagoService';

import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { createSubscriptionPlan } from '../services/mercadopagoService';

export const Subscriptions: React.FC = () => {
    const navigate = useNavigate();
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        const { data } = await supabase.from('plans').select('*');
        if (data && data.length > 0) {
            setPlans(data);
        } else {
            setPlans([{
                id: 'default',
                name: 'Plano Profissional',
                price: 99.90,
                description: 'Acesso completo a todas as ferramentas de gestão e PDV.'
            }]);
        }
        setLoading(false);
    };

    const handleSubscribe = async (plan: any) => {
        try {
            const mpPlan = await createSubscriptionPlan({
                reason: `Assinatura Armarinhos - ${plan.name}`,
                auto_recurring: {
                    frequency: 1,
                    frequency_type: 'months',
                    transaction_amount: plan.price,
                    currency_id: 'BRL',
                    free_trial: {
                        frequency: 15,
                        frequency_type: 'days'
                    }
                }
            });

            if (mpPlan.init_point) {
                window.location.href = mpPlan.init_point;
            } else {
                alert('Erro ao gerar link de pagamento. Verifique suas credenciais.');
            }
        } catch (err) {
            alert('Erro ao processar assinatura: ' + err);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-white p-10 rounded-[2.5rem] hover:border-primary/20 transition-all group flex flex-col shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <span className="material-symbols-outlined text-6xl">verified</span>
                        </div>
                        <div className="flex justify-between items-start mb-8">
                            <span className="bg-primary/10 text-primary text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">
                                {plan.name}
                            </span>
                        </div>
                        <div className="mb-8">
                            <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">Assinatura Mensal</span>
                            <span className="text-3xl font-black text-primary tracking-tighter">R$ {plan.price.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-10 flex-1 leading-relaxed">{plan.description}</p>
                        <button
                            onClick={() => handleSubscribe(plan)}
                            className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px]"
                        >
                            Assinar Agora <span className="material-symbols-outlined font-black align-middle ml-2">arrow_forward</span>
                        </button>
                    </div>
                ))}

                <button className="border-2 border-dashed border-gray-100 p-10 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-400 hover:border-primary/20 hover:text-primary transition-all group bg-white/50 min-h-[300px]">
                    <div className="size-14 bg-white rounded-2xl flex items-center justify-center mb-6 border border-gray-100 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-3xl font-black">add</span>
                    </div>
                    <span className="font-black uppercase tracking-widest text-[10px]">Configurar Novo Plano</span>
                </button>
            </div>

            <div className="bg-white p-12 md:p-20 rounded-[3rem] border border-gray-100 shadow-sm text-center max-w-4xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-selected to-primary opacity-20"></div>
                <div className="bg-primary/5 size-24 rounded-[2rem] flex items-center justify-center mx-auto mb-10">
                    <span className="material-symbols-outlined text-5xl text-primary font-black">payments</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-primary uppercase mb-4 tracking-tighter">Integração Financeira</h2>
                <p className="text-gray-500 text-base md:text-lg max-w-lg mx-auto mb-10 leading-relaxed font-medium">Automaticamente processe pagamentos via <b>Mercado Pago</b> e tenha controle total sobre suas receitas recorrentes.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <button className="bg-primary text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">Configurar API</button>
                    <button className="bg-white text-gray-400 px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all">Ver Relatórios</button>
                </div>
            </div>
        </div>
    );
};
