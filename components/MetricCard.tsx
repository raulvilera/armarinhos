import React, { ReactNode } from "react";
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
  accent?: 'amber' | 'green' | 'blue' | 'red';
}

const accentMap = {
  amber: {
    iconBg: 'linear-gradient(135deg, hsl(43 96% 56%), hsl(38 90% 46%))',
    iconColor: '#1a1600',
    barColor: 'hsl(43 90% 52%)',
    badgeBg: 'hsl(43 90% 96%)',
    badgeColor: 'hsl(38 80% 35%)',
  },
  green: {
    iconBg: 'linear-gradient(135deg, hsl(142 72% 48%), hsl(142 65% 38%))',
    iconColor: 'white',
    barColor: 'hsl(142 72% 44%)',
    badgeBg: 'hsl(142 60% 96%)',
    badgeColor: 'hsl(142 65% 32%)',
  },
  blue: {
    iconBg: 'linear-gradient(135deg, hsl(215 85% 55%), hsl(215 75% 44%))',
    iconColor: 'white',
    barColor: 'hsl(215 80% 52%)',
    badgeBg: 'hsl(215 70% 96%)',
    badgeColor: 'hsl(215 65% 38%)',
  },
  red: {
    iconBg: 'linear-gradient(135deg, hsl(0 72% 56%), hsl(0 65% 46%))',
    iconColor: 'white',
    barColor: 'hsl(0 72% 52%)',
    badgeBg: 'hsl(0 65% 96%)',
    badgeColor: 'hsl(0 65% 38%)',
  },
};

const MetricCard = ({
  title, value, icon, change, changeLabel, positive = true, extraInfo, progressBar, accent = 'amber',
}: MetricCardProps) => {
  const a = accentMap[accent];
  return (
    <div className="bg-white rounded-2xl border border-stone-100 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 min-h-[148px] group shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400 mb-2">{title}</p>
          <h3 className="text-2xl font-bold text-stone-900 tracking-tight leading-none">{value}</h3>
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 transition-transform group-hover:scale-110 duration-300 shadow-sm"
          style={{ background: a.iconBg }}>
          {icon && React.isValidElement(icon) ? (
            React.cloneElement(icon as React.ReactElement<any>, {
              className: "w-5 h-5",
              style: { color: a.iconColor },
            })
          ) : icon}
        </div>
      </div>

      <div className="mt-4">
        {progressBar !== undefined && (
          <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${progressBar}%`, background: a.barColor }} />
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          {change && (
            <div className="flex items-center gap-1.5">
              <div className={cn("flex items-center gap-1 text-[11px] font-semibold",
                positive ? "text-emerald-600" : "text-red-500")}>
                {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {change}
              </div>
              {changeLabel && <span className="text-[10px] text-stone-300 font-medium">{changeLabel}</span>}
            </div>
          )}
          {extraInfo && (
            <span className="text-[10px] text-stone-400 font-medium ml-auto">{extraInfo}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
