import { Routes, Route } from "react-router-dom";

// Pages
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/dashboard/pages/Dashboard";
import ProblemList from "../features/problems/pages/ProblemList";
import ProblemDetails from "../features/problems/pages/ProblemDetails";

export default function AppRouter(){
  return (
    <Routes>
      <Route path="/" element={
        
        <Dashboard />
      } />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}/>
      <Route path="/problems" element={<ProblemList />} />
      <Route path="/problems/:slug" element={<ProblemDetails />} />
    </Routes>
  )
}