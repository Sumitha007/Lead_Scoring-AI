const stages = [
  { label: "Visitors", value: 12480, pct: 100 },
  { label: "Leads Captured", value: 3120, pct: 25 },
  { label: "Qualified", value: 1248, pct: 10 },
  { label: "Engaged", value: 598, pct: 4.8 },
  { label: "Converted", value: 186, pct: 1.5 },
];

const maxValue = stages[0].value;

const ConversionFunnel = () => (
  <div className="rounded-lg bg-card p-5 shadow-card animate-fade-in">
    <h3 className="mb-1 text-sm font-semibold text-card-foreground">Conversion Funnel</h3>
    <p className="mb-5 text-xs text-muted-foreground">Visitor to customer journey</p>
    <div className="space-y-3">
      {stages.map((s, i) => {
        const widthPct = Math.max((s.value / maxValue) * 100, 12);
        const dropoff = i > 0 ? ((stages[i - 1].value - s.value) / stages[i - 1].value * 100).toFixed(1) : null;
        return (
          <div key={s.label}>
            {dropoff && (
              <div className="mb-1 flex items-center justify-center">
                <span className="text-[10px] font-medium text-lead-drop">↓ {dropoff}% drop-off</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-right text-xs font-medium text-muted-foreground">{s.label}</span>
              <div className="relative flex-1">
                <div
                  className="flex h-9 items-center justify-between rounded-md px-3 text-xs font-semibold text-primary-foreground transition-all"
                  style={{
                    width: `${widthPct}%`,
                    background: `hsl(217, 91%, ${50 + i * 8}%)`,
                  }}
                >
                  <span>{s.value.toLocaleString()}</span>
                  <span className="ml-1 text-[10px] opacity-80">{s.pct}%</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default ConversionFunnel;
