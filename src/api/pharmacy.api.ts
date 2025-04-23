import {
  Response,
  UserProfile,
  PharmacyProfile,
} from "../lib/Types/response.type";
import { api } from "./base.api";

export const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const response = await api.get<Response<UserProfile>>("/user/profile");

    return response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};
export const fetchPharmacies = async (): Promise<
  Response<PharmacyProfile[]>
> => {
  try {
    const response = await api.get<Response<PharmacyProfile[]>>("/pharmacy");
    return response.data;
  } catch (error) {
    console.error("Error fetching pharmacies:", error);
    return {
      status: "error",
      message: "Failed to fetch pharmacies",
      data: [],
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
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

export const updatePharmacyProfile = async (
  id: string,
  formData: FormData
): Promise<Response<PharmacyProfile>> => {
  try {
    const response = await api.put<Response<PharmacyProfile>>(
      `/pharmacy/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to update profile",
      data: {} as PharmacyProfile,
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};
