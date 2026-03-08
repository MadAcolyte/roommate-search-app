import { GenericResponse } from "../../../utils/api";
import { ListingFormData } from "../types/listingTypes";

const createListing = (_data: ListingFormData): Promise<GenericResponse> =>
  Promise.resolve({
    success: true,
    message: "Listing created (stubbed)",
  });

export default createListing;
