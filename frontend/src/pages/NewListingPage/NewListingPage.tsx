import { FormProvider, useForm } from "react-hook-form";
import FormInput from "../../components/FormInput/FormInput";
import { Container } from "../../components/Container/Container";
import Button from "../../components/CustomButtons/CustomButtons";
import { StyledForm } from "../../components/FormComponents/FormCompoents";
import { ListingFormData } from "./types/listingTypes";
import { useMutation } from "@tanstack/react-query";
import createListing from "./requests/listingRequests";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const NewListingPage = (): JSX.Element => {
  const form = useForm<ListingFormData>();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createListing,
  });

  const onSubmit = (data: ListingFormData) => {
    mutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success("Listing created successfully");
          navigate("/home");
        } else {
          toast.error(response.message);
        }
      },
      onError: () => {
        toast.error("Failed to create listing");
      },
    });
  };

  return (
    <Container
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100dvh"
    >
      <FormProvider {...form}>
        <StyledForm onSubmit={form.handleSubmit(onSubmit)}>
          <Container
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            width="20rem"
            height="100%"
            gap="1rem"
          >
            <h1>New Listing</h1>
            <FormInput
              name="address"
              label="Address"
              type="text"
              placeholder="123 Main St, Apt 4B"
              rules={{ required: "Address is required" }}
            />
            <FormInput
              name="description"
              label="Description"
              type="textarea"
              placeholder="A little about the place..."
              rules={{ required: "Description is required" }}
            />
            <FormInput
              name="price"
              label="Price"
              type="number"
              placeholder="400"
              rules={{ required: "Price is required" }}
            />
            <FormInput
              name="roommatesCount"
              label="Roommates count"
              type="number"
              placeholder="2"
              rules={{ required: "Roommate count is required" }}
            />
            <FormInput
              name="roommatesLookingFor"
              label="Roommates looking for"
              type="number"
              placeholder="1"
              rules={{
                required: "Must specify how many roommatess you're looking for",
              }}
            />
            <Container width="100%" flexDirection="column" gap="0.5rem">
              <label>
                <input type="checkbox" {...form.register("isPetFriendly")} />{" "}
                Pet friendly
              </label>
              <label>
                <input
                  type="checkbox"
                  {...form.register("isSmokingFriendly")}
                />{" "}
                Smoking friendly
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
