import { leads } from "@/data/mockData";
import LeadBadge from "@/components/dashboard/LeadBadge";

const sorted = [...leads].sort((a, b) => b.score - a.score).slice(0, 5);

const TopPerformers = () => (
  <div className="rounded-lg bg-card p-5 shadow-card animate-fade-in">
    <h3 className="mb-1 text-sm font-semibold text-card-foreground">Top Performing Leads</h3>
    <p className="mb-4 text-xs text-muted-foreground">Highest scoring leads this period</p>
    <div className="space-y-2.5">
      {sorted.map((lead, i) => (
        <div key={lead.id} className="flex items-center gap-3 rounded-md bg-accent/40 p-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
            {i + 1}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {lead.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-card-foreground truncate">{lead.name}</p>
            <p className="text-[10px] text-muted-foreground">{lead.company}</p>
          </div>
          <div className="flex items-center gap-2">
            <LeadBadge category={lead.category} />
            <span className="text-sm font-bold text-card-foreground">{lead.score}%</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TopPerformers;
