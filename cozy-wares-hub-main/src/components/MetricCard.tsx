import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string;
  changeLabel?: string;
  positive?: boolean;
  children?: ReactNode;
}

const MetricCard = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  positive = true,
  children,
}: MetricCardProps) => {
  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border relative overflow-hidden group hover:shadow-glow transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-black">{value}</h3>
        </div>
        <div className="p-2 bg-primary/10 text-primary rounded-lg">{icon}</div>
      </div>
      {change && (
        <div className="flex items-center gap-2">
          {positive ? (
            <TrendingUp className="w-3 h-3 text-success" />
          ) : (
            <TrendingDown className="w-3 h-3 text-destructive" />
          )}
          <span
            className={`text-xs font-bold ${
              positive ? "text-success" : "text-destructive"
            }`}
          >
            {change}
          </span>
          {changeLabel && (
            <span className="text-muted-foreground text-[10px]">{changeLabel}</span>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default MetricCard;
