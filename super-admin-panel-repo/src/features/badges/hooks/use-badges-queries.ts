import { useQuery } from "@tanstack/react-query";
import { getBadges } from "../api/badges";

export const BADGES_QUERY_KEY = ["admin", "badges"] as const;

export function useBadgesList() {
  return useQuery({
    queryKey: BADGES_QUERY_KEY,
    queryFn: getBadges,
  });
}