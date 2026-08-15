import { Link } from "react-router-dom";

import { useProblems } from "../hooks/useProblems";

export default function ProblemList() {
  const {
    data: problems,
    isLoading,
    isError,
  } = useProblems();

  if (isLoading) {
    return (
      <div className="text-white p-8">
        Loading problems..
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-400 p-8">
        Failed to load problems.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Problems
        </h1>

        <div className="bg-slate-800 rounded-lg overflow-hidden">

          {problems?.map((problem) => (
            <Link
              key={problem.id}
              to={`/problems/${problem.slug}`}
              className="
                flex
                items-center
                justify-between
                px-6
                py-4
                border-b
                border-slate-700
                hover:bg-slate-700
                "
            >

              <span>
                {problem.id}. {problem.title}
              </span>
              <span
                className={
                  problem.difficulty === "Easy"
                    ? "text-green-400"
                    : problem.difficulty === "Medium"
                      ? "text-yellow-400"
                      : "text-red-400"
                }
              >
                {problem.difficulty}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}