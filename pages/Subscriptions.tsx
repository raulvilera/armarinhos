
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { createSubscriptionPlan, initMPCheckout } from '../services/mercadopagoService';

export const Subscriptions: React.FC<{ setView: (v: any) => void }> = ({ setView }) => {
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
        <div className="p-4 md:p-8 max-w-5xl mx-auto bg-[#F8F7F9] min-h-screen">
            <header className="flex justify-between items-center mb-8 md:mb-12">
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-black text-primary uppercase tracking-tighter">Assinaturas</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] md:text-xs mt-1">Configuração do seu SaaS Armarinhos</p>
                </div>
                <button
                    onClick={() => setView('DASHBOARD')}
                    className="bg-white hover:bg-gray-100 size-10 md:size-12 rounded-xl md:rounded-2xl transition-all shadow-sm flex items-center justify-center text-primary border border-gray-100"
                >
                    <span className="material-symbols-outlined font-black">close</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-white border-2 border-gray-100 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] hover:border-primary/20 transition-all group flex flex-col shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <span className="bg-primary/10 text-primary text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                                {plan.name}
                            </span>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-gray-300 uppercase block">Mensal</span>
                                <span className="text-xl md:text-2xl font-black text-primary">R$ {plan.price.toFixed(2)}</span>
                            </div>
                        </div>
                        <h3 className="text-lg font-black mb-2 uppercase text-gray-800">{plan.name}</h3>
                        <p className="text-gray-400 text-sm mb-8 flex-1 leading-relaxed">{plan.description}</p>
                        <button
                            onClick={() => handleSubscribe(plan)}
                            className="w-full bg-primary text-white font-black py-4 md:py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-[10px]"
                        >
                            Assinar Agora
                        </button>
                    </div>
                ))}

                <button className="border-2 border-dashed border-gray-200 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-gray-400 hover:border-primary/40 hover:text-primary transition-all group bg-white/50">
                    <div className="size-12 bg-white rounded-full flex items-center justify-center mb-4 group-hover:bg-primary shadow-sm group-hover:text-white transition-all">
                        <span className="material-symbols-outlined text-3xl font-black">add</span>
                    </div>
                    <span className="font-black uppercase tracking-widest text-[10px]">Criar Novo Plano</span>
                </button>
            </div>

            <div className="mt-12 md:mt-16 bg-white p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-gray-100 shadow-sm text-center max-w-3xl mx-auto">
                <div className="bg-primary/5 size-16 md:size-20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-3xl md:text-4xl text-primary font-black">payments</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-primary uppercase mb-3">Integração Financeira</h2>
                <p className="text-gray-500 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">Conecte sua conta do <b>Mercado Pago</b> para automatizar as cobranças mensais dos seus clientes com segurança e agilidade.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button className="bg-primary text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/10 hover:brightness-110 transition-all">Configurar Mercado Pago</button>
                    <button className="bg-gray-50 text-gray-400 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest border border-gray-100">Próximas Integrações</button>
                </div>
            </div>
        </div>
    );
};
