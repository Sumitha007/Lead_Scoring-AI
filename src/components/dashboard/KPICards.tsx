import { Users, Flame, TrendingUp, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { kpiData } from "@/data/mockData";

interface KPICardProps {
  title: string;
  value: string | number;
  trend: number;
  icon: React.ReactNode;
  iconBg: string;
}

const KPICard = ({ title, value, trend, icon, iconBg }: KPICardProps) => {
  const isPositive = trend >= 0;
  return (
    <div className="rounded-lg bg-card p-5 shadow-card hover:shadow-card-hover transition-shadow animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-card-foreground">{value}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${iconBg}`}>{icon}</div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs font-medium">
        {isPositive ? (
          <ArrowUpRight className="h-3.5 w-3.5 text-lead-hot" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5 text-lead-drop" />
        )}
        <span className={isPositive ? "text-lead-hot" : "text-lead-drop"}>
          {Math.abs(trend)}%
        </span>
        <span className="text-muted-foreground">vs last month</span>
      </div>
    </div>
  );
};

const KPICards = () => {
  const cards: KPICardProps[] = [
    {
      title: "Total Leads",
      value: kpiData.totalLeads.toLocaleString(),
      trend: kpiData.totalLeadsTrend,
      icon: <Users className="h-5 w-5 text-primary" />,
      iconBg: "bg-primary/10",
    },
    {
      title: "Hot Leads 🔥",
      value: kpiData.hotLeads,
      trend: kpiData.hotLeadsTrend,
      icon: <Flame className="h-5 w-5 text-lead-hot" />,
      iconBg: "bg-lead-hot/10",
    },
    {
      title: "Conversion Rate",
      value: `${kpiData.conversionRate}%`,
      trend: kpiData.conversionTrend,
      icon: <TrendingUp className="h-5 w-5 text-lead-warm" />,
      iconBg: "bg-lead-warm/10",
    },
    {
      title: "Average Lead Score",
      value: kpiData.averageScore,
      trend: kpiData.averageScoreTrend,
      icon: <BarChart3 className="h-5 w-5 text-lead-cold" />,
      iconBg: "bg-lead-cold/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <KPICard key={card.title} {...card} />
      ))}
    </div>
  );
};

export default KPICards;
