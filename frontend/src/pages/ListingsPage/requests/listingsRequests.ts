import { GET, GenericResponseWithPayload } from "../../../utils/api";
import { PropertyListing } from "../types/listingTypes";

export const getPropertyListings = () =>
  GET<GenericResponseWithPayload<PropertyListing[]>>("/property-listings/");

export const getPropertyListingById = (id: string) =>
  GET<GenericResponseWithPayload<PropertyListing>>(
    `listings/property-listings/${id}/`,
  );
