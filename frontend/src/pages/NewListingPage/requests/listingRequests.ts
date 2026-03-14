import { POST, GenericResponse } from "../../../utils/api";

const createListing = (data: FormData) =>
  POST<GenericResponse>("/property-listings/create/", data);

export default createListing;
