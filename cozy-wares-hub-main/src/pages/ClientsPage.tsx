import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Search, Edit, Trash2, Users } from "lucide-react";

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
}

const initialClients: Client[] = [
  { id: 1, name: "Ana Silva", email: "ana@email.com", phone: "(11) 99999-0001", totalPurchases: 12 },
  { id: 2, name: "Carlos Souza", email: "carlos@email.com", phone: "(11) 99999-0002", totalPurchases: 8 },
  { id: 3, name: "Beatriz Lima", email: "beatriz@email.com", phone: "(11) 99999-0003", totalPurchases: 24 },
  { id: 4, name: "João Mendes", email: "joao@email.com", phone: "(11) 99999-0004", totalPurchases: 5 },
  { id: 5, name: "Maria Oliveira", email: "maria@email.com", phone: "(11) 99999-0005", totalPurchases: 31 },
];

const ClientsPage = () => {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const filtered = clients.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.name) return;
    if (editId !== null) {
      setClients((prev) => prev.map((c) => (c.id === editId ? { ...c, ...form } : c)));
    } else {
      setClients((prev) => [...prev, { id: Date.now(), name: form.name, email: form.email, phone: form.phone, totalPurchases: 0 }]);
    }
    setForm({ name: "", email: "", phone: "" });
    setShowForm(false);
    setEditId(null);
  };

  const handleEdit = (c: Client) => {
    setForm({ name: c.name, email: c.email, phone: c.phone });
    setEditId(c.id);
    setShowForm(true);
  };

  return (
    <DashboardLayout title="Clientes" subtitle="Gerencie sua base de clientes">
      <div className="flex items-center justify-between mb-6">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input className="w-full bg-card border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm" placeholder="Buscar cliente..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", email: "", phone: "" }); }} className="gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all">
          <Plus className="w-4 h-4" /> Novo Cliente
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 animate-fade-in">
          <h3 className="font-bold mb-4">{editId ? "Editar Cliente" : "Novo Cliente"}</h3>
          <div className="grid grid-cols-3 gap-4">
            <input className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="gradient-primary text-primary-foreground px-5 py-2 rounded-lg font-bold text-sm hover:opacity-90">Salvar</button>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="bg-muted text-muted-foreground px-5 py-2 rounded-lg font-bold text-sm">Cancelar</button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Cliente</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Email</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Telefone</th>
              <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Compras</th>
              <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold flex items-center gap-3">
                  <Users className="w-4 h-4 text-primary" /> {c.name}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{c.email}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{c.phone}</td>
                <td className="px-6 py-4 text-sm font-bold">{c.totalPurchases}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(c)} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => setClients((prev) => prev.filter((x) => x.id !== c.id))} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default ClientsPage;
