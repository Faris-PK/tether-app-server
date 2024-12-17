export interface CreateProductDTO {
    userId: string;
    title: string;
    price: number;
    category: string;
    location: {
        name: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    description: string;
    isApproved?: boolean;
    isBlocked?: boolean;
}
