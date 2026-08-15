import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "../schemas/registerSchema"; 
import type { RegisterFormData } from "../schemas/registerSchema";

import Button from "../../../shared/components/Button";
import Input from "../../../shared/components/Input";
import { useRegister } from "../hooks/useRegister";

import {toast} from "sonner";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const navigate = useNavigate();

  const {//TBD
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const registerMutation = useRegister();

  const onSubmit = async (data: RegisterFormData) => {

    registerMutation.mutate(data,{
      onSuccess:()=>{
        toast.success("Registration succesfull");
        navigate("/login");
      },
      onError:(error:unknown)=>{
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.detail ?? "Something went wrong"
          );
        } else {
          toast.error("Something went wrong");
        }
      }
    })



    // console.log(data);
    // try {
    //   const response = await registerUser(data);
    //   console.log(response);
    //   toast.success("Registration succesfull");
    // } catch (error: unknown) {
    //   // console.error(error);
    //   if (axios.isAxiosError(error)) {
    //     toast.error(
    //       error.response?.data?.detail ?? "Something went wrong"
    //     );
    //   } else {
    //     toast.error("Something went wrong");
    //   }
    // }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center">
          BeatCode 
        </h1>

        <p className="text-gray-400 text-center mt-2">
          Create your account
        </p>

        <form 
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
        >
          <Input
            label="Username"
            placeholder="Enter username"
            error={errors.username?.message}
            {...register("username")}
          />
          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          
          <Button 
            type="submit"
            disabled={isSubmitting}
          >
            Create Account
          </Button>

        </form>
      </div>
    </div>
  )
}