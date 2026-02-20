import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus, Search, Edit, Trash2, Package, LayoutGrid, List, Eye } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
}

const initialProducts: Product[] = [
  { id: 1, name: "Linha de Costura 120 Resistente 2000j", category: "Linhas e Fios", price: 5.80, stock: 2, description: "Linha resistente para uso profissional" },
  { id: 2, name: "Linha Korefios 120 1500j", category: "Linhas e Fios", price: 4.80, stock: 12, description: "Linha de alta qualidade" },
  { id: 3, name: "Linha de Costura Poliéster", category: "Linhas e Fios", price: 8.90, stock: 30, description: "Poliéster premium" },
  { id: 4, name: "Linha Nylon Transparente", category: "Linhas e Fios", price: 6.50, stock: 45, description: "Ideal para acabamentos invisíveis" },
  { id: 5, name: "Chave Liga/Desliga p/ Máquina", category: "Acessórios p/ Máquina", price: 25.00, stock: 8, description: "Chave 220V - 2.2KW" },
  { id: 6, name: "Correia de Motor Industrial", category: "Acessórios p/ Máquina", price: 15.00, stock: 5, description: "Correia Toyo-Belt" },
  { id: 7, name: "Agulhas p/ Máquina #14", category: "Acessórios p/ Máquina", price: 15.00, stock: 0, description: "Marca Singer" },
  { id: 8, name: "Pedal p/ Máquina de Costura", category: "Acessórios p/ Máquina", price: 35.00, stock: 3, description: "Universal" },
  { id: 9, name: "Barbante Colorido EuroRoma", category: "Barbantes", price: 12.50, stock: 48, description: "500g - Várias cores" },
  { id: 10, name: "Botões Nácar 15mm", category: "Aviamentos", price: 12.50, stock: 12, description: "Tipo redondo" },
  { id: 11, name: "Zíper Invisível 40cm", category: "Aviamentos", price: 6.50, stock: 85, description: "Várias cores" },
  { id: 12, name: "Fita de Cetim 25mm", category: "Aviamentos", price: 4.20, stock: 120, description: "10 metros" },
  { id: 13, name: "Luminária p/ Máquina LED", category: "Luminária p/ Máquina", price: 45.00, stock: 6, description: "LED flexível com imã" },
  { id: 14, name: "Tecido Algodão Estampado", category: "Tecidos", price: 35.90, stock: 48, description: "100% algodão - metro" },
];

const categoryColors: Record<string, string> = {
  "Linhas e Fios": "from-blue-500 to-cyan-500",
  "Acessórios p/ Máquina": "from-purple-500 to-indigo-500",
  "Barbantes": "from-green-500 to-emerald-500",
  "Aviamentos": "from-pink-500 to-rose-500",
  "Luminária p/ Máquina": "from-amber-500 to-yellow-500",
  "Tecidos": "from-teal-500 to-cyan-500",
};

const ProductsPage = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", description: "" });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = [...new Set(products.map((p) => p.category))];

  const filtered = products.filter(
    (p) =>
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())) &&
      (!activeCategory || p.category === activeCategory)
  );

  const groupedProducts = categories
    .filter((cat) => !activeCategory || cat === activeCategory)
    .map((cat) => ({
      category: cat,
      items: filtered.filter((p) => p.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  const handleSave = () => {
    if (!form.name || !form.category) return;
    if (editId !== null) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editId
            ? { ...p, name: form.name, category: form.category, price: Number(form.price), stock: Number(form.stock), description: form.description }
            : p
        )
      );
    } else {
      setProducts((prev) => [
        ...prev,
        { id: Date.now(), name: form.name, category: form.category, price: Number(form.price), stock: Number(form.stock), description: form.description },
      ]);
    }
    setForm({ name: "", category: "", price: "", stock: "", description: "" });
    setShowForm(false);
    setEditId(null);
  };

  const handleEdit = (p: Product) => {
    setForm({ name: p.name, category: p.category, price: String(p.price), stock: String(p.stock), description: p.description || "" });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <DashboardLayout title="Catálogo de Produtos" subtitle="Gerencie seu catálogo completo">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            className="w-full bg-card border border-border rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm"
            placeholder="Buscar produto ou categoria..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", category: "", price: "", stock: "", description: "" }); }}
            className="gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" /> Novo Produto
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            !activeCategory ? "gradient-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          INÍCIO
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all uppercase ${
              activeCategory === cat ? "gradient-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 animate-fade-in">
          <h3 className="font-bold mb-4">{editId ? "Editar Produto" : "Novo Produto"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="Preço" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="Estoque" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            <input className="bg-background border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="gradient-primary text-primary-foreground px-5 py-2 rounded-lg font-bold text-sm hover:opacity-90">Salvar</button>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="bg-muted text-muted-foreground px-5 py-2 rounded-lg font-bold text-sm hover:bg-muted/80">Cancelar</button>
          </div>
        </div>
      )}

      {/* Products */}
      {viewMode === "grid" ? (
        <div className="space-y-8">
          {groupedProducts.map((group) => (
            <div key={group.category}>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-black text-primary">{group.category}</h3>
                <span className="text-xs text-muted-foreground font-medium">Ver tudo ({group.items.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.items.map((p) => (
                  <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all group">
                    <div className={`h-40 bg-gradient-to-br ${categoryColors[p.category] || "from-gray-500 to-gray-600"} flex items-center justify-center relative`}>
                      <Package className="w-16 h-16 text-white/30" />
                      {p.stock === 0 && (
                        <span className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-1 rounded-full">ESGOTADO</span>
                      )}
                      {p.stock > 0 && p.stock < 5 && (
                        <span className="absolute top-3 right-3 bg-warning text-warning-foreground text-[10px] font-bold px-2 py-1 rounded-full">ÚLTIMAS UNI.</span>
                      )}
                      <div className="absolute top-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(p)} className="p-1.5 bg-white/90 rounded-lg text-foreground hover:bg-white transition-colors">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 bg-white/90 rounded-lg text-destructive hover:bg-white transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold leading-tight mb-1 line-clamp-2">{p.name}</p>
                      {p.description && (
                        <p className="text-xs text-muted-foreground mb-3">{p.description}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-black text-lg">R$ {p.price.toFixed(2).replace(".", ",")}</span>
                        <span className={`text-xs font-bold ${p.stock === 0 ? "text-destructive" : p.stock < 10 ? "text-warning" : "text-success"}`}>
                          {p.stock} uni.
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Produto</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Categoria</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Preço</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Estoque</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold flex items-center gap-3">
                    <Package className="w-4 h-4 text-primary" />
                    <div>
                      <p>{p.name}</p>
                      {p.description && <p className="text-xs text-muted-foreground font-normal">{p.description}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{p.category}</td>
                  <td className="px-6 py-4 text-sm font-bold">R$ {p.price.toFixed(2).replace(".", ",")}</td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${p.stock === 0 ? "text-destructive" : p.stock < 10 ? "text-warning" : "text-success"}`}>
                      {p.stock} uni.
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(p)} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ProductsPage;
