import { useMutation } from "@tanstack/react-query";

import { runCode } from "../api/problemApi";
import type { Language } from "../pages/ProblemDetails";

export function useRun() {
  return useMutation({
    mutationFn: ({
      problemId,
      language,
      code,
      input,
    }: {
      problemId: number;
      language: Language;
      code: string;
      input: string;
    }) =>
      runCode(
        problemId,
        language,
        code,
        input
      ),
  });
}