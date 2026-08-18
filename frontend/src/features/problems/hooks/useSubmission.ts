import { useQuery } from "@tanstack/react-query";

import { getMySubmission } from "../api/problemApi";

export function useProblemSubmissions(){
  return useQuery({
    queryKey:["submissions"],
    queryFn:getMySubmission,
  });
}