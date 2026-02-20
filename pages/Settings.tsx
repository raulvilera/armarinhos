import React, { useState } from 'react';
import { Save, Store, User, Bell, Shield, CreditCard } from "lucide-react";

export const Settings: React.FC = () => {
    const [storeName, setStoreName] = useState("Armarinhos Vicmar");
    const [ownerName, setOwnerName] = useState("Raul Vilera");
    const [email, setEmail] = useState("contato@vicmar.com");
    const [phone, setPhone] = useState("(11) 95270-9128");
    const [notifications, setNotifications] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-500 pb-20">
            <div className="max-w-4xl space-y-10">
                {/* Dados da Loja */}
                <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
                        <div className="size-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                            <Store className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-gray-900 uppercase tracking-tighter">Identidade da Loja</h3>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Informações visíveis aos clientes</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nome Comercial</label>
                            <input
                                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black focus:bg-white focus:border-primary/20 focus:outline-none transition-all"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Telefone / WhatsApp</label>
                            <input
                                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black focus:bg-white focus:border-primary/20 focus:outline-none transition-all"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">E-mail de Suporte</label>
                            <input
                                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black focus:bg-white focus:border-primary/20 focus:outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Perfil Proprietário */}
                <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
                        <div className="size-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-gray-900 uppercase tracking-tighter">Meu Perfil</h3>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Informações do administrador</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Nome do Responsável</label>
                            <input
                                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-black focus:bg-white focus:border-primary/20 focus:outline-none transition-all"
                                value={ownerName}
                                onChange={(e) => setOwnerName(e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Notificações e Preferências */}
                <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
                        <div className="size-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-gray-900 uppercase tracking-tighter">Preferências</h3>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Controles do sistema</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100/50">
                        <div>
                            <p className="text-sm font-black uppercase tracking-tight text-gray-800">Alertas de Estoque Crítico</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mt-1">Notificar quando um item estiver abaixo de 5 unidades</p>
                        </div>
                        <button
                            onClick={() => setNotifications(!notifications)}
                            className={`w-14 h-8 rounded-full transition-all relative flex items-center ${notifications ? "bg-primary" : "bg-gray-200"}`}
                        >
                            <div className={`size-6 bg-white rounded-full absolute shadow-lg transition-all ${notifications ? "left-7" : "left-1"}`} />
                        </button>
                    </div>
                </section>

                {/* Integrações */}
                <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="flex items-center gap-4 mb-10 border-b border-gray-50 pb-6">
                        <div className="size-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-gray-900 uppercase tracking-tighter">Gateway de Pagamento</h3>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Mercado Pago & Segurança</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border-2 border-dashed border-gray-100 rounded-3xl">
                        <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo.png" className="h-6 grayscale opacity-40" alt="Mercado Pago" />
                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Status da Integração</p>
                            <p className="text-xs font-black text-gray-300 uppercase mt-1">Não configurada ou requerendo atenção</p>
                        </div>
                        <button className="bg-sidebar-bg text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all">
                            Conectar API
                        </button>
                    </div>
                </section>

                <div className="flex gap-4 pt-4">
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-primary text-white px-10 py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined font-black">save</span>
                        {saved ? "Configurações Salvas!" : "Salvar Todas as Alterações"}
                    </button>
                </div>
            </div>
        </div>
    );
};
