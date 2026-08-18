import api from "../../../shared/lib/api";
import type { Language } from "../pages/ProblemDetails";

export type Problem = {
  id: number,
  title: string,
  slug: string,
  description: string,
  difficulty: string,
  function_name:string,
  starter_code:string|null,
  constraints: string | null,
  input_format: string | null,
  output_format: string | null,
  created_at: string;
}

export const getProblems = async (): Promise<Problem[]> => {
  const response = await api.get("/problems");
  return response.data;
}

export const getProblem = async (slug: string): Promise<Problem> => {
  const response = await api.get(`/problems/${slug}`);
  return response.data;
}

export type Submission = {
  id: number;
  problem_id: number;
  language: string;
  code: string;
  status: string;
  runtime: number | null;
  memory: number | null;
  created_at: string;
};

export const createSubmission = async (
  problemId: number,
  language: string,
  code: string
): Promise<Submission> => {
  const response = await api.post(
    "/submissions",
    {
      problem_id: problemId,
      language,
      code,
    }
  );

  return response.data;
};

export type RunResult = {
  status:string,
  output:string,
}

export const runCode = async (
  problemId: number,
  language:Language,
  code:string,
  input:string
): Promise<RunResult> => {
  const response = await api.post(
    "/run",
    {
      problem_id:problemId,
      language,
      code,
      input,
    }
  );

  return response.data
}

export const getMySubmission = async():Promise<Submission[]>=>{
  const response = await api.get("/submissions/mine");
  return response.data;
}

export const getMySubmissionByProblem = async(
  problemId:number
):Promise<Submission[]>=>{
  const response = await api.get(
    `/submissions/mine?problem_id=${problemId}`
  );

  return response.data;
}