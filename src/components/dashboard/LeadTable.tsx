import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ChevronUp, ChevronDown } from "lucide-react";
import { leads, type Lead, type LeadCategory, type LeadSource } from "@/data/mockData";
import LeadBadge from "./LeadBadge";

interface LeadTableProps {
  onSelectLead: (lead: Lead) => void;
  selectedLeadId: string | null;
}

type SortKey = "name" | "score" | "category" | "source";

const LeadTable = ({ onSelectLead, selectedLeadId }: LeadTableProps) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<LeadCategory | "All">("All");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const filtered = useMemo(() => {
    let result = leads.filter(l => {
      const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.id.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === "All" || l.category === categoryFilter;
      const matchSource = sourceFilter === "All" || l.source === sourceFilter;
      return matchSearch && matchCategory && matchSource;
    });
    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "score") cmp = a.score - b.score;
      else cmp = a[sortKey].localeCompare(b[sortKey]);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [search, categoryFilter, sourceFilter, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />;
  };

  return (
    <div className="rounded-lg bg-card shadow-card animate-fade-in">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-card-foreground">Lead Scoring</h2>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-8 rounded-md border border-input bg-background pl-8 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as LeadCategory | "All")}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
            <option value="Drop">Drop</option>
          </select>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value as LeadSource | "All")}
            className="h-8 rounded-md border border-input bg-background px-2 text-sm outline-none"
          >
            <option value="All">All Sources</option>
            <option value="Website">Website</option>
            <option value="Social Media">Social Media</option>
            <option value="Email Campaign">Email Campaign</option>
            <option value="Referral">Referral</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="cursor-pointer px-4 py-3 hover:text-foreground" onClick={() => toggleSort("name")}>
                <span className="inline-flex items-center gap-1">Lead <SortIcon col="name" /></span>
              </th>
              <th className="cursor-pointer px-4 py-3 hover:text-foreground" onClick={() => toggleSort("score")}>
                <span className="inline-flex items-center gap-1">Score <SortIcon col="score" /></span>
              </th>
              <th className="cursor-pointer px-4 py-3 hover:text-foreground" onClick={() => toggleSort("category")}>
                <span className="inline-flex items-center gap-1">Category <SortIcon col="category" /></span>
              </th>
              <th className="cursor-pointer px-4 py-3 hover:text-foreground" onClick={() => toggleSort("source")}>
                <span className="inline-flex items-center gap-1">Source <SortIcon col="source" /></span>
              </th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(lead => (
              <tr
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className={`cursor-pointer border-b border-border transition-colors hover:bg-accent/50 ${selectedLeadId === lead.id ? "bg-primary/5" : ""}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {lead.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${lead.score}%` }}
                      />
                    </div>
                    <span className="font-semibold text-card-foreground">{lead.score}%</span>
                  </div>
                </td>
                <td className="px-4 py-3"><LeadBadge category={lead.category} /></td>
                <td className="px-4 py-3 text-muted-foreground">{lead.source}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{lead.recommendedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadTable;
