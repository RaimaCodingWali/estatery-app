import { useEffect, useState } from "react";
import { formatPrice } from "../data/properties";

export default function Modal({ isOpen, onClose, mode, property, user, onSubmit }) {
  const [step, setStep] = useState("details");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    title: "",
    location: "",
    price: "",
    beds: "",
    baths: "",
    sqft: "",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop",
  });

  useEffect(() => {
    if (!isOpen) {
      setStep("details");
      return;
    }

    if (mode === "inquiry" && property) {
      setStep("details");
      setForm((prev) => ({
        ...prev,
        name: user?.name || prev.name,
        email: user?.email || prev.email,
        phone: user?.phone || prev.phone,
        message: `I'm interested in purchasing ${property.title} located in ${property.location}.`,
      }));
    }

    if (mode === "list") {
      setStep("details");
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        message: "",
        title: "",
        location: "",
        price: "",
        beds: "",
        baths: "",
        sqft: "",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop",
      });
    }
  }, [isOpen, mode, property, user]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl bg-white/70 border border-black/8 text-charcoal placeholder:text-charcoal-faint text-sm focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/15 transition-all";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProceedToBuy = (e) => {
    e.preventDefault();
    setStep("confirm");
  };

  const handleConfirmPurchase = (e) => {
    e.preventDefault();
    onSubmit?.(form, mode, property, "purchase");
    setStep("success");
  };

  const handleListSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form, mode, property, "list");
    onClose();
  };

  const handleSendInquiry = (e) => {
    e.preventDefault();
    onSubmit?.(form, mode, property, "inquiry");
    onClose();
  };

  const inquiryTitle =
    step === "confirm"
      ? "Confirm Purchase"
      : step === "success"
        ? "Purchase Complete"
        : "Purchase Property";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative modal-panel rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-modal-in">
        <div className="sticky top-0 modal-panel px-6 py-4 border-b border-black/6 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-charcoal font-semibold text-lg">
              {mode === "list" ? "List Your Home" : inquiryTitle}
            </h2>
            {mode === "inquiry" && property && step !== "success" && (
              <p className="text-charcoal-muted text-sm mt-0.5">
                {property.title} · {formatPrice(property.price)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/60 border border-black/8 flex items-center justify-center text-charcoal-muted hover:text-charcoal hover:bg-white/80 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {mode === "inquiry" && property && step === "success" ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-charcoal font-semibold text-xl mb-2">Congratulations!</h3>
            <p className="text-charcoal-muted text-sm leading-relaxed mb-1">
              Your purchase of <span className="font-medium text-charcoal">{property.title}</span> is confirmed.
            </p>
            <p className="text-charcoal font-bold text-2xl tracking-tight mb-4">{formatPrice(property.price)}</p>
            <p className="text-charcoal-faint text-xs mb-6">
              A confirmation email will be sent to {form.email}. Our team will contact you within 24 hours to finalize closing details.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors"
            >
              Done
            </button>
          </div>
        ) : mode === "inquiry" && property && step === "confirm" ? (
          <form onSubmit={handleConfirmPurchase} className="p-6 space-y-4">
            <div className="rounded-xl overflow-hidden border border-black/6 bg-white/50">
              {property.image && (
                <img src={property.image} alt="" className="w-full h-36 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-charcoal font-semibold">{property.title}</h3>
                <p className="text-charcoal-muted text-sm mt-0.5">{property.location}</p>
                <div className="flex gap-3 mt-2 text-charcoal-faint text-xs">
                  <span>{property.beds} beds</span>
                  <span>{property.baths} baths</span>
                  {property.sqft != null && <span>{property.sqft.toLocaleString()} sqft</span>}
                </div>
                {property.description && (
                  <p className="text-charcoal-muted text-sm mt-3 leading-relaxed line-clamp-4">{property.description}</p>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/60 p-4">
              <div className="flex items-center justify-between">
                <span className="text-charcoal-muted text-sm">Total purchase price</span>
                <span className="text-charcoal font-bold text-xl">{formatPrice(property.price)}</span>
              </div>
            </div>

            <div className="rounded-xl bg-white/50 border border-black/6 p-4 space-y-2 text-sm">
              <p className="text-charcoal-muted text-xs font-medium uppercase tracking-wide">Billing contact</p>
              <p className="text-charcoal font-medium">{form.name}</p>
              <p className="text-charcoal-muted">{form.email}</p>
              {form.phone && <p className="text-charcoal-muted">{form.phone}</p>}
            </div>

            <p className="text-charcoal-faint text-xs leading-relaxed">
              By confirming, you agree to proceed with the purchase of this property. A dedicated Estatery agent will guide you through escrow and closing.
            </p>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep("details")}
                className="flex-1 py-3 rounded-xl bg-white/60 border border-black/8 text-charcoal font-semibold text-sm hover:bg-white/80 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-[1.4] py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-900/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Confirm Purchase
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={mode === "inquiry" ? handleProceedToBuy : handleListSubmit}
            className="p-6 space-y-4"
          >
            {mode === "inquiry" && property && (
              <div className="rounded-xl overflow-hidden border border-black/6 bg-white/50">
                {property.image && (
                  <img src={property.image} alt="" className="w-full h-32 object-cover" />
                )}
                <div className="p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-charcoal font-semibold text-sm truncate">{property.title}</p>
                      <p className="text-charcoal-muted text-xs truncate">{property.location}</p>
                    </div>
                    <p className="text-emerald-700 font-bold text-base shrink-0">{formatPrice(property.price)}</p>
                  </div>
                  <div className="flex gap-3 mt-2 text-charcoal-faint text-xs">
                    <span>{property.beds} beds</span>
                    <span>{property.baths} baths</span>
                  </div>
                  {property.description && (
                    <p className="text-charcoal-muted text-xs mt-2 leading-relaxed line-clamp-3">{property.description}</p>
                  )}
                </div>
              </div>
            )}

            {mode === "list" && (
              <>
                <div>
                  <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Property Title</label>
                  <input name="title" value={form.title} onChange={handleChange} required className={inputClass} placeholder="Modern Villa with Pool" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Location</label>
                    <input name="location" value={form.location} onChange={handleChange} required className={inputClass} placeholder="City, State" />
                  </div>
                  <div>
                    <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Price ($)</label>
                    <input name="price" type="number" value={form.price} onChange={handleChange} required className={inputClass} placeholder="2500000" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Beds</label>
                    <input name="beds" type="number" value={form.beds} onChange={handleChange} required className={inputClass} placeholder="4" />
                  </div>
                  <div>
                    <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Baths</label>
                    <input name="baths" type="number" value={form.baths} onChange={handleChange} required className={inputClass} placeholder="3" />
                  </div>
                  <div>
                    <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Sq Ft</label>
                    <input name="sqft" type="number" value={form.sqft} onChange={handleChange} required className={inputClass} placeholder="3500" />
                  </div>
                </div>
                <div>
                  <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Image URL</label>
                  <input name="image" value={form.image} onChange={handleChange} className={inputClass} placeholder="https://..." />
                </div>
              </>
            )}

            <div>
              <label className="block text-charcoal-muted text-xs font-medium mb-1.5">
                {mode === "inquiry" ? "Full Name" : "Your Name"}
              </label>
              <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Your full name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="you@email.com" />
              </div>
              <div>
                <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Phone</label>
                <input name="phone" type="tel" value={form.phone} onChange={handleChange} required={mode === "inquiry"} className={inputClass} placeholder="(555) 123-4567" />
              </div>
            </div>

            {mode === "inquiry" && (
              <div>
                <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Notes (optional)</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={2}
                  className={`${inputClass} resize-none`}
                  placeholder="Any special requests or questions..."
                />
              </div>
            )}

            {mode === "list" && (
              <div>
                <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Description</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Describe your property..."
                />
              </div>
            )}

            {mode === "inquiry" ? (
              <div className="space-y-2.5 pt-1">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-900/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  Proceed to Buy · {property && formatPrice(property.price)}
                </button>
                <button
                  type="button"
                  onClick={handleSendInquiry}
                  className="w-full py-2.5 rounded-xl bg-transparent border border-black/10 text-charcoal-muted hover:text-charcoal hover:bg-white/40 font-medium text-sm transition-colors"
                >
                  Send Inquiry Instead
                </button>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-900/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Add Listing to Grid
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
