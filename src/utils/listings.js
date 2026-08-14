const STORAGE_KEY = "estatery_user_listings";

export function loadUserListings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserListings(listings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
}

export function createListing(data) {
  return {
    id: `listing_${Date.now()}`,
    isUserSubmitted: true,
    title: data.title.trim(),
    location: data.location.trim(),
    price: Number(data.price),
    beds: Number(data.beds),
    baths: Number(data.baths),
    description: data.description?.trim() || "",
    image: data.image,
    listedBy: data.listedBy?.trim() || "Property Owner",
    listedAt: Date.now(),
  };
}
