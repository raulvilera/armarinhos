import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
<<<<<<< HEAD
<<<<<<< HEAD
import { createSubscriptionPlan, initMPCheckout } from '../services/mercadopagoService';
=======
>>>>>>> dd7af30 (initial: setup project with Supabase and SaaS structure)
=======
import { createSubscriptionPlan, initMPCheckout } from '../services/mercadopagoService';
>>>>>>> 25cf02f (update: SaaS subscription module and Supabase integration)

export const Subscriptions: React.FC<{ setView: (v: any) => void }> = ({ setView }) => {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        const { data } = await supabase.from('plans').select('*');
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 25cf02f (update: SaaS subscription module and Supabase integration)
        if (data && data.length > 0) {
            setPlans(data);
        } else {
            // Plano padrão para teste caso o banco esteja vazio
            setPlans([{
                id: 'default',
                name: 'Plano Profissional',
                price: 99.90,
                description: 'Acesso completo a todas as ferramentas de gestão e PDV.'
            }]);
        }
<<<<<<< HEAD
        setLoading(false);
    };

    const handleSubscribe = async (plan: any) => {
        try {
            // Criar plano no Mercado Pago para gerar o link de checkout
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

=======
        if (data) setPlans(data);
        setLoading(false);
    };

>>>>>>> dd7af30 (initial: setup project with Supabase and SaaS structure)
=======
        setLoading(false);
    };

    const handleSubscribe = async (plan: any) => {
        try {
            // Criar plano no Mercado Pago para gerar o link de checkout
            const mpPlan = await createSubscriptionPlan({
                reason: `Assinatura Armarinhos - ${plan.name}`,
                auto_recurring: {
                    frequency: 1,
                    frequency_type: 'months',
                    transaction_amount: plan.price,
                    currency_id: 'BRL'
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

>>>>>>> 25cf02f (update: SaaS subscription module and Supabase integration)
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-primary uppercase tracking-tighter">Gerenciar Assinaturas</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-1">Configuração do seu SaaS Armarinhos</p>
                </div>
                <button
                    onClick={() => setView('DASHBOARD')}
                    className="bg-gray-100 hover:bg-gray-200 p-3 rounded-2xl transition-all"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-white border-2 border-gray-100 p-6 rounded-[2rem] hover:border-primary/20 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest leading-none">
                                Plano {plan.name}
                            </span>
                            <span className="text-2xl font-black text-primary">R$ {plan.price}</span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 uppercase">{plan.name}</h3>
                        <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 25cf02f (update: SaaS subscription module and Supabase integration)
                        <button
                            onClick={() => handleSubscribe(plan)}
                            className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs"
                        >
                            Assinar Agora
<<<<<<< HEAD
=======
                        <button className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs">
                            Editar Plano
>>>>>>> dd7af30 (initial: setup project with Supabase and SaaS structure)
=======
>>>>>>> 25cf02f (update: SaaS subscription module and Supabase integration)
                        </button>
                    </div>
                ))}

                <button className="border-2 border-dashed border-gray-200 p-6 rounded-[2rem] flex flex-col items-center justify-center text-gray-400 hover:border-primary/40 hover:text-primary transition-all group">
                    <div className="size-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-all">
                        <span className="material-symbols-outlined text-3xl">add</span>
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs">Criar Novo Plano</span>
                </button>
            </div>

            <div className="mt-12 bg-primary/5 p-8 rounded-[3rem] border-2 border-primary/10 text-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-4">payments</span>
                <h2 className="text-xl font-black text-primary uppercase mb-2">Integração de Pagamentos</h2>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">Conecte sua conta do <b>Stripe</b> ou <b>Mercado Pago</b> para automatizar as cobranças mensais dos seus clientes.</p>
                <div className="flex justify-center gap-4">
                    <button className="bg-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Configurar Stripe</button>
                    <button className="bg-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Configurar Mercado Pago</button>
                </div>
            </div>
        </div>
    );
};
