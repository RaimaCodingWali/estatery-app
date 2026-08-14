import image49 from "../assets/image_49.png";
import image50 from "../assets/image_50.png";
import image51 from "../assets/image_51.png";
import image52 from "../assets/image_52.png";
import image53 from "../assets/image_53.png";
import image54 from "../assets/image_54.png";
import image55 from "../assets/image_55.png";
import image56 from "../assets/image_56.png";
import image57 from "../assets/image_57.png";

export const INITIAL_PROPERTIES = [
  {
    id: 1,
    title: "Contemporary Dusk Estate",
    location: "Beverly Hills, California",
    price: 4850000,
    beds: 5,
    baths: 6,
    sqft: 6200,
    image: image49,
  },
  {
    id: 2,
    title: "Mountain Timber Lodge",
    location: "Aspen, Colorado",
    price: 3200000,
    beds: 4,
    baths: 5,
    sqft: 5100,
    image: image50,
  },
  {
    id: 3,
    title: "Hills Glass Villa",
    location: "Malibu, California",
    price: 5600000,
    beds: 5,
    baths: 5,
    sqft: 5800,
    image: image51,
  },
  {
    id: 4,
    title: "Sunset Glass Manor",
    location: "Palm Springs, California",
    price: 3750000,
    beds: 4,
    baths: 4,
    sqft: 4900,
    image: image52,
  },
  {
    id: 5,
    title: "Cantilever Modern Villa",
    location: "Scottsdale, Arizona",
    price: 2890000,
    beds: 4,
    baths: 4,
    sqft: 4200,
    image: image53,
  },
  {
    id: 6,
    title: "Timber Stone Residence",
    location: "Portland, Oregon",
    price: 1980000,
    beds: 3,
    baths: 3,
    sqft: 3400,
    image: image54,
  },
  {
    id: 7,
    title: "Tropical Pool Estate",
    location: "Miami Beach, Florida",
    price: 6200000,
    beds: 6,
    baths: 7,
    sqft: 7400,
    image: image55,
  },
  {
    id: 8,
    title: "Forest Glass Retreat",
    location: "Lake Tahoe, Nevada",
    price: 2450000,
    beds: 3,
    baths: 2,
    sqft: 2800,
    image: image56,
  },
  {
    id: 9,
    title: "LED Pathway Manor",
    location: "Austin, Texas",
    price: 3100000,
    beds: 4,
    baths: 4,
    sqft: 4500,
    image: image57,
  },
];

export const PRICE_RANGES = [
  { label: "Price Range", min: 0, max: Infinity },
  { label: "Under $2M", min: 0, max: 2000000 },
  { label: "$2M – $3M", min: 2000000, max: 3000000 },
  { label: "$3M – $4M", min: 3000000, max: 4000000 },
  { label: "$4M+", min: 4000000, max: Infinity },
];

export function formatPrice(price) {
  return `$${price.toLocaleString()}`;
}

export function formatPriceShort(price) {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(price % 1000000 === 0 ? 0 : 2)}M`;
  }
  return `$${price.toLocaleString()}`;
}
