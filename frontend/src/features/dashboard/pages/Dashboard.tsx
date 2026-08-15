import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import { removeToken } from "../../auth/utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    data: user,
    isLoading,
    isError
  } = useCurrentUser();

  // navigate("/login") was called directly inside the render body (line 31). React forbids side effects during rendering — navigate() is a side effect and must live inside useEffect.
  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      navigate("/login");
    }
  }, [isLoading, isError, user, navigate]);

  const handleLogout = () => {
    removeToken();
    toast.success("Logged out successfully");
    navigate("/login");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center">

          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user.username} 👋
            </h1>

            <p className="text-gray-400 mt-2">
              {user.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}