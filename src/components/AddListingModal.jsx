import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MAX_IMAGE_SIZE_MB = 3;

function readImageFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

const emptyForm = {
  title: "",
  location: "",
  price: "",
  beds: "",
  baths: "",
  description: "",
  image: "",
};

export default function AddListingModal({ isOpen, onClose, onSubmit, user }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [imageError, setImageError] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef(null);
  const imageObjectUrlRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setForm(emptyForm);
    setErrors({});
    setImageError("");
    setImageFileName("");
    setIsSubmitting(false);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (imageObjectUrlRef.current) {
        URL.revokeObjectURL(imageObjectUrlRef.current);
        imageObjectUrlRef.current = null;
      }
    };
  }, []);

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
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImageError("");

    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file (JPG, PNG, GIF, or WebP).");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setImageError(`Image must be ${MAX_IMAGE_SIZE_MB} MB or smaller.`);
      return;
    }

    if (imageObjectUrlRef.current) {
      URL.revokeObjectURL(imageObjectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    imageObjectUrlRef.current = objectUrl;
    setImageFileName(file.name);
    setForm((prev) => ({ ...prev, image: objectUrl }));

    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      if (imageObjectUrlRef.current === objectUrl) {
        URL.revokeObjectURL(objectUrl);
        imageObjectUrlRef.current = null;
      }
      setForm((prev) => ({ ...prev, image: dataUrl }));
    } catch {
      setImageError("Could not load that image. Try another file.");
      setForm((prev) => ({ ...prev, image: "" }));
      setImageFileName("");
    }
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Property title is required.";
    if (!form.location.trim()) next.location = "Location is required.";
    if (!form.price || Number(form.price) <= 0) next.price = "Enter a valid price.";
    if (!form.beds || Number(form.beds) < 0) next.beds = "Enter number of bedrooms.";
    if (!form.baths || Number(form.baths) < 0) next.baths = "Enter number of bathrooms.";
    if (!form.image) next.image = "Property image is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.({
        title: form.title.trim(),
        location: form.location.trim(),
        price: form.price,
        beds: form.beds,
        baths: form.baths,
        description: form.description.trim(),
        image: form.image,
        listedBy: user?.name || "Property Owner",
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-listing-title"
    >
      <div className="flex min-h-full min-h-dvh items-center justify-center p-4 sm:p-6">
        <button
          type="button"
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Close overlay"
        />

        <div className="relative z-10 w-full max-w-lg max-h-[min(90vh,calc(100dvh-2rem))] flex flex-col modal-panel rounded-2xl shadow-2xl animate-modal-in overflow-hidden my-4">
          <div className="shrink-0 px-6 py-4 border-b border-black/6 flex items-center justify-between bg-inherit">
            <div>
              <h2 id="add-listing-title" className="text-charcoal font-semibold text-lg">
                Add New Listing
              </h2>
              <p className="text-charcoal-muted text-sm mt-0.5">
                Put your property on sale and publish it to the Estatery marketplace
              </p>
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

          <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1 min-h-0">
            <div>
              <label htmlFor="listing-title" className="block text-charcoal-muted text-xs font-medium mb-1.5">
                Property Title
              </label>
              <input
                id="listing-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Luxury Villa"
              />
              {errors.title && <p className="text-rose-600 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="listing-location" className="block text-charcoal-muted text-xs font-medium mb-1.5">
                  Location / City
                </label>
                <input
                  id="listing-location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Miami, Florida"
                />
                {errors.location && <p className="text-rose-600 text-xs mt-1">{errors.location}</p>}
              </div>
              <div>
                <label htmlFor="listing-price" className="block text-charcoal-muted text-xs font-medium mb-1.5">
                  Price ($)
                </label>
                <input
                  id="listing-price"
                  name="price"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="2500000"
                />
                {errors.price && <p className="text-rose-600 text-xs mt-1">{errors.price}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="listing-beds" className="block text-charcoal-muted text-xs font-medium mb-1.5">
                  Bedrooms
                </label>
                <input
                  id="listing-beds"
                  name="beds"
                  type="number"
                  min="0"
                  value={form.beds}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="4"
                />
                {errors.beds && <p className="text-rose-600 text-xs mt-1">{errors.beds}</p>}
              </div>
              <div>
                <label htmlFor="listing-baths" className="block text-charcoal-muted text-xs font-medium mb-1.5">
                  Bathrooms
                </label>
                <input
                  id="listing-baths"
                  name="baths"
                  type="number"
                  min="0"
                  value={form.baths}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="3"
                />
                {errors.baths && <p className="text-rose-600 text-xs mt-1">{errors.baths}</p>}
              </div>
            </div>

            <div>
              <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Property Image</label>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="sr-only"
                aria-label="Upload property image"
              />
              {form.image ? (
                <div className="rounded-xl overflow-hidden border border-black/8 bg-white/50">
                  <img src={form.image} alt="" className="w-full h-40 object-cover" />
                  <div className="p-3 flex items-center justify-between gap-2">
                    <p className="text-charcoal-muted text-xs truncate">{imageFileName || "Selected image"}</p>
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="text-emerald-700 text-xs font-semibold hover:text-emerald-600 shrink-0"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full py-8 rounded-xl border-2 border-dashed border-black/12 bg-white/40 hover:bg-white/60 hover:border-emerald-400/40 transition-colors flex flex-col items-center gap-2"
                >
                  <svg className="w-8 h-8 text-charcoal-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-charcoal text-sm font-medium">Choose from gallery</span>
                  <span className="text-charcoal-faint text-xs">JPG, PNG, GIF, or WebP · max {MAX_IMAGE_SIZE_MB} MB</span>
                </button>
              )}
              {(errors.image || imageError) && (
                <p className="text-rose-600 text-xs mt-1">{errors.image || imageError}</p>
              )}
            </div>

            <div>
              <label htmlFor="listing-description" className="block text-charcoal-muted text-xs font-medium mb-1.5">
                Description
              </label>
              <textarea
                id="listing-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Describe your property, amenities, and neighborhood highlights..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-semibold text-sm shadow-md shadow-emerald-900/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {isSubmitting ? "Publishing..." : "Publish Listing"}
            </button>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
