export interface UpdateProductDTO {
    existingImages: any;
    title?: string;
    price?: number;
    category?: string;
    location?: {
      name: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    description?: string;
  }