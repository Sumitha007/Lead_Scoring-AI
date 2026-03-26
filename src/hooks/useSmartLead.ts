import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { smartLeadApi } from "@/lib/api";
import type { InteractionPayload, LeadCreatePayload, Priority } from "@/types/smartlead";

export const smartLeadKeys = {
  leads: ["smartlead", "leads"] as const,
  lead: (leadId: string) => ["smartlead", "lead", leadId] as const,
  interactions: (leadId: string) => ["smartlead", "interactions", leadId] as const,
  score: (leadId: string) => ["smartlead", "score", leadId] as const,
  analytics: ["smartlead", "analytics"] as const,
};

export function useLeads(priority?: Priority) {
  return useQuery({
    queryKey: [...smartLeadKeys.leads, priority],
    queryFn: () => smartLeadApi.getLeads(priority),
  });
}

export function useLead(leadId?: string) {
  return useQuery({
    queryKey: leadId ? smartLeadKeys.lead(leadId) : ["smartlead", "lead", "none"],
    queryFn: () => smartLeadApi.getLeadById(leadId as string),
    enabled: Boolean(leadId),
  });
}

export function useInteractions(leadId?: string) {
  return useQuery({
    queryKey: leadId ? smartLeadKeys.interactions(leadId) : ["smartlead", "interactions", "none"],
    queryFn: () => smartLeadApi.getInteractions(leadId as string),
    enabled: Boolean(leadId),
  });
}

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: smartLeadKeys.analytics,
    queryFn: smartLeadApi.getAnalyticsSummary,
  });
}

export function useAddLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LeadCreatePayload) => smartLeadApi.addLead(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: smartLeadKeys.leads });
      queryClient.invalidateQueries({ queryKey: smartLeadKeys.analytics });
    },
  });
}

export function useAddInteraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, payload }: { leadId: string; payload: InteractionPayload }) =>
      smartLeadApi.addInteraction(leadId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: smartLeadKeys.leads });
      queryClient.invalidateQueries({ queryKey: smartLeadKeys.lead(variables.leadId) });
      queryClient.invalidateQueries({ queryKey: smartLeadKeys.interactions(variables.leadId) });
      queryClient.invalidateQueries({ queryKey: smartLeadKeys.score(variables.leadId) });
      queryClient.invalidateQueries({ queryKey: smartLeadKeys.analytics });
    },
  });
}

export function useGenerateScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (leadId: string) => smartLeadApi.generateScore(leadId),
    onSuccess: (_data, leadId) => {
      queryClient.invalidateQueries({ queryKey: smartLeadKeys.lead(leadId) });
      queryClient.invalidateQueries({ queryKey: smartLeadKeys.leads });
      queryClient.invalidateQueries({ queryKey: smartLeadKeys.score(leadId) });
      queryClient.invalidateQueries({ queryKey: smartLeadKeys.analytics });
    },
  });
}
