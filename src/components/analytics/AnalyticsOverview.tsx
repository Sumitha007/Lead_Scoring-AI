import { TrendingUp, Eye, MousePointerClick, UserCheck, ArrowUpRight, ArrowDownRight } from "lucide-react";

const metrics = [
  { label: "Page Views", value: "48.2K", trend: 14.2, icon: Eye, iconBg: "bg-primary/10", iconColor: "text-primary" },
  { label: "Click-Through Rate", value: "6.8%", trend: 2.1, icon: MousePointerClick, iconBg: "bg-lead-warm/10", iconColor: "text-lead-warm" },
  { label: "Qualified Leads", value: "598", trend: 9.7, icon: UserCheck, iconBg: "bg-lead-hot/10", iconColor: "text-lead-hot" },
  { label: "Conversion Value", value: "$124K", trend: -3.5, icon: TrendingUp, iconBg: "bg-lead-cold/10", iconColor: "text-lead-cold" },
];

const AnalyticsOverview = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {metrics.map(m => {
      const pos = m.trend >= 0;
      return (
        <div key={m.label} className="rounded-lg bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{m.label}</p>
              <p className="mt-1.5 text-2xl font-bold text-card-foreground">{m.value}</p>
            </div>
            <div className={`rounded-lg p-2.5 ${m.iconBg}`}><m.icon className={`h-5 w-5 ${m.iconColor}`} /></div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs font-medium">
            {pos ? <ArrowUpRight className="h-3.5 w-3.5 text-lead-hot" /> : <ArrowDownRight className="h-3.5 w-3.5 text-lead-drop" />}
            <span className={pos ? "text-lead-hot" : "text-lead-drop"}>{Math.abs(m.trend)}%</span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        </div>
      );
    })}
  </div>
);

export default AnalyticsOverview;
