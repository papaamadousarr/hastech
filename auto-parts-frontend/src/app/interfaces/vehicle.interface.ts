export interface VehicleDetail {
  brand: string;
  model_name?: string;
  model_variant?: string;
  Engine_types?: string;
  image_url: string;
  years?: string;
}

// Nouvelles interfaces pour les APIs MongoDB
export interface VehicleBrand {
  _id: string;
  name: string;
  slug: string;
  imageURL: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleModel {
  _id: string;
  brandId: string;
  name: string;
  slug: string;
  imageURL: string;
  yearRange?: string; // Ajout de la propriété manquante
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleVariant {
  _id: string;
  modelId: string;
  name: string;
  slug: string;
  imageURL: string;
  code?: string; // Ajout de la propriété manquante
  yearRange?: string; // Ajout de la propriété manquante
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleEngine {
  _id: string;
  variantId: string;
  name: string;
  slug: string;
  power: string;
  fuelType: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
} 