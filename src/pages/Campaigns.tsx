import DashboardLayout from "@/components/dashboard/DashboardLayout";

const Campaigns = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-foreground">Campaigns</h1>
        <div className="rounded-lg bg-card p-6 shadow-card">
          <h2 className="text-base font-semibold">Campaign Intelligence</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This module is ready for campaign-specific automation. For hackathon demo, focus on Leads and Analytics where
            scoring and recommendations are fully integrated.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Campaigns;
