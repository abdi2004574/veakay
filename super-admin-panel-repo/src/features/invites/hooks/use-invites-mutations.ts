import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { acceptInvite, createInvite, revokeInvite } from "../api/invites";
import { INVITES_QUERY_KEY } from "./use-invites-queries";
import type {
  CreateAdminInviteInput,
  CreateInviteMutationResult,
} from "../types";

export function useCreateInviteMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<CreateInviteMutationResult, Error, CreateAdminInviteInput>({
    mutationFn: async (input) => {
      const response = await createInvite(input);
      return {
        invite: response.data.invite,
        acceptUrl: response.data.acceptUrl,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITES_QUERY_KEY });
      toast({
        title: "Invite created",
        description: "The invitation email has been sent.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Unable to create invite",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useRevokeInviteMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: revokeInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITES_QUERY_KEY });
      toast({
        title: "Invite revoked",
        description: "The invitation can no longer be accepted.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Unable to revoke invite",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useAcceptInviteMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVITES_QUERY_KEY });
      toast({
        title: "Invite accepted",
        description: "Super admin access has been granted.",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Unable to accept invite",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}