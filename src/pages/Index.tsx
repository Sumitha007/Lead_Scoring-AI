import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KPICards from "@/components/dashboard/KPICards";
import LeadTable from "@/components/dashboard/LeadTable";
import LeadCharts from "@/components/dashboard/LeadCharts";
import LeadProfile from "@/components/dashboard/LeadProfile";
import type { Lead } from "@/data/mockData";

const Index = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  return (
    <DashboardLayout>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Omni-Channel Lead Scoring Overview</p>
      </div>

      <div className="flex gap-4">
        {/* Main content */}
        <div className={`flex-1 min-w-0 space-y-4 transition-all ${selectedLead ? "lg:mr-0" : ""}`}>
          <KPICards />
          <LeadCharts />
          <LeadTable onSelectLead={setSelectedLead} selectedLeadId={selectedLead?.id ?? null} />
        </div>

        {/* Profile Panel */}
        {selectedLead && (
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-4">
              <LeadProfile lead={selectedLead} onClose={() => setSelectedLead(null)} />
            </div>
          </div>
        )}
      </div>

      {/* Mobile profile overlay */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-foreground/40 lg:hidden" onClick={() => setSelectedLead(null)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-card" onClick={e => e.stopPropagation()}>
            <LeadProfile lead={selectedLead} onClose={() => setSelectedLead(null)} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Index;
