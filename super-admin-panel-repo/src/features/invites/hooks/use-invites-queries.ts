import { useQuery } from "@tanstack/react-query";
import { getInvites } from "../api/invites";

export const INVITES_QUERY_KEY = ["admin", "invites"] as const;

export function useInvitesQuery() {
  return useQuery({
    queryKey: INVITES_QUERY_KEY,
    queryFn: getInvites,
  });
}
