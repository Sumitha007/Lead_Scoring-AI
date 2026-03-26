export type LeadCategory = "Hot" | "Warm" | "Cold" | "Drop";
export type LeadSource = "Website" | "Social Media" | "Email Campaign" | "Referral";

export interface Lead {
  id: string;
  name: string;
  email: string;
  score: number;
  category: LeadCategory;
  source: LeadSource;
  recommendedAction: string;
  avatar: string;
  company: string;
  pagesVisited: number;
  timeSpent: string;
  socialLikes: number;
  socialComments: number;
  sentiment: "Positive" | "Negative" | "Neutral";
  aiExplanation: string;
  lastActivity: string;
}

export const leads: Lead[] = [
  {
    id: "LD-001",
    name: "Sarah Chen",
    email: "sarah.chen@techcorp.com",
    score: 94,
    category: "Hot",
    source: "Website",
    recommendedAction: "Contact immediately",
    avatar: "SC",
    company: "TechCorp Inc.",
    pagesVisited: 23,
    timeSpent: "1h 42m",
    socialLikes: 45,
    socialComments: 12,
    sentiment: "Positive",
    aiExplanation: "High score due to repeated pricing page visits, demo request form interaction, and strong ad click-through rate.",
    lastActivity: "2 min ago",
  },
  {
    id: "LD-002",
    name: "James Rodriguez",
    email: "j.rodriguez@innovate.io",
    score: 87,
    category: "Hot",
    source: "Social Media",
    recommendedAction: "Send personalized email",
    avatar: "JR",
    company: "Innovate.io",
    pagesVisited: 18,
    timeSpent: "58m",
    socialLikes: 67,
    socialComments: 23,
    sentiment: "Positive",
    aiExplanation: "Strong social engagement with product posts, visited comparison page 4 times, and downloaded whitepaper.",
    lastActivity: "15 min ago",
  },
  {
    id: "LD-003",
    name: "Emily Watson",
    email: "emily.w@startuplab.co",
    score: 72,
    category: "Warm",
    source: "Email Campaign",
    recommendedAction: "Send case study",
    avatar: "EW",
    company: "StartupLab",
    pagesVisited: 12,
    timeSpent: "34m",
    socialLikes: 15,
    socialComments: 3,
    sentiment: "Neutral",
    aiExplanation: "Opened 5 marketing emails, clicked through to features page. Shows interest but hasn't visited pricing.",
    lastActivity: "1 hour ago",
  },
  {
    id: "LD-004",
    name: "Michael Park",
    email: "m.park@globaltech.com",
    score: 65,
    category: "Warm",
    source: "Referral",
    recommendedAction: "Schedule follow-up call",
    avatar: "MP",
    company: "GlobalTech",
    pagesVisited: 8,
    timeSpent: "22m",
    socialLikes: 8,
    socialComments: 1,
    sentiment: "Neutral",
    aiExplanation: "Referred by existing customer, visited product overview page. Moderate engagement signals.",
    lastActivity: "3 hours ago",
  },
  {
    id: "LD-005",
    name: "Anna Kowalski",
    email: "anna.k@design.studio",
    score: 58,
    category: "Warm",
    source: "Website",
    recommendedAction: "Offer free trial",
    avatar: "AK",
    company: "Design Studio",
    pagesVisited: 6,
    timeSpent: "18m",
    socialLikes: 22,
    socialComments: 5,
    sentiment: "Positive",
    aiExplanation: "Browsed integrations page and blog. Social sentiment positive. Needs a stronger conversion trigger.",
    lastActivity: "5 hours ago",
  },
  {
    id: "LD-006",
    name: "David Liu",
    email: "d.liu@finserve.com",
    score: 41,
    category: "Cold",
    source: "Social Media",
    recommendedAction: "Add to nurture sequence",
    avatar: "DL",
    company: "FinServe Corp",
    pagesVisited: 3,
    timeSpent: "8m",
    socialLikes: 5,
    socialComments: 0,
    sentiment: "Neutral",
    aiExplanation: "Minimal site engagement. Followed company page but no direct interaction with product content.",
    lastActivity: "1 day ago",
  },
  {
    id: "LD-007",
    name: "Rachel Kim",
    email: "r.kim@retailpro.com",
    score: 35,
    category: "Cold",
    source: "Email Campaign",
    recommendedAction: "Send educational content",
    avatar: "RK",
    company: "RetailPro",
    pagesVisited: 2,
    timeSpent: "5m",
    socialLikes: 2,
    socialComments: 0,
    sentiment: "Neutral",
    aiExplanation: "Opened one email, briefly visited homepage. Low intent signals detected.",
    lastActivity: "2 days ago",
  },
  {
    id: "LD-008",
    name: "Tom Bradley",
    email: "t.bradley@oldschool.net",
    score: 15,
    category: "Drop",
    source: "Website",
    recommendedAction: "Remove from active pipeline",
    avatar: "TB",
    company: "OldSchool Networks",
    pagesVisited: 1,
    timeSpent: "1m",
    socialLikes: 0,
    socialComments: 0,
    sentiment: "Negative",
    aiExplanation: "Single page visit with immediate bounce. No further engagement across any channel.",
    lastActivity: "5 days ago",
  },
];

export const kpiData = {
  totalLeads: 1248,
  hotLeads: 186,
  conversionRate: 24.8,
  averageScore: 62,
  totalLeadsTrend: 12.5,
  hotLeadsTrend: 8.3,
  conversionTrend: 3.2,
  averageScoreTrend: -1.4,
};

export const chartData = [
  { name: "Hot", value: 186, fill: "hsl(142, 71%, 45%)" },
  { name: "Warm", value: 412, fill: "hsl(32, 95%, 55%)" },
  { name: "Cold", value: 384, fill: "hsl(217, 91%, 60%)" },
  { name: "Drop", value: 266, fill: "hsl(0, 72%, 51%)" },
];

export const barChartData = [
  { month: "Jan", hot: 120, warm: 340, cold: 410, drop: 290 },
  { month: "Feb", hot: 135, warm: 360, cold: 390, drop: 275 },
  { month: "Mar", hot: 150, warm: 380, cold: 370, drop: 260 },
  { month: "Apr", hot: 162, warm: 395, cold: 380, drop: 270 },
  { month: "May", hot: 175, warm: 405, cold: 375, drop: 268 },
  { month: "Jun", hot: 186, warm: 412, cold: 384, drop: 266 },
];
