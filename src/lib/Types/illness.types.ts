import { Drug } from "./drug.types";

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

export interface PaginationInfo {
  hasMore: boolean;
  hasPrev: boolean;
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
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
