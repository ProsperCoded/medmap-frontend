import {
  Response,
  UserProfile,
  PharmacyProfile,
} from "../../lib/Types/response.type";
import { api } from "../base.api";

export const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await api.get<Response<UserProfile>>("/user/profile");

    return response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

export const fetchPharmacyProfile =
  async (): Promise<PharmacyProfile | null> => {
    try {
      const response = await api.get<Response<PharmacyProfile>>(
        "/pharmacy/profile"
      );

      if (response.data.status === "success") {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error("Error fetching pharmacy profile:", error);
      return null;
    }
  };
