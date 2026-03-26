import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { chartData, barChartData } from "@/data/mockData";

const LeadCharts = () => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Pie Chart */}
      <div className="rounded-lg bg-card p-5 shadow-card animate-fade-in">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Lead Distribution</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(220, 13%, 90%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: "12px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => <span className="text-xs text-muted-foreground">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="rounded-lg bg-card p-5 shadow-card animate-fade-in">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">Monthly Trend</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={barChartData} barSize={14} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(220, 13%, 90%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="hot" fill="hsl(142, 71%, 45%)" radius={[3, 3, 0, 0]} name="Hot" />
            <Bar dataKey="warm" fill="hsl(32, 95%, 55%)" radius={[3, 3, 0, 0]} name="Warm" />
            <Bar dataKey="cold" fill="hsl(217, 91%, 60%)" radius={[3, 3, 0, 0]} name="Cold" />
            <Bar dataKey="drop" fill="hsl(0, 72%, 51%)" radius={[3, 3, 0, 0]} name="Drop" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LeadCharts;
