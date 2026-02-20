import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../lib/utils";

interface MetricCardProps {
    title: string;
    value: string;
    icon: ReactNode;
    change?: string;
    changeLabel?: string;
    positive?: boolean;
}

const MetricCard = ({
    title,
    value,
    icon,
    change,
    changeLabel,
    positive = true,
}: MetricCardProps) => {
    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className="text-primary">{icon}</div>
            </div>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">
                        {title}
                    </p>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h3>
                </div>
                <div className="size-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center border border-primary/10">
                    {icon}
                </div>
            </div>

            {change && (
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                        positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                        {positive ? (
                            <TrendingUp className="w-3 h-3" />
                        ) : (
                            <TrendingDown className="w-3 h-3" />
                        )}
                        {change}
                    </div>
                    {changeLabel && (
                        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{changeLabel}</span>
                    )}
                </div>
            )}
        </div>
    );
};

export default MetricCard;
