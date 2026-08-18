import { useQuery } from "@tanstack/react-query";

import { getMySubmissionByProblem } from "../api/problemApi";

export function useProblemSubmissions(
  problemId?:number,
  options?:{
    enabled?:boolean
  }
){
  return useQuery({
    queryKey:["submissions","problem",problemId],
    queryFn:()=>getMySubmissionByProblem(problemId!),
    enabled:!!problemId && (options?.enabled ?? true),
  });
}