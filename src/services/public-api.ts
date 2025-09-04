export interface PromotionExtra {
  name: string;
  Aplicacion: string;
}
export interface Promotion {
  id: number;
  code: string;
  name: string;
  is_promotion: boolean;
  total: number;
  extras: PromotionExtra[];
}
export interface PromotionDetail {
  id: number;
  name: string;
  total: number;
  link_type: string;
  sharing_level: string;
  connection_type: string;
  "speed:_upload": string;
  speed_type_up: string;
  "speed:_download": string;
  speed_type_down: string;
  extras: PromotionDetailExtra[];
}
export interface PromotionDetailExtra {
  name: string;
  apply_method: string;
  months_discount: number;
  discount: number;
  price_unit: number;
}
export interface ApiResponse {
  jsonrpc: string;
  id: null;
  result: {
    status: string;
    count: number;
    data: Promotion[];
  };
}
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.70.123:8069";
export const getPromotions = async (): Promise<Promotion[]> => {
  const response = await fetch(`${API_URL}/app/promotions`, {
    method: "GET",
    headers: {},
  });
  if (!response.ok) {
    throw new Error(`Network error: ${response.statusText}`);
  }
  const data = await response.json();
  if (data.status !== "success") {
    throw new Error("API returned an error");
  }
  return data.data;
};
export const getPromotionById = async (
  id: number
): Promise<PromotionDetail> => {
  const response = await fetch(`${API_URL}/app/promotion/${id}`, {
    method: "GET",
    headers: {},
  });
  if (!response.ok) {
    throw new Error(`Network error: ${response.statusText}`);
  }
  const data = await response.json();
  if (data.status !== "success") {
    throw new Error("API returned an error");
  }
    return data.data[0];
};

// New interfaces and functions for agencies
export interface AgencyData {
    id: number;
    name: string;
    phone: string | boolean;
    email: string | boolean;
    website: string | boolean;
    schedule: string;
    days_schedule: {
        dia: string;
        start_time: number;
        end_time: number;
    }[];
    longitude: number;
    latitude: number;
    address: string | boolean;
    id_img: number | boolean;
    city: string;
}

export interface AgenciesApiResponse {
    status: string;
    count: number;
    data: AgencyData[];
}

export const getAgencies = async (): Promise<AgencyData[]> => {
    const response = await fetch(`${API_URL}/app/agencies`, {
        method: "GET",
        headers: {},
    });
    if (!response.ok) {
        throw new Error(`Network error: ${response.statusText}`);
    }
    const data: AgenciesApiResponse = await response.json();
    if (data.status !== "success") {
        throw new Error("API returned an error");
    }
    
    return data.data;
};

export const getImageLink = (fileId: number): string => {
    return `${API_URL}/app/img_link/${fileId}`;
};
