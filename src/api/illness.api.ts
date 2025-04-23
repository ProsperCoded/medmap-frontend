import { Response } from "../lib/Types/response.type";
import {
  Illness,
  IllnessSearchResponse,
  CreateIllnessDTO,
  UpdateIllnessDTO,
} from "../lib/Types/illness.types";
import { api } from "./base.api";

export const createIllness = async (
  data: CreateIllnessDTO
): Promise<Response<Illness>> => {
  try {
    const response = await api.post<Response<Illness>>("/illnesses", data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to create illness",
      data: {} as Illness,
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};

export const getIllnessById = async (
  id: string
): Promise<Response<Illness>> => {
  try {
    const response = await api.get<Response<Illness>>(`/illnesses/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to fetch illness",
      data: {} as Illness,
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};

export const updateIllness = async (
  id: string,
  data: UpdateIllnessDTO
): Promise<Response<Illness>> => {
  try {
    const response = await api.put<Response<Illness>>(`/illnesses/${id}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to update illness",
      data: {} as Illness,
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};

export const deleteIllness = async (id: string): Promise<Response<Illness>> => {
  try {
    const response = await api.delete<Response<Illness>>(`/illnesses/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to delete illness",
      data: {} as Illness,
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};

export const linkDrugToIllness = async (
  illnessId: string,
  drugId: string
): Promise<Response<void>> => {
  try {
    const response = await api.post<Response<void>>(
      `/illnesses/${illnessId}/drugs/${drugId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to link drug to illness",
      data: undefined,
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};

export const unlinkDrugFromIllness = async (
  illnessId: string,
  drugId: string
): Promise<Response<void>> => {
  try {
    const response = await api.delete<Response<void>>(
      `/illnesses/${illnessId}/drugs/${drugId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to unlink drug from illness",
      data: undefined,
      error: {
        cause: "Unknown error",
        statusCode: 500,
      },
    };
  }
};

export const searchIllnesses = async (params: {
  page?: number;
  limit?: number;
  query?: string;
}): Promise<Response<IllnessSearchResponse>> => {
  try {
    const response = await api.get<Response<IllnessSearchResponse>>(
      "/illnesses/search",
      {
        params,
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: "error",
      message: "Failed to search illnesses",
      data: {
        data: [],
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
