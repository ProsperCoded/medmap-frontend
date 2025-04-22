export type Response<T> = {
  status: "success" | "error";
  message: string;
  data: T;
  error?: {
    cause: string;
    statusCode: number;
  };
};

export interface Auth {
  user: UserProfile;
  token: string;
}

export interface PharmacyLogin {
  message: string;
  data: {
    pharmacy: {
      id: string;
      name: string;
      email: string;
      description: string;
      logoUrl: string;
      shopImageUrl: string;
      createdAt: string;
      updatedAt: string;
      contactInfo: {
        id: string;
        address: string;
        phone: string;
        state: string;
        country: string;
        longitude: number;
        latitude: number;
        pharmacyId: string;
      };
    };
    token: string;
  };
}

export interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface PharmacyProfile {
  id: string;
  name: string;
  email: string;
  description: string;
  logoUrl: string;
  shopImageUrl: string;
  createdAt: string;
  updatedAt: string;
  contactInfo: {
    id: string;
    address: string;
    phone: string;
    state: string;
    country: string;
    longitude: number;
    latitude: number;
    pharmacyId: string;
  };
}

export interface Drug {
  id: string;
  name: string;
  description?: string;
  composition?: string;
  manufacturer?: string;
  uses?: string[];
  sideEffects: string[];
  pharmacyId: string;
  expiryDate: string;
  imageUrl: string;
  price: number;
  stocks: number;
  pharmacy: {
    id: string;
    name: string;
    email: string;
    description: string;
    logoUrl: string;
    shopImageUrl: string;
    createdAt: string;
    updatedAt: string;
    contactInfo: {
      id: string;
      address: string;
      phone: string;
      state: string;
      country: string;
      longitude: number;
      latitude: number;
      pharmacyId: string;
    };
  };
  illnessDrugs?: {
    illnessId: string;
    illness: Illness;
  }[];
}
export interface Illness {
  id: string;
  name: string;
  description: string;
  precautions: string[];
}
export interface DrugResponse {
  message: string;
  data: {
    data: Drug[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
