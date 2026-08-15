import api from "../../../shared/lib/api";

import type { LoginFormData } from "../schemas/loginSchema";
import type { RegisterFormData } from "../schemas/registerSchema";

// Types
export type LoginResponse = {
  access_token:string,
  token_type:string
}
export type CurrentUser = {
  id:number,
  username:string,
  email:string,
}


// APIs
export const registerUser = async(data:RegisterFormData)=>{
  const response = await api.post("/auth/register",{
    username:data.username,
    email:data.email,
    password:data.password,
  });
  return response.data;
}

export const loginUser = async(data:LoginFormData):Promise<LoginResponse> =>{
  // console.log(data);
  const formData = new URLSearchParams();
  formData.append("username",data.email);
  formData.append("password",data.password);
  // console.log(formData);

  const response = await api.post("/auth/login", formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return response.data;
}


export const getCurrentUser = async(): Promise<CurrentUser> =>{
  const response = await api.get("/auth/me");
  return response.data;
}