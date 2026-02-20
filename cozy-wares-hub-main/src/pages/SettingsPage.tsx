import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Save, Store, User, Bell, Shield } from "lucide-react";

const SettingsPage = () => {
  const [storeName, setStoreName] = useState("ArmaSaaS Retrosaria");
  const [ownerName, setOwnerName] = useState("Maria Santos");
  const [email, setEmail] = useState("maria@armasaas.com");
  const [phone, setPhone] = useState("(11) 99999-0000");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout title="Ajustes" subtitle="Configure sua loja">
      <div className="max-w-2xl space-y-8">
        {/* Store Info */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-5 h-5 text-primary" />
            <h3 className="font-black text-lg">Dados da Loja</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Nome da Loja</label>
              <input className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
                <input className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Telefone</label>
                <input className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h3 className="font-black text-lg">Proprietário</h3>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Nome Completo</label>
            <input className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-black text-lg">Notificações</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Alertas de estoque baixo</p>
              <p className="text-xs text-muted-foreground">Receber notificações quando o estoque estiver crítico</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-all relative ${notifications ? "gradient-primary" : "bg-muted"}`}
            >
              <div className={`w-5 h-5 bg-card rounded-full absolute top-0.5 transition-all shadow-sm ${notifications ? "left-6" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="gradient-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
        >
          <Save className="w-4 h-4" />
          {saved ? "Salvo com sucesso!" : "Salvar Alterações"}
        </button>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
