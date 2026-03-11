export interface ListingImage {
  id: string;
  imageUrl: string;
  createdAt: string;
}

export interface PropertyListing {
  id: string;
  ownerId: number;
  price: string;
  address: string;
  city: string;
  description: string;
  area: string;
  roommatesCount: number;
  roommatesLookingForNumber: number;
  totalRooms: number;
  genderPreference: "GIRLS" | "BOYS" | "ALL";
  smoking: boolean;
  pets: boolean;
  visibility: boolean;
  createdAt: string;
  updatedAt: string;
  images: ListingImage[];
}

export interface ListingsResponse {
  success: boolean;
  data: PropertyListing[];
  message: string;
}
