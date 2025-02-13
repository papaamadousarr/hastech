export interface ProductMainCategory {
    id: string;
    name: string;
    imageUrl: string;
    icon: string;
    subCategories: ProductSubCategory[];
    isExpanded: boolean;
 
}
 export interface ProductSubCategory {
    id: string;
    name: string;
    parts: ProductPart[];
    isExpanded?: boolean;
 }
 export interface ProductPart {
    id: string;
    name: string;
    description?: string;
    price?: number;
    imageUrl?: string;
 }
 export interface ProductBrand {
    id: string;
    name: string;
    logoUrl: string;
 }

 export interface VehicleDetails {
   brand: string;
   model: string;
   engine: string;
   year: string;
   power: string;
 }