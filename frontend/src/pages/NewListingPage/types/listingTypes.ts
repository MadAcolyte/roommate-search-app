export interface ListingFormData {
  address: string;
  description: string;
  price: number;
  city: string;
  area: number;
  roommates_count: number;
  roommates_looking_for_number: number;
  total_rooms: number;
  gender_preference: string;
  smoking: boolean;
  pets: boolean;
  images: FileList;
}
