import { PharmacyProfile } from "./response.type";
import { Illness } from "./illness.types";
import { PaginationInfo } from "./illness.types";

export interface Drug {
  id: string;
  name: string;
  description?: string;
  sideEffects: string[];
  pharmacyId: string;
  expiryDate: string;
  imageUrl?: string;
  price: number;
  stocks: number;
  pharmacy?: PharmacyProfile;
  illnessDrugs?: {
    illness: Illness;
  }[];
}

export interface DrugSearchResponse {
  data: Drug[];
  pagination: PaginationInfo;
}

export interface DrugSearchParams {
  page?: number;
  limit?: number;
  name?: string;
  illnessId?: string;
  minStocks?: number;
  maxStocks?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateDrugDTO {
  name: string;
  description?: string;
  sideEffects: string[];
  expiryDate: string;
  price: number;
  stocks?: number;
  illnessIds: string[];
  image?: File;
}

export interface UpdateDrugDTO extends Partial<CreateDrugDTO> {}
