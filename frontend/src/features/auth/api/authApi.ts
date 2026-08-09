import api from "../../../shared/lib/api";

import type { LoginFormData } from "../schemas/loginSchema";
import type { RegisterFormData } from "../schemas/registerSchema";

type LoginResponse = {
  access_token:string,
  token_type:string
}

export const registerUser = async(data:RegisterFormData)=>{
  const response = await api.post("/auth/register",{
    username:data.username,
    email:data.email,
    password:data.password,
  });

  return response.data;
}


export const loginUser = async(data:LoginFormData):Promise<LoginResponse> =>{
  const response = await api.post("/auth/login",data);
  return response.data;
}