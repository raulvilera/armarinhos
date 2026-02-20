import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Search, Eye, ShoppingCart } from "lucide-react";

interface Sale {
  id: number;
  customer: string;
  items: number;
  total: number;
  status: "pendente" | "processando" | "concluído";
  date: string;
}

const initialSales: Sale[] = [
  { id: 1001, customer: "Ana Silva", items: 3, total: 89.7, status: "concluído", date: "20/02/2026" },
  { id: 1002, customer: "Carlos Souza", items: 1, total: 35.9, status: "processando", date: "20/02/2026" },
  { id: 1003, customer: "Beatriz Lima", items: 5, total: 142.5, status: "pendente", date: "19/02/2026" },
  { id: 1004, customer: "João Mendes", items: 2, total: 54.0, status: "concluído", date: "19/02/2026" },
  { id: 1005, customer: "Maria Oliveira", items: 4, total: 198.0, status: "processando", date: "18/02/2026" },
];

const statusColors = {
  pendente: "bg-warning/10 text-warning",
  processando: "bg-primary/10 text-primary",
  concluído: "bg-success/10 text-success",
};

const SalesPage = () => {
  const [sales, setSales] = useState(initialSales);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customer: "", items: "", total: "" });

  const filtered = sales.filter((s) =>
    s.customer.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.customer) return;
    setSales((prev) => [
      {
        id: Date.now(),
        customer: form.customer,
        items: Number(form.items),
        total: Number(form.total),
        status: "pendente",
        date: "20/02/2026",
      },
      ...prev,
    ]);
    setForm({ customer: "", items: "", total: "" });
    setShowForm(false);
  };

  return (
    <DashboardLayout title="Vendas" subtitle="Acompanhe suas vendas e pedidos">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full bg-card border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm"
            placeholder="Buscar venda..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" /> Nova Venda
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 animate-fade-in">
          <h3 className="font-bold mb-4">Nova Venda</h3>
          <div className="grid grid-cols-3 gap-4">
            <input className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="Cliente" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} />
            <input className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="Qtd Itens" type="number" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} />
            <input className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="Total R$" type="number" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleAdd} className="gradient-primary text-primary-foreground px-5 py-2 rounded-lg font-bold text-sm hover:opacity-90">Registrar</button>
            <button onClick={() => setShowForm(false)} className="bg-muted text-muted-foreground px-5 py-2 rounded-lg font-bold text-sm">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Pedido</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Cliente</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Itens</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Total</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Data</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 text-sm font-bold flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                  #{s.id}
                </td>
                <td className="px-6 py-4 text-sm">{s.customer}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{s.items}</td>
                <td className="px-6 py-4 text-sm font-bold">R$ {s.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${statusColors[s.status]}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{s.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default SalesPage;
