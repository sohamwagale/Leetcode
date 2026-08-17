import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useProblem } from "../hooks/useProblem";
import { useSubmit } from "../hooks/useSubmit";

import { toast } from "sonner";

import CodeEditor from "../components/CodeEditor";
import axios from "axios";

export default function ProblemDetails() {
  const { slug } = useParams();
  const submitMutation = useSubmit();

  const [code, setCode] = useState("");


  type Language = "python" | "javascript" | "cpp" | "java";

  const [language, setLanguage] = useState<Language>("python");
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

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
    console.log({
      code,
      language,
      action: "run"
    })
  }


  const handleSubmit = () => {
    setSubmissionStatus(null);

    submitMutation.mutate({
      problemId: problem.id,
      language,
      code,
    },
      {
        onSuccess: (submission) => {
          setSubmissionStatus(submission.status);
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
      })
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
            className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
          >
            Run
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
          <div className="h-40 border-t border-slate-800 p-4">

            <div className="flex items-center gap-4 mb-3">

              <h2 className="font-semibold mb-3">
                Testcase
              </h2>

              <h2 className="font-semibold mb-3">
                Test Result
              </h2>
            </div>

            {submissionStatus && (
              <div className="text-lg font-semibold">
                {submissionStatus}
              </div>
            )}

            {!submissionStatus && (

              <textarea
                className="w-full h-20 bg-slate-900 border border-slate-700 rounded p-3 text-sm resize-none outline-none focus:border-slate-500"
                placeholder="Enter your testcase..."
              />
            )}


          </div>

        </section>

      </main>

    </div>
  );
}