import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  CreditCard,
  UserPlus,
  Truck,
  BarChart3,
  HelpCircle,
} from "lucide-react";

const actions = [
  { icon: PlusCircle, label: "Novo Produto", path: "/produtos" },
  { icon: CreditCard, label: "Venda Direta", path: "/vendas" },
  { icon: UserPlus, label: "Cadastrar Cliente", path: "/clientes" },
  { icon: Truck, label: "Novo Fornecedor", path: "/ajustes" },
  { icon: BarChart3, label: "Relatórios", path: "/financeiro" },
  { icon: HelpCircle, label: "Ajuda", path: "/ajustes" },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h4 className="text-xl font-black tracking-tight mb-6">Ações Rápidas</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center justify-center p-6 bg-card rounded-2xl shadow-sm border border-border hover:border-primary/50 hover:shadow-glow transition-all group"
          >
            <action.icon className="w-7 h-7 text-primary mb-3 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
