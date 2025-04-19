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
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
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
  message: string;
  data: {
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
}
