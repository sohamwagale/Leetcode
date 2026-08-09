import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";

import {
  loginSchema,
  type LoginFormData,
} from "../schemas/loginSchema";

import { useLogin } from "../hooks/useLogin";
import { setToken } from "../utils/auth";

export default function Login() {
  const loginMutation = useLogin();
  const navigate = useNavigate()

  const {//TBD
    register, //React Hook Form then attaches the necessary handlers and references to that input.
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })


  const onSubmit = async (data: LoginFormData) => { //The data argument contains the validated form data.
    // Used to call the login API with the data
    loginMutation.mutate(data, { // You're giving TanStack Query the validated form data:
      onSuccess: (response) => { //This callback runs if the API request succeeds.
        setToken(response.access_token);
        toast.success("Registration succesfull");
        navigate("/")
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-white text-center">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mt-2">
          Login to your account
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)} //Used so that onSubmit doesn't get called blindly. It only gets called if validation succeeds.
          className="mt-8 space-y-5"
        >
          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            error={errors.email?.message}
            {...register("email")} //This input represents the email field."
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending
              ? "Logging in..."
              : "Login"}
          </Button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-orange-500 hover:text-orange-400"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}