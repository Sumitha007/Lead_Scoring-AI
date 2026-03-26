export type Priority = "high" | "medium" | "low";

export interface LeadDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  company: string | null;
  budget: number | null;
  website_visits: number;
  time_spent_minutes: number;
  click_count: number;
  score: number;
  recommendation: string;
  priority: Priority;
  created_at: string;
  updated_at: string;
}

export interface LeadCreatePayload {
  name: string;
  email: string;
  phone: string;
  category: "student" | "employed" | "business" | "freelancer" | "other";
  company?: string;
  budget?: number;
  website_visits: number;
  time_spent_minutes: number;
  click_count: number;
}

export interface InteractionPayload {
  interaction_type: "call" | "email" | "meeting";
  call_duration_minutes?: number;
  call_outcome?: "interested" | "not_interested" | "follow_up";
  email_sent?: boolean;
  email_opened?: boolean;
  email_replied?: boolean;
  meeting_scheduled?: boolean;
  meeting_completed?: boolean;
}

export interface InteractionDto {
  id: string;
  lead_id: string;
  interaction_type: "call" | "email" | "meeting";
  payload: Record<string, unknown>;
  created_by_user_id: string;
  created_at: string;
}

export interface ScoreFactor {
  feature: string;
  impact: number;
}

export interface ScoreDto {
  lead_id: string;
  score: number;
  recommendation: string;
  priority: Priority;
  top_factors: ScoreFactor[];
  summary: string;
}

export interface AnalyticsSummaryDto {
  total_leads: number;
  high_priority: number;
  medium_priority: number;
  low_priority: number;
  average_score: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  role: "admin" | "employee";
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface MeResponse {
  id: string;
  email: string;
  role: "admin" | "employee";
}
