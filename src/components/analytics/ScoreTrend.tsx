import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { week: "W1", hot: 140, warm: 350, cold: 400, drop: 280 },
  { week: "W2", hot: 148, warm: 358, cold: 395, drop: 275 },
  { week: "W3", hot: 155, warm: 370, cold: 388, drop: 270 },
  { week: "W4", hot: 158, warm: 375, cold: 382, drop: 268 },
  { week: "W5", hot: 163, warm: 382, cold: 380, drop: 265 },
  { week: "W6", hot: 170, warm: 390, cold: 378, drop: 262 },
  { week: "W7", hot: 175, warm: 398, cold: 382, drop: 264 },
  { week: "W8", hot: 180, warm: 405, cold: 380, drop: 263 },
  { week: "W9", hot: 182, warm: 408, cold: 383, drop: 265 },
  { week: "W10", hot: 184, warm: 410, cold: 384, drop: 266 },
  { week: "W11", hot: 185, warm: 411, cold: 383, drop: 266 },
  { week: "W12", hot: 186, warm: 412, cold: 384, drop: 266 },
];

const ScoreTrend = () => (
  <div className="rounded-lg bg-card p-5 shadow-card animate-fade-in">
    <h3 className="mb-1 text-sm font-semibold text-card-foreground">Lead Score Trend</h3>
    <p className="mb-4 text-xs text-muted-foreground">12-week category distribution</p>
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="gHot" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(142,71%,45%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(142,71%,45%)" stopOpacity={0} /></linearGradient>
          <linearGradient id="gWarm" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(32,95%,55%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(32,95%,55%)" stopOpacity={0} /></linearGradient>
          <linearGradient id="gCold" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(217,91%,60%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(217,91%,60%)" stopOpacity={0} /></linearGradient>
          <linearGradient id="gDrop" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(0,72%,51%)" stopOpacity={0.3} /><stop offset="95%" stopColor="hsl(0,72%,51%)" stopOpacity={0} /></linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,90%)" vertical={false} />
        <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,46%)" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220,13%,90%)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "12px" }} />
        <Legend verticalAlign="top" iconType="circle" iconSize={8} formatter={(v: string) => <span className="text-xs text-muted-foreground capitalize">{v}</span>} />
        <Area type="monotone" dataKey="hot" stroke="hsl(142,71%,45%)" fill="url(#gHot)" strokeWidth={2} name="Hot" />
        <Area type="monotone" dataKey="warm" stroke="hsl(32,95%,55%)" fill="url(#gWarm)" strokeWidth={2} name="Warm" />
        <Area type="monotone" dataKey="cold" stroke="hsl(217,91%,60%)" fill="url(#gCold)" strokeWidth={2} name="Cold" />
        <Area type="monotone" dataKey="drop" stroke="hsl(0,72%,51%)" fill="url(#gDrop)" strokeWidth={2} name="Drop" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default ScoreTrend;
