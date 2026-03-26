const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"];

// activity intensity 0-100
const heatData: number[][] = [
  [45, 62, 78, 55, 70, 30, 15],
  [50, 68, 82, 60, 75, 35, 20],
  [55, 75, 90, 72, 80, 40, 22],
  [60, 80, 95, 85, 88, 42, 18],
  [58, 72, 88, 78, 82, 38, 16],
  [52, 65, 80, 68, 74, 32, 14],
  [48, 60, 74, 62, 68, 28, 12],
  [42, 55, 68, 55, 60, 25, 10],
  [35, 48, 58, 45, 52, 20, 8],
];

const getColor = (v: number) => {
  if (v >= 85) return "bg-primary";
  if (v >= 65) return "bg-primary/70";
  if (v >= 45) return "bg-primary/40";
  if (v >= 25) return "bg-primary/20";
  return "bg-primary/8";
};

const EngagementHeatmap = () => (
  <div className="rounded-lg bg-card p-5 shadow-card animate-fade-in">
    <h3 className="mb-1 text-sm font-semibold text-card-foreground">Engagement Heatmap</h3>
    <p className="mb-4 text-xs text-muted-foreground">Peak lead activity by day & hour</p>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="w-12" />
            {days.map(d => (
              <th key={d} className="px-1 pb-2 text-center text-[10px] font-medium text-muted-foreground">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((h, hi) => (
            <tr key={h}>
              <td className="pr-2 text-right text-[10px] font-medium text-muted-foreground">{h}</td>
              {days.map((d, di) => (
                <td key={d} className="p-0.5">
                  <div
                    className={`mx-auto h-6 w-full max-w-[38px] rounded-sm ${getColor(heatData[hi][di])} transition-colors`}
                    title={`${d} ${h}: ${heatData[hi][di]}%`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="mt-3 flex items-center justify-center gap-1.5">
      <span className="text-[10px] text-muted-foreground">Low</span>
      {["bg-primary/8", "bg-primary/20", "bg-primary/40", "bg-primary/70", "bg-primary"].map(c => (
        <div key={c} className={`h-3 w-6 rounded-sm ${c}`} />
      ))}
      <span className="text-[10px] text-muted-foreground">High</span>
    </div>
  </div>
);

export default EngagementHeatmap;
