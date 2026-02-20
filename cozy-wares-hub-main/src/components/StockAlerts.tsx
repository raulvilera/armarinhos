import { AlertTriangle } from "lucide-react";

const alerts = [
  {
    name: "Linha de Costura Poliéster",
    detail: "Cor: Vermelho Sangue",
    qty: 2,
  },
  {
    name: "Botões Nácar 15mm",
    detail: "Tipo: Redondo",
    qty: 12,
  },
  {
    name: "Agulhas p/ Máquina #14",
    detail: "Marca: Singer",
    qty: 0,
  },
];

const StockAlerts = () => {
  return (
    <div className="bg-card p-8 rounded-2xl shadow-sm border border-border border-l-4 border-l-primary/40">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-black tracking-tight">Alerta de Estoque</h4>
        <span className="bg-destructive/10 text-destructive text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Crítico
        </span>
      </div>
      <div className="space-y-5">
        {alerts.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center border border-border">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">{item.name}</p>
              <p className="text-[11px] text-muted-foreground">{item.detail}</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-black ${item.qty === 0 ? "text-destructive" : "text-warning"}`}>
                {item.qty} uni.
              </p>
              <button className="text-[10px] text-primary font-bold hover:underline">
                Repor
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-8 border-2 border-primary/20 text-primary font-bold py-3 rounded-xl hover:gradient-primary hover:text-primary-foreground transition-all">
        Ver Todos os Alertas
      </button>
    </div>
  );
};

export default StockAlerts;
