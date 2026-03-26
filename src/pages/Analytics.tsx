import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AnalyticsOverview from "@/components/analytics/AnalyticsOverview";
import ConversionFunnel from "@/components/analytics/ConversionFunnel";
import SourceBreakdown from "@/components/analytics/SourceBreakdown";
import ScoreTrend from "@/components/analytics/ScoreTrend";
import EngagementHeatmap from "@/components/analytics/EngagementHeatmap";
import TopPerformers from "@/components/analytics/TopPerformers";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Deep dive into lead performance and conversion metrics</p>
      </div>

      <div className="space-y-4">
        <AnalyticsOverview />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ConversionFunnel />
          <SourceBreakdown />
        </div>
        <ScoreTrend />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <EngagementHeatmap />
          <TopPerformers />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
