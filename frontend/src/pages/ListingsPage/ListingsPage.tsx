import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Button from "../../components/CustomButtons/CustomButtons";
import Badge, { BadgesRow } from "../../components/Badge/Badge";
import Divider from "../../components/Divider/Divider";
import {
  AnimatedCard,
  ImageSection,
  CardImage,
  ImageNav,
  ImageCounter,
  ContentScroll,
} from "../../components/Card/Card";
import {
  InfoGrid,
  InfoCell,
  InfoLabel,
  InfoValue,
} from "../../components/InfoGrid/InfoGrid";
import {
  ActionBar,
  ActionCounter,
  CounterMain,
  CounterSub,
  CircleButton,
} from "../../components/ActionBar/ActionBar";
import {
  SectionLabel,
  PriceText,
  AddressText,
  DescriptionText,
} from "../../components/Typography/Typography";
import {
  PageWrapper,
  CenteredState,
  StateButtonGroup,
} from "../../components/PageLayout/PageLayout";
import { getPropertyListings } from "./requests/listingsRequests";
import { ListingImage, PropertyListing } from "./types/listingTypes";

// Mock images for demo when no real images exist
const MOCK_IMAGES: ListingImage[] = [
  {
    id: "mock-1",
    imageUrl:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    createdAt: "",
  },
  {
    id: "mock-2",
    imageUrl:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    createdAt: "",
  },
  {
    id: "mock-3",
    imageUrl:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    createdAt: "",
  },
  {
    id: "mock-4",
    imageUrl:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
    createdAt: "",
  },
  {
    id: "mock-5",
    imageUrl:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
    createdAt: "",
  },
];

const getListingImages = (listing: PropertyListing): ListingImage[] => {
  return listing.images.length > 0 ? listing.images : MOCK_IMAGES;
};

