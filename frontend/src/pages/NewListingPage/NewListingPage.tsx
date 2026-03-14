import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../../components/FormInput/FormInput";
import { Container } from "../../components/Container/Container";
import Button from "../../components/CustomButtons/CustomButtons";
import { StyledForm } from "../../components/FormComponents/FormCompoents";
import { ListingFormData } from "./types/listingTypes";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/authUtils";

const NewListingPage = (): JSX.Element => {
  const form = useForm<ListingFormData>({
    defaultValues: {
      gender_preference: "ALL",
    },
  });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = getToken();
      return axios.post("/api/property-listings/create/", formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
    },
  });

  const onSubmit = (data: ListingFormData) => {
    const formData = new FormData();

    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("area", data.area.toString());
    formData.append("roommates_count", data.roommates_count.toString());
    formData.append(
      "roommates_looking_for_number",
      data.roommates_looking_for_number.toString(),
    );
    formData.append("total_rooms", data.total_rooms.toString());
    formData.append("gender_preference", data.gender_preference);
    formData.append("smoking", data.smoking.toString());
    formData.append("pets", data.pets.toString());
    formData.append("visibility", "true");

    const files = Array.from(data.images);
    for (const file of files) {
      formData.append("images", file);
    }

    mutation.mutate(formData, {
      onSuccess: (response) => {
        toast.success("Listing created successfully");
        navigate("/home");
      },
      onError: (error: any) => {
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to create listing";
        toast.error(message);
      },
    });
  };

  return (
    <Container
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      width="100%"
      padding="2rem 0"
    >
      <FormProvider {...form}>
        <StyledForm onSubmit={form.handleSubmit(onSubmit)}>
          <Container
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            width="100%"
            maxWidth="800px"
            gap="1rem"
            minHeight="auto"
          >
            <h1>New Listing</h1>
            <Container
              width="100%"
              flexDirection="row"
              flexWrap="wrap"
              gap="1rem"
            >
              <FormInput
                name="address"
                label="Address"
                type="text"
                placeholder="123 Main St, Apt 4B"
                rules={{ required: "Address is required" }}
                width="48%"
              />
              <FormInput
                name="city"
                label="City"
                type="text"
                placeholder="New York"
                rules={{ required: "City is required" }}
                width="48%"
              />
              <FormInput
                name="price"
                label="Price"
                type="number"
                placeholder="400"
                rules={{ required: "Price is required" }}
                width="48%"
              />
              <FormInput
                name="area"
                label="Area (sq ft)"
                type="number"
                placeholder="800"
                rules={{ required: "Area is required" }}
                width="48%"
              />
              <FormInput
                name="roommates_count"
                label="Current roommates count"
                type="number"
                placeholder="2"
                rules={{ required: "Roommates count is required" }}
                width="48%"
              />
              <FormInput
                name="roommates_looking_for_number"
                label="Roommates looking for"
                type="number"
                placeholder="1"
                rules={{
                  required:
                    "Must specify how many roommates you're looking for",
                }}
                width="48%"
              />
              <FormInput
                name="total_rooms"
                label="Total rooms"
                type="number"
                placeholder="3"
                rules={{ required: "Total rooms is required" }}
                width="48%"
              />
            </Container>
            <FormInput
              name="description"
              label="Description"
              type="textarea"
              placeholder="A little about the place..."
              rules={{ required: "Description is required" }}
            />
            <Container width="100%" flexDirection="column" gap="0.5rem">
              <label>
                Images (select multiple):
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  {...form.register("images", {
                    required: "At least one image is required",
                  })}
                />
              </label>
              <label>
                Gender preference:
                <select {...form.register("gender_preference")}>
                  <option value="ALL">All</option>
                  <option value="GIRLS">Girls</option>
                  <option value="BOYS">Boys</option>
                </select>
              </label>
              <label>
                <input type="checkbox" {...form.register("pets")} /> Pet
                friendly
              </label>
              <label>
                <input type="checkbox" {...form.register("smoking")} /> Smoking
                friendly
              </label>
            </Container>
            <Button type="submit" color="primary" disabled={mutation.isPending}>
              {mutation.isPending ? "Creating..." : "Create Listing"}
            </Button>
          </Container>
        </StyledForm>
      </FormProvider>
    </Container>
  );
};

export default NewListingPage;
