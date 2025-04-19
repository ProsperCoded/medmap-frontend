import { api } from "../base.api";
import type { Response, Auth } from "../../lib/Types/response.type"; // adjust import as needed

export type SignUpProps = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type LoginProps = {
  email: string;
  password: string;
};

export const userSignUp = async (
  data: SignUpProps
): Promise<Response<Auth>> => {
  try {
    const response = await api.post<Response<Auth>>("/auth/user/signup", data);
    console.log(response);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as Response<Auth>;
    }

    console.log(error);

    // Return a fallback error structure
    return {
      status: "error",
      message: "Signup failed. Please try again.",
      data: {} as Auth,
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};

export const userLogin = async (data: LoginProps): Promise<Response<Auth>> => {
  try {
    console.log(data);
    const response = await api.post<Response<Auth>>("/auth/user/login", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as Response<Auth>;
    }

    // Return a fallback error structure
    return {
      status: "error",
      message: "Signup failed. Please try again.",
      data: {} as Auth,
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};
