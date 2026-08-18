import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubmission } from "../api/problemApi";

export function useSubmit() {
  const queryClient = useQueryClient();

  return useMutation({ // You're taking TanStack Query's one variable and unpacking it into the three arguments your API function needs.
    mutationFn: ({
      problemId,
      language,
      code,
    }: {
      problemId: number;
      language: string;
      code: string;
    }) => createSubmission(
      problemId,
      language,
      code
    ),
    // TBD
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "submissions",
          "problem",
          variables.problemId,
        ],
      });
    },
  });
}