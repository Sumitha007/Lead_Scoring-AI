import type {
  AnalyticsSummaryDto,
  InteractionDto,
  InteractionPayload,
  LoginPayload,
  LeadCreatePayload,
  LeadDto,
  MeResponse,
  Priority,
  RegisterPayload,
  ScoreDto,
  TokenResponse,
} from "@/types/smartlead";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

function getAuthHeaders() {
  const savedToken = localStorage.getItem("smartlead_token");
  return {
    "Content-Type": "application/json",
    ...(savedToken ? { Authorization: `Bearer ${savedToken}` } : {}),
  };
}

async function request<T>(path: string, options?: RequestInit, authenticated = true): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authenticated ? getAuthHeaders() : {}),
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const smartLeadApi = {
  login: (payload: LoginPayload) => request<TokenResponse>("/auth/login", { method: "POST", body: JSON.stringify(payload) }, false),
  register: (payload: RegisterPayload) =>
    request<TokenResponse>("/auth/register", { method: "POST", body: JSON.stringify(payload) }, false),
  me: () => request<MeResponse>("/auth/me"),
  getLeads: (priority?: Priority) => request<LeadDto[]>(`/leads${priority ? `?priority=${priority}` : ""}`),
  getLeadById: (leadId: string) => request<LeadDto>(`/leads/${leadId}`),
  addLead: (payload: LeadCreatePayload) => request<LeadDto>("/leads", { method: "POST", body: JSON.stringify(payload) }),
  addInteraction: (leadId: string, payload: InteractionPayload) =>
    request<InteractionDto>(`/leads/${leadId}/interactions`, { method: "POST", body: JSON.stringify(payload) }),
  getInteractions: (leadId: string) => request<InteractionDto[]>(`/leads/${leadId}/interactions`),
  generateScore: (leadId: string) => request<ScoreDto>(`/leads/${leadId}/score`, { method: "POST" }),
  getRecommendation: (leadId: string) => request<ScoreDto>(`/leads/${leadId}/score`, { method: "POST" }),
  getAnalyticsSummary: () => request<AnalyticsSummaryDto>("/analytics/summary"),
};
