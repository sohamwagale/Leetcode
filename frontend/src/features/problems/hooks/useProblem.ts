import { useQuery } from "@tanstack/react-query";
import { getProblem } from "../api/problemApi";

export function useProblem(slug:string){
  return useQuery({
    queryKey:["problem",slug],
    queryFn:()=>getProblem(slug!),
    enabled:!!slug
  })
}