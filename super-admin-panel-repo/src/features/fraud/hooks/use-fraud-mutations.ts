import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewFraudFlag } from "../api/fraud";
import { useToast } from "@/hooks/use-toast";
import { FRAUD_FLAGS_QUERY_KEY } from "./use-fraud-queries";
import type { FraudFlagStatus } from "../types";

export function useReviewFraudFlag() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      status,
      resolutionNote,
    }: {
      id: string;
      status: FraudFlagStatus;
      resolutionNote?: string;
    }) => reviewFraudFlag(id, status, resolutionNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FRAUD_FLAGS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [FRAUD_FLAGS_QUERY_KEY, "detail"],
        refetchType: "all",
      });
      toast({ description: "Fraud flag updated." });
    },
    onError: () => {
      toast({ description: "Failed to update fraud flag.", variant: "destructive" });
    },
  });
}
