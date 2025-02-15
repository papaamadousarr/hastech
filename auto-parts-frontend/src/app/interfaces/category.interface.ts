export interface Category {
    id: string;
    name: string;
    icon: string;
    subcategories?: Subcategory[];
  }
  
  export interface Subcategory {
    id: string;
    name: string;
    icon?: string;
    url: string;
  }