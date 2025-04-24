import { Response, Drug, DrugResponse } from "../lib/Types/response.type";
import { DrugSearchParams } from "../lib/Types/drug.types";
import { api } from "./base.api";

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

export const getMyDrugsPaginated = async (params?: {
  page?: number;
  limit?: number;
}): Promise<DrugResponse> => {
  try {
    const response = await api.get<DrugResponse>("/drugs/me", {
      params,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to fetch drugs",
      data: {
        data: [] as Drug[],
        pagination: {
          hasMore: false,
          hasPrev: false,
          totalItems: 0,
          totalPages: 0,
          page: 1,
          limit: 10,
        },
      },
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};
export const getAllMyDrugs = async (): Promise<Response<Drug[]>> => {
  try {
    const response = await api.get<Response<Drug[]>>("/drugs/me?all=true");
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

export const searchDrugs = async (
  params: DrugSearchParams
): Promise<DrugResponse> => {
  try {
    const response = await api.get<DrugResponse>("/drugs/search", {
      params,
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to search drugs",
      data: {
        data: [] as any[],
        pagination: {
          hasMore: false,
          hasPrev: false,
          totalItems: 0,
          totalPages: 0,
          page: 1,
          limit: 10,
        },
      },
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};

export const getAllDrugs = async (params?: {
  illnessId?: string;
  minStocks?: number;
  maxStocks?: number;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Response<Drug[]>> => {
  try {
    const response = await api.get<Response<Drug[]>>("/drugs", {
      params,
    });
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
