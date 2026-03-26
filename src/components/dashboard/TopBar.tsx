import { Bell, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

const TopBar = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("smartlead_email") || "Anonymous";
  const role = (localStorage.getItem("smartlead_role") || "employee").toLowerCase();

  const onLogout = () => {
    localStorage.removeItem("smartlead_token");
    localStorage.removeItem("smartlead_email");
    localStorage.removeItem("smartlead_role");
    navigate("/auth");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="h-8 w-64 rounded-md border border-input bg-background pl-8 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-lead-drop" />
        </button>
        <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {email.slice(0, 2).toUpperCase()}
          </div>
          <span className="hidden font-medium sm:inline">{role === "admin" ? "Admin" : "Employee"}</span>
        </button>
        <button
          onClick={onLogout}
          className="rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopBar;
