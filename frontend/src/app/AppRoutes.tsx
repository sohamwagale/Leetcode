import { Routes, Route } from "react-router-dom";
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register";

export default function AppRouter(){
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}