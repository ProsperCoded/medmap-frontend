import { Drug } from "./drug.types";
import { PaginationInfo } from "./response.type";

export interface Illness {
  id: string;
  name: string;
  description?: string;
  symptoms: string[][];
  precautions: string[];
  illnessDrugs?: {
    drug: Drug;
  }[];
}

export interface IllnessSearchResponse {
  data: Illness[];
  pagination: PaginationInfo;
}

export interface IllnessSearchParams {
  page?: number;
  limit?: number;
  query?: string;
}

export interface CreateIllnessDTO {
  name: string;
  description?: string;
  symptoms: string[][];
  precautions: string[];
}

export interface UpdateIllnessDTO extends Partial<CreateIllnessDTO> {}
