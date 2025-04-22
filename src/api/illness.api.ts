import { ApiResponse } from "./base.api";
import { axiosInstance } from "./base.api";
import {
  Illness,
  IllnessSearchParams,
  IllnessSearchResponse,
  CreateIllnessDTO,
  UpdateIllnessDTO,
} from "../lib/Types/illness.types";

export const illnessApi = {
  async searchIllnesses(
    params: IllnessSearchParams
  ): Promise<ApiResponse<IllnessSearchResponse>> {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.query) queryParams.append("query", params.query);

    const response = await axiosInstance.get(
      `/illnesses/search?${queryParams.toString()}`
    );
    return response.data;
  },

  async getAllIllnesses(): Promise<ApiResponse<Illness[]>> {
    const response = await axiosInstance.get("/illnesses");
    return response.data;
  },

  async getIllnessById(id: string): Promise<ApiResponse<Illness>> {
    const response = await axiosInstance.get(`/illnesses/${id}`);
    return response.data;
  },

  async createIllness(data: CreateIllnessDTO): Promise<ApiResponse<Illness>> {
    const response = await axiosInstance.post("/illnesses", data);
    return response.data;
  },

  async updateIllness(
    id: string,
    data: UpdateIllnessDTO
  ): Promise<ApiResponse<Illness>> {
    const response = await axiosInstance.put(`/illnesses/${id}`, data);
    return response.data;
  },

  async deleteIllness(id: string): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(`/illnesses/${id}`);
    return response.data;
  },

  async linkDrugToIllness(
    illnessId: string,
    drugId: string
  ): Promise<ApiResponse<void>> {
    const response = await axiosInstance.post(
      `/illnesses/${illnessId}/drugs/${drugId}`
    );
    return response.data;
  },

  async unlinkDrugFromIllness(
    illnessId: string,
    drugId: string
  ): Promise<ApiResponse<void>> {
    const response = await axiosInstance.delete(
      `/illnesses/${illnessId}/drugs/${drugId}`
    );
    return response.data;
  },
};
