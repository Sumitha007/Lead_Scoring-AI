import { X, Globe, MessageSquare, ThumbsUp, Clock, FileText, Sparkles, Phone, Mail, Tag, Trash2 } from "lucide-react";
import type { Lead } from "@/data/mockData";
import LeadBadge from "./LeadBadge";

interface LeadProfileProps {
  lead: Lead;
  onClose: () => void;
}

const recommendations = [
  { icon: Phone, label: "Contact immediately", priority: "high" },
  { icon: Mail, label: "Send personalized email", priority: "medium" },
  { icon: Tag, label: "Offer discount", priority: "low" },
];

const LeadProfile = ({ lead, onClose }: LeadProfileProps) => {
  return (
    <div className="flex h-full flex-col rounded-lg bg-card shadow-card animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="text-sm font-semibold text-card-foreground">Lead Profile</h3>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {lead.avatar}
          </div>
          <div>
            <p className="font-semibold text-card-foreground">{lead.name}</p>
            <p className="text-xs text-muted-foreground">{lead.company} · {lead.email}</p>
          </div>
        </div>

        {/* Score + Category */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground mb-1">Lead Score</p>
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${lead.score}%` }} />
              </div>
              <span className="text-sm font-bold text-card-foreground">{lead.score}%</span>
            </div>
          </div>
          <LeadBadge category={lead.category} />
        </div>

        {/* Website Activity */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Website Activity</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md bg-accent/60 p-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Globe className="h-3.5 w-3.5" /> Pages Visited</div>
              <p className="mt-1 text-lg font-bold text-card-foreground">{lead.pagesVisited}</p>
            </div>
            <div className="rounded-md bg-accent/60 p-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Time Spent</div>
              <p className="mt-1 text-lg font-bold text-card-foreground">{lead.timeSpent}</p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Social Engagement</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md bg-accent/60 p-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><ThumbsUp className="h-3.5 w-3.5" /> Likes</div>
              <p className="mt-1 text-lg font-bold text-card-foreground">{lead.socialLikes}</p>
            </div>
            <div className="rounded-md bg-accent/60 p-2.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><MessageSquare className="h-3.5 w-3.5" /> Comments</div>
              <p className="mt-1 text-lg font-bold text-card-foreground">{lead.socialComments}</p>
            </div>
          </div>
        </div>

        {/* Sentiment */}
        <div className="rounded-md border border-border p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Sentiment</p>
          <span className={`text-sm font-semibold ${lead.sentiment === "Positive" ? "text-lead-hot" : lead.sentiment === "Negative" ? "text-lead-drop" : "text-muted-foreground"}`}>
            {lead.sentiment}
          </span>
        </div>

        {/* AI Explanation */}
        <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
            <Sparkles className="h-3.5 w-3.5" /> AI Insight
          </div>
          <p className="text-xs leading-relaxed text-card-foreground">{lead.aiExplanation}</p>
        </div>

        {/* Recommendations */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Recommended Actions</p>
          <div className="space-y-1.5">
            {recommendations.map(rec => (
              <div
                key={rec.label}
                className={`flex items-center gap-2.5 rounded-md p-2.5 text-xs font-medium transition-colors cursor-pointer ${
                  rec.priority === "high"
                    ? "bg-lead-hot/10 text-lead-hot hover:bg-lead-hot/20"
                    : rec.priority === "medium"
                    ? "bg-lead-warm/10 text-lead-warm hover:bg-lead-warm/20"
                    : "bg-accent text-muted-foreground hover:bg-accent/80"
                }`}
              >
                <rec.icon className="h-4 w-4" />
                {rec.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadProfile;