const ListingsPage = (): JSX.Element => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [likedListings, setLikedListings] = useState<string[]>([]);
  const [rejectedListings, setRejectedListings] = useState<string[]>([]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["propertyListings"],
    queryFn: getPropertyListings,
  });

  const listings = useMemo(() => data?.data ?? [], [data]);

  const currentListing: PropertyListing | null = listings[currentIndex] ?? null;
  const currentImages = currentListing ? getListingImages(currentListing) : [];

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating || !currentListing) return;

      setIsAnimating(true);
      setSwipeDirection(direction);

      if (direction === "right") {
        setLikedListings((prev) => [...prev, currentListing.id]);
      } else {
        setRejectedListings((prev) => [...prev, currentListing.id]);
      }

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setCurrentImageIndex(0);
        setSwipeDirection(null);
        setIsAnimating(false);
      }, 400);
    },
    [isAnimating, currentListing],
  );

  const handlePrevImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!currentListing) return;
      setCurrentImageIndex((prev) =>
        prev > 0 ? prev - 1 : currentImages.length - 1,
      );
    },
    [currentListing, currentImages],
  );

  const handleNextImage = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!currentListing) return;
      setCurrentImageIndex((prev) =>
        prev < currentImages.length - 1 ? prev + 1 : 0,
      );
    },
    [currentListing, currentImages],
  );

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setCurrentImageIndex(0);
    setLikedListings([]);
    setRejectedListings([]);
  }, []);

  const formatPrice = (price: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(parseFloat(price));

  const getGenderLabel = (gender: string) => {
    if (gender === "GIRLS") return "Girls Only";
    if (gender === "BOYS") return "Boys Only";
    return "All Genders";
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <CenteredState>Loading listings...</CenteredState>
      </PageWrapper>
    );
  }

  if (isError) {
    return (
      <PageWrapper>
        <CenteredState>
          <h2>Something went wrong</h2>
          <p>We couldn't load the listings right now.</p>
          <StateButtonGroup>
            <Button type="button" color="primary" onClick={() => refetch()}>
              Try Again
            </Button>
          </StateButtonGroup>
        </CenteredState>
      </PageWrapper>
    );
  }

  if (listings.length === 0) {
    return (
      <PageWrapper>
        <CenteredState>
          <h2>No Listings Available</h2>
          <p>Check back later for new roommate opportunities.</p>
        </CenteredState>
      </PageWrapper>
    );
  }

  if (currentIndex >= listings.length || !currentListing) {
    return (
      <PageWrapper>
        <CenteredState>
          <h2>All caught up!</h2>
          <p>
            You liked {likedListings.length} and passed on{" "}
            {rejectedListings.length} listing
            {likedListings.length + rejectedListings.length !== 1 ? "s" : ""}.
          </p>
          <StateButtonGroup>
            <Button type="button" color="primary" onClick={handleRestart}>
              Start Over
            </Button>
            <Button type="button" color="secondary" onClick={() => refetch()}>
              Refresh Listings
            </Button>
          </StateButtonGroup>
        </CenteredState>
      </PageWrapper>
    );
  }

  const hasImages = currentImages.length > 0;

  return (
    <PageWrapper>
      <AnimatedCard $swipeDirection={swipeDirection} $isAnimating={isAnimating}>
        {hasImages && (
          <ImageSection>
            <CardImage
              src={currentImages[currentImageIndex]?.imageUrl}
              alt={currentListing.address}
            />
            {currentImages.length > 1 && (
              <>
                <ImageNav
                  $side="left"
                  onClick={handlePrevImage}
                  aria-label="Previous image"
                >
                  ‹
                </ImageNav>
                <ImageNav
                  $side="right"
                  onClick={handleNextImage}
                  aria-label="Next image"
                >
                  ›
                </ImageNav>
                <ImageCounter>
                  {currentImageIndex + 1} / {currentImages.length}
                </ImageCounter>
              </>
            )}
          </ImageSection>
        )}

        <ContentScroll>
          {/* Header */}
          <div>
            <PriceText>{formatPrice(currentListing.price)}/mo</PriceText>
            <AddressText>
              {currentListing.address}, {currentListing.city}
            </AddressText>
          </div>

          <Divider />

          {/* Property details */}
          <div>
            <SectionLabel>Property Details</SectionLabel>
            <InfoGrid>
              <InfoCell>
                <InfoLabel>Area</InfoLabel>
                <InfoValue>{currentListing.area} m²</InfoValue>
              </InfoCell>
              <InfoCell>
                <InfoLabel>Rooms</InfoLabel>
                <InfoValue>{currentListing.totalRooms}</InfoValue>
              </InfoCell>
              <InfoCell>
                <InfoLabel>Roommates</InfoLabel>
                <InfoValue>{currentListing.roommatesCount}</InfoValue>
              </InfoCell>
              <InfoCell>
                <InfoLabel>Spots Open</InfoLabel>
                <InfoValue>
                  {currentListing.roommatesLookingForNumber}
                </InfoValue>
              </InfoCell>
            </InfoGrid>
          </div>

          <Divider />

          {/* Preferences */}
          <div>
            <SectionLabel>Preferences</SectionLabel>
            <BadgesRow>
              <Badge
                variant={
                  currentListing.genderPreference === "ALL"
                    ? "neutral"
                    : "primary"
                }
              >
                {getGenderLabel(currentListing.genderPreference)}
              </Badge>
              <Badge variant={currentListing.smoking ? "warning" : "success"}>
                {currentListing.smoking ? "Smoking Allowed" : "No Smoking"}
              </Badge>
              <Badge variant={currentListing.pets ? "success" : "neutral"}>
                {currentListing.pets ? "Pets Welcome" : "No Pets"}
              </Badge>
            </BadgesRow>
          </div>

          <Divider />

          {/* Description */}
          <div>
            <SectionLabel>About this place</SectionLabel>
            <DescriptionText>{currentListing.description}</DescriptionText>
          </div>
        </ContentScroll>

        <ActionBar>
          <CircleButton
            $variant="reject"
            onClick={() => handleSwipe("left")}
            disabled={isAnimating}
            aria-label="Pass"
          >
            ✕
          </CircleButton>

          <CircleButton
            $variant="accept"
            onClick={() => handleSwipe("right")}
            disabled={isAnimating}
            aria-label="Like"
          >
            ♥
          </CircleButton>
        </ActionBar>
      </AnimatedCard>
    </PageWrapper>
  );
};

export default ListingsPage;
