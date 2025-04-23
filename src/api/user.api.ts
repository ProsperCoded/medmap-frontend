import { Response, UserProfile } from "../lib/Types/response.type";
import { api } from "./base.api";

export const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await api.get<Response<UserProfile>>("/user/profile");

    if (response.data.status === "success") {
      return response.data.data;
    }

    console.log(response);
    return null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
