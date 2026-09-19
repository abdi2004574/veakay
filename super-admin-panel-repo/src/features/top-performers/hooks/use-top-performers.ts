import { useQuery } from "@tanstack/react-query";
import {
  getTopPerformingTravelers,
  getTopPerformingAgencies,
} from "../api/top-performers";

export function useTopPerformingTravelers() {
  return useQuery({
    queryKey: ["top-performers", "travelers"],
    queryFn: () => getTopPerformingTravelers(),
  });
}

export function useTopPerformingAgencies(limit?: number) {
  return useQuery({
    queryKey: ["top-performers", "agencies", limit],
    queryFn: () => getTopPerformingAgencies(limit),
  });
}
