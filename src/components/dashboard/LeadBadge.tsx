import { cn } from "@/lib/utils";
import type { LeadCategory } from "@/data/mockData";

const categoryStyles: Record<LeadCategory, string> = {
  Hot: "bg-lead-hot/15 text-lead-hot border-lead-hot/30",
  Warm: "bg-lead-warm/15 text-lead-warm border-lead-warm/30",
  Cold: "bg-lead-cold/15 text-lead-cold border-lead-cold/30",
  Drop: "bg-lead-drop/15 text-lead-drop border-lead-drop/30",
};

const LeadBadge = ({ category }: { category: LeadCategory }) => (
  <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", categoryStyles[category])}>
    {category}
  </span>
);

export default LeadBadge;
