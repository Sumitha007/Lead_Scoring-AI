import DashboardLayout from "@/components/dashboard/DashboardLayout";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <div className="rounded-lg bg-card p-6 shadow-card">
          <h2 className="text-base font-semibold">Environment</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Set API URL in Vite env: VITE_API_BASE_URL. Configure backend JWT secret and MySQL connection in backend/.env.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
