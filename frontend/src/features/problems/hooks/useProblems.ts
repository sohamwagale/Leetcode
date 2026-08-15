import { useQuery } from "@tanstack/react-query";

import { getProblems } from "../api/problemApi";

export function useProblems(){
  return useQuery({
    queryKey:["problems"],
    queryFn:getProblems,
  });
}