import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { assignBadge, revokeBadge } from "../api/badges";
import { BADGES_QUERY_KEY } from "./use-badges-queries";
import type { AssignBadgeRequest } from "../types";

export function useAssignBadge() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (dto: AssignBadgeRequest) => assignBadge(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY });
      toast({
        title: "Verified badge assigned",
        description: "The badge assignment is now active.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Unable to assign badge",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
}

export function useRevokeBadge() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: revokeBadge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BADGES_QUERY_KEY });
      toast({
        title: "Verified badge revoked",
        description: "The badge is no longer active.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Unable to revoke badge",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
}