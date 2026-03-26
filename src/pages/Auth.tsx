import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { smartLeadApi } from "@/lib/api";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("admin@smartlead.local");
  const [password, setPassword] = useState("admin12345");
  const [role, setRole] = useState<"admin" | "employee">("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token =
        mode === "login"
          ? await smartLeadApi.login({ email, password })
          : await smartLeadApi.register({ email, password, role });

      localStorage.setItem("smartlead_token", token.access_token);
      const me = await smartLeadApi.me();
      localStorage.setItem("smartlead_role", me.role);
      localStorage.setItem("smartlead_email", me.email);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-md rounded-xl bg-card p-6 shadow-card">
        <h1 className="text-2xl font-bold text-foreground">SmartLead AI</h1>
        <p className="mt-1 text-sm text-muted-foreground">JWT authentication for Admin and Employee users</p>

        <div className="mt-4 flex gap-2 rounded-lg bg-accent p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-md px-3 py-2 text-sm ${mode === "login" ? "bg-background font-semibold" : "text-muted-foreground"}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 rounded-md px-3 py-2 text-sm ${mode === "register" ? "bg-background font-semibold" : "text-muted-foreground"}`}
          >
            Register
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              required
              minLength={8}
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "employee")}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="h-10 w-full rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
