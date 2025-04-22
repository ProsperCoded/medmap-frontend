import { Response, Drug } from "../../lib/Types/response.type";
import { api } from "../base.api";

interface DrugFormData {
  name: string;
  description?: string;
  sideEffects: string[];
  expiryDate: Date;
  price: number;
  stocks?: number;
  composition?: string;
  manufacturer?: string;
  uses?: string;
  illnessIds?: string[];
  image?: File;
}

export const createDrug = async (
  formData: FormData
): Promise<Response<Drug>> => {
  try {
    const response = await api.post<Response<Drug>>("/drugs", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to create drug",
      data: {} as Drug,
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};

export const updateDrug = async (
  id: string,
  formData: FormData
): Promise<Response<Drug>> => {
  try {
    const response = await api.patch<Response<Drug>>(`/drugs/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to update drug",
      data: {} as Drug,
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};

export const deleteDrug = async (id: string): Promise<Response<Drug>> => {
  try {
    const response = await api.delete<Response<Drug>>(`/drugs/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to delete drug",
      data: {} as Drug,
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};

export const getMyDrugs = async (): Promise<Response<Drug[]>> => {
  try {
    const response = await api.get<Response<Drug[]>>("/drugs/me");
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to fetch drugs",
      data: [] as Drug[],
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};

export const getDrugById = async (id: string): Promise<Response<Drug>> => {
  try {
    const response = await api.get<Response<Drug>>(`/drugs/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to fetch drug",
      data: {} as Drug,
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};
