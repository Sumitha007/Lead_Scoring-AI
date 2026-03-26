import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Website", value: 485, fill: "hsl(217, 91%, 50%)" },
  { name: "Social Media", value: 328, fill: "hsl(142, 71%, 45%)" },
  { name: "Email Campaign", value: 276, fill: "hsl(32, 95%, 55%)" },
  { name: "Referral", value: 159, fill: "hsl(280, 67%, 55%)" },
];

const total = data.reduce((s, d) => s + d.value, 0);

const SourceBreakdown = () => (
  <div className="rounded-lg bg-card p-5 shadow-card animate-fade-in">
    <h3 className="mb-1 text-sm font-semibold text-card-foreground">Lead Source Breakdown</h3>
    <p className="mb-4 text-xs text-muted-foreground">Where your leads come from</p>
    <div className="flex flex-col items-center gap-4 md:flex-row">
      <div className="w-full md:w-1/2">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" outerRadius={80} innerRadius={50} paddingAngle={3} dataKey="value" stroke="none">
              {data.map((d, i) => <Cell key={i} fill={d.fill} />)}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(220,13%,90%)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full space-y-2 md:w-1/2">
        {data.map(d => (
          <div key={d.name} className="flex items-center justify-between rounded-md bg-accent/40 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
              <span className="text-xs font-medium text-card-foreground">{d.name}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-card-foreground">{d.value}</span>
              <span className="ml-1.5 text-[10px] text-muted-foreground">{((d.value / total) * 100).toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SourceBreakdown;
