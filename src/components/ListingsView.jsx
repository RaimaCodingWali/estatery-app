import PropertyCard from "./PropertyCard";

export default function ListingsView({
  listings,
  favorites,
  onToggleFavorite,
  onPropertyClick,
  onAddListing,
}) {
  if (listings.length === 0) {
    return (
      <div className="listing-card p-10 md:p-14 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
          </svg>
        </div>
        <p className="text-white text-lg font-semibold">No listings yet</p>
        <p className="text-white/65 text-sm mt-2 mb-6 leading-relaxed">
          This is your personal marketplace. Add your home for sale and it will appear here and on the dashboard for buyers to explore.
        </p>
        <button
          type="button"
          onClick={onAddListing}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New Listing
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-white/60 text-sm">
          {listings.length} published listing{listings.length === 1 ? "" : "s"} · visible on the dashboard feed
        </p>
        <button
          type="button"
          onClick={onAddListing}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-md shadow-emerald-900/15 transition-all hover:-translate-y-0.5 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add New Listing
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
        {listings.map((property, i) => (
          <div
            key={property.id}
            className="animate-fade-in"
            style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
          >
            <PropertyCard
              property={property}
              isFavorite={favorites.has(property.id)}
              onToggleFavorite={onToggleFavorite}
              onClick={() => onPropertyClick(property)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
