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
    extraInfo?: string;
    progressBar?: number;
}

const MetricCard = ({
    title,
    value,
    icon,
    change,
    changeLabel,
    positive = true,
    extraInfo,
    progressBar,
}: MetricCardProps) => {
    return (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all duration-500 min-h-[160px]">
            <div className="flex items-center justify-between mb-auto">
                <div className="flex-1">
                    <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">
                        {title}
                    </p>
                    <h3 className="text-4xl font-black text-gray-950 tracking-tighter mb-4">{value}</h3>
                </div>
                <div className="size-16 bg-[#eef4ff] text-primary rounded-full flex items-center justify-center border border-primary/5 transition-transform group-hover:scale-110 duration-500 shrink-0 ml-4">
                    {React.cloneElement(icon as React.ReactElement, { className: "w-7 h-7" })}
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex flex-col gap-3">
                {progressBar !== undefined && (
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all duration-1000",
                                positive ? "bg-primary" : "bg-red-500"
                            )}
                            style={{ width: `${progressBar}%` }}
                        />
                    </div>
                )}

                <div className="flex items-center justify-between">
                    {change && (
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "flex items-center gap-1 font-black text-sm",
                                positive ? "text-green-600" : "text-red-600"
                            )}>
                                {positive ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}
                                {change}
                            </div>
                            {changeLabel && (
                                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">{changeLabel}</span>
                            )}
                        </div>
                    )}
                    {extraInfo && (
                        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{extraInfo}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MetricCard;
