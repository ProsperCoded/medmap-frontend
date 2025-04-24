import {
  DrugResponse,
  PharmacyListResponse,
  Response,
} from "../lib/Types/response.type";
import { api } from "./base.api";

interface SearchParams {
  page?: number;
  limit?: number;
  name?: string;
  illnessId?: string;
  minStocks?: number;
  maxStocks?: number;
  minPrice?: number;
  maxPrice?: number;
}

export const getMed = async (med: SearchParams) => {
  try {
    const response = await api.get<Response<DrugResponse>>(`/drugs/search`, {
      params: {
        page: med.page,
        limit: med.limit,
        name: med.name,
        illnessId: med.illnessId,
        minStocks: med.minStocks,
        maxStocks: med.maxStocks,
        minPrice: med.minPrice,
        maxPrice: med.maxPrice,
      },
    });
    console.log(response);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching medications:", error);
    throw new Error(error.response.data.message);
  }
};

export const getAllPharmacies = async () => {
  try {
    const response = await api.get<Response<PharmacyListResponse>>(`/pharmacy`);
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error fetching pharmacies:", error);
    return error;
  }
};
