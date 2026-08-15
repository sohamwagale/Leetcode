import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../api/authApi";
import { getToken } from "../utils/auth";

export function useCurrentUser(){
  return useQuery({
    queryKey:["currentUser"],
    queryFn:getCurrentUser, //When you need to fetch currentUser, call getCurrentUser
    enabled:!!getToken(),//"Does getToken() return a truthy value?" ONly call if true

    retry:false //If fetching the current user fails, don't automatically retry.
  })
}