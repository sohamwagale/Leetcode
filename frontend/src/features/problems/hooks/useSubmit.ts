import { useMutation } from "@tanstack/react-query";
import { createSubmission } from "../api/problemApi";

export function useSubmit(){
  return useMutation({ // You're taking TanStack Query's one variable and unpacking it into the three arguments your API function needs.
    mutationFn:({
      problemId,
      language,
      code,
    }:{
      problemId:number;
      language:string;
      code:string;
    }) => createSubmission(
      problemId,
      language,
      code
    ),

  });
}