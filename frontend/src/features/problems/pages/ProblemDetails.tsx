import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useProblem } from "../hooks/useProblem";
import { useSubmit } from "../hooks/useSubmit";
import { useRun } from "../hooks/useRun"

import { toast } from "sonner";

import CodeEditor from "../components/CodeEditor";
import axios from "axios";

export type Language = "python" | "javascript" | "cpp" | "java";
export default function ProblemDetails() {
  const { slug } = useParams();
  const submitMutation = useSubmit();
  const runMutation = useRun();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("python");
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"testcase" | "result">("testcase");

  const {
    data: problem,
    isLoading,
    isError,
  } = useProblem(slug!);

  useEffect(() => {
    if (problem?.starter_code) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCode(problem.starter_code);
    }
  }, [problem, language]);


  const [testInput, setTestInput] = useState(
    "[[2,7,11,15],9]"
  );

  if (isLoading) {
    return (
      <div className="text-white p-8">
        Loading...
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="text-red-400 p-8">
        Problem not found.
      </div>
    );
  }


  const handleRun = () => {
    setActiveTab("result");
    runMutation.mutate({
      problemId: problem.id,
      language,
      code,
      input: testInput
    },
      {
        onSuccess: (result) => {
          setSubmissionStatus(`${result.status}\n\n${result.output}`);
        },
        onError: (error: unknown) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.detail ?? "Code Execution Failed"
            );
          } else {
            toast.error("Code Execution Failed");
          }
        }
      })
  }

  const handleSubmit = () => {
    setActiveTab("result");
    setSubmissionStatus(null);

    submitMutation.mutate({
      problemId: problem.id,
      language,
      code,
    },
      {
        onSuccess: (submission) => {
          setSubmissionStatus(`${submission.status}\n\nPassed all Testcases`);
          if (submission.status === "Accepted") {
            toast.success("Accepted!");
          } else {
            toast.error(submission.status);
          }
        },
        onError: (error: unknown) => {
          if (axios.isAxiosError(error)) {
            toast.error(
              error.response?.data?.detail ?? "Something went wrong"
            );
          } else {
            toast.error("Something went wrong");
          }
        }
      }
    )
  }

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">

      {/* Top Bar */}
      <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4">

        <div className="font-semibold">{problem.id}. {problem.title}</div>

        <div className="flex items-center gap-3">

          <select
            value={language}
            onChange={(event) =>
              setLanguage(event.target.value as Language)
            }
            className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>

          <button
            onClick={handleRun}
            disabled={runMutation.isPending}
            className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-50"
          >
            {runMutation.isPending ? "Running" : "Run"}
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-500"
          >
            {submitMutation.isPending
              ? "Submitting..."
              : "Submit"
            }
          </button>

        </div>
      </header>


      {/* Main Workspace */}
      <main className="flex-1 min-h-0 flex">

        {/* Problem Panel */}
        <section className="w-1/2 overflow-y-auto border-r border-slate-800 p-6">

          <h1 className="text-2xl font-bold">{problem.id}. {problem.title}</h1>
          <span className="inline-block mt-3 text-green-400 text-sm">{problem.difficulty}</span>

          <div className="mt-6 space-y-6">

            <section>
              <h2 className="font-semibold text-lg mb-2">Description</h2>
              <p className="text-slate-300 leading-7">{problem.description}</p>
            </section>

            {problem.input_format && (
              <section>
                <h2 className="font-semibold text-lg mb-2">Input</h2>
                <p className="text-slate-300">{problem.input_format}</p>
              </section>
            )}

            {problem.output_format && (
              <section>
                <h2 className="font-semibold text-lg mb-2">Output</h2>
                <p className="text-slate-300">{problem.output_format}</p>
              </section>
            )}

            {problem.constraints && (
              <section>
                <h2 className="font-semibold text-lg mb-2">Constraints</h2>
                <p className="text-slate-300 whitespace-pre-line">{problem.constraints}</p>
              </section>
            )}

          </div>

        </section>

        {/* Editor Panel */}
        <section className="w-1/2 flex flex-col">

          <div className="flex-1 min-h-0">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
            />
          </div>

          {/* Bottom Panel */}
          <div className="h-48 border-t border-slate-800 flex flex-col bg-slate-950">

            {/* Tabs Header */}
            <div className="flex items-center gap-6 border-b border-slate-800 px-4 pt-2">
              <button
                onClick={() => setActiveTab("testcase")}
                className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "testcase"
                    ? "border-green-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Testcase
              </button>

              <button
                onClick={() => setActiveTab("result")}
                className={`pb-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === "result"
                    ? "border-green-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Test Result
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 flex-1 overflow-y-auto">
              {activeTab === "testcase" ? (
                <textarea
                  value={testInput}
                  onChange={(event) => setTestInput(event.target.value)}
                  className="w-full h-28 bg-slate-900 border border-slate-700 rounded-md p-3 text-sm font-mono text-slate-200 resize-none outline-none focus:border-slate-500"
                  placeholder="Enter your testcase..."
                />
              ) : (
                <div>
                  {runMutation.isPending || submitMutation.isPending ? (
                    <div className="text-slate-400 text-sm flex items-center gap-2">
                      <span className="animate-spin inline-block">⏳</span> Executing code...
                    </div>
                  ) : submissionStatus ? (
                    <pre className="text-sm font-mono text-slate-200 bg-slate-900 p-3 rounded-md border border-slate-800 whitespace-pre-wrap">
                      {submissionStatus}
                    </pre>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Run your code to see the result.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}