import React, { useState } from 'react';
import { Save, Store, User, Bell, Shield, CreditCard, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { cn } from "../lib/utils";
import { checkMPConnection } from '../services/mercadopagoService';

export const Settings: React.FC = () => {
    const [storeName, setStoreName] = useState("Armarinhos Vicmar");
    const [ownerName, setOwnerName] = useState("Raul Vilera");
    const [email, setEmail] = useState("contato@vicmar.com");
    const [phone, setPhone] = useState("(11) 95270-9128");
    const [notifications, setNotifications] = useState(true);
    const [saved, setSaved] = useState(false);
    const [mpStatus, setMpStatus] = useState<{ ok: boolean; message: string; loading: boolean }>({
        ok: false,
        message: 'Verificando conexão...',
        loading: true
    });

    React.useEffect(() => {
        verifyMP();
    }, []);

    const verifyMP = async () => {
        setMpStatus(prev => ({ ...prev, loading: true }));
        const result = await checkMPConnection();
        setMpStatus({ ...result, loading: false });
    };

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

                    <div className={cn(
                        "flex flex-col sm:flex-row items-center gap-6 p-8 border-2 rounded-[2rem] transition-all",
                        mpStatus.loading ? "border-gray-100 bg-gray-50/50" :
                            mpStatus.ok ? "border-green-100 bg-green-50/30" : "border-red-100 bg-red-50/30"
                    )}>
                        <div className="size-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100">
                            <img src="https://logodownload.org/wp-content/uploads/2019/06/mercado-pago-logo.png" className={cn("h-4 transition-all", !mpStatus.ok && !mpStatus.loading && "grayscale opacity-50")} alt="Mercado Pago" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Status da Integração</p>
                                {mpStatus.loading ? (
                                    <RefreshCw className="w-3 h-3 text-primary animate-spin" />
                                ) : mpStatus.ok ? (
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                ) : (
                                    <XCircle className="w-3 h-3 text-red-500" />
                                )}
                            </div>
                            <p className={cn(
                                "text-xs font-black uppercase",
                                mpStatus.loading ? "text-gray-400" :
                                    mpStatus.ok ? "text-green-600" : "text-red-600"
                            )}>
                                {mpStatus.message}
                            </p>
                        </div>
                        <button
                            onClick={verifyMP}
                            disabled={mpStatus.loading}
                            className="bg-sidebar-bg text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            {mpStatus.loading ? "Testando..." : "Testar Conexão"}
                        </button>
                    </div>

                    {!mpStatus.ok && !mpStatus.loading && (
                        <div className="mt-6 p-6 bg-red-50/50 rounded-2xl border border-red-100/50">
                            <p className="text-[10px] font-bold text-red-700 uppercase leading-relaxed">
                                <b>Importante:</b> O token de acesso do Mercado Pago (MP_ACCESS_TOKEN) não foi detectado ou é inválido nas variáveis de ambiente do servidor. Sem ele, a plataforma não poderá processar assinaturas.
                            </p>
                        </div>
                    )}
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
