import { formatPrice } from "../data/properties";

export default function PropertyCard({ property, isFavorite, onToggleFavorite, onClick }) {
  const locationLabel = property.location.split(",")[0];

  return (
    <article
      onClick={onClick}
      className="listing-card group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-white/20 backdrop-blur-xl border border-white/20 shadow-2xl"
    >
      <div className="relative listing-card-image-wrap">
        <img
          src={property.image}
          alt={property.title}
          className="listing-card-image block w-full h-full"
          loading="lazy"
          draggable="false"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            className={`w-[18px] h-[18px] transition-colors ${
              isFavorite ? "text-rose-500 fill-rose-500" : "text-charcoal-muted fill-none"
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </button>
      </div>

      <div className="p-4 md:p-5">
        <h3 className="text-white font-semibold text-[15px] leading-snug group-hover:text-emerald-200 transition-colors mb-1.5">
          {property.title}
        </h3>
        <p className="text-white/70 text-sm mb-3 flex items-center gap-1">
          <span aria-hidden="true">📍</span>
          {locationLabel}
        </p>
        <p className="text-white font-bold text-lg tracking-tight">
          {formatPrice(property.price)}
        </p>
        {property.isUserSubmitted && (
          <p className="text-emerald-300/90 text-xs font-medium mt-2">Community listing</p>
        )}
      </div>
    </article>
  );
}
