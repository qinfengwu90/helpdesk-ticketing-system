import {createClient} from "@/utilities/supabase/client";


export const saltAndHashPassword = (password: string, salt: string, hash:string): string => {
  return password;
}

export const getUserFromDb = async (email: string): Promise<{ salt: string, hash: string }> => {
  const {data, error} = await createClient()
    .from("admins")
    .select("salt, hash")
    .eq("email", email)
    .limit(1)
    .single();

  if (error) {
    throw new Error("Fail to get user");
  }

  return {salt: data?.salt, hash: data?.hash};
}