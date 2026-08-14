import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  getCardDigits,
  getCvvLength,
} from "../utils/paymentMethods";

const FIELD = {
  name: "field_a",
  number: "field_b",
  expiry: "field_c",
  cvv: "field_d",
  isDefault: "field_e",
};

function maskCardNumber(last4) {
  return `•••• •••• •••• ${last4}`;
}

export default function AddPaymentMethodModal({
  isOpen,
  onClose,
  onSubmit,
  mode = "add",
  editingMethod = null,
  onDelete,
}) {
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    isDefault: false,
  });
  const [errors, setErrors] = useState({});

  const digits = getCardDigits(form.cardNumber);
  const brand = isEdit && editingMethod ? editingMethod.brand : detectCardBrand(digits);
  const cvvLength = getCvvLength(brand);

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && editingMethod) {
      setForm({
        cardholderName: editingMethod.cardholderName || "",
        cardNumber: maskCardNumber(editingMethod.last4),
        expiry: editingMethod.expiry,
        cvv: "",
        isDefault: editingMethod.isDefault,
      });
    } else {
      setForm({ cardholderName: "", cardNumber: "", expiry: "", cvv: "", isDefault: false });
    }
    setErrors({});
  }, [isOpen, isEdit, editingMethod]);

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

  const validate = () => {
    const next = {};
    if (!form.cardholderName.trim()) next.cardholderName = "Cardholder name is required.";

    if (!isEdit) {
      if (digits.length < 4) next.cardNumber = "Enter a card number.";
      if (!/^\d{3,4}$/.test(form.cvv)) {
        next.cvv = "Enter a 3–4 digit CVV.";
      }
    }

    const expiryMatch = form.expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!expiryMatch || Number(expiryMatch[1]) < 1 || Number(expiryMatch[1]) > 12) {
      next.expiry = "Enter expiry as MM/YY.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === FIELD.number) {
      if (isEdit) return;
      setForm((prev) => ({ ...prev, cardNumber: formatCardNumber(value) }));
      return;
    }
    if (name === FIELD.expiry) {
      setForm((prev) => ({ ...prev, expiry: formatExpiry(value) }));
      return;
    }
    if (name === FIELD.cvv) {
      setForm((prev) => ({ ...prev, cvv: value.replace(/\D/g, "").slice(0, 4) }));
      return;
    }
    if (name === FIELD.name) {
      setForm((prev) => ({ ...prev, cardholderName: value }));
      return;
    }
    if (name === FIELD.isDefault) {
      setForm((prev) => ({ ...prev, isDefault: checked }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEdit && editingMethod) {
      onSubmit?.({
        id: editingMethod.id,
        cardholderName: form.cardholderName.trim(),
        brand: editingMethod.brand,
        last4: editingMethod.last4,
        expiry: form.expiry,
        isDefault: form.isDefault,
      });
    } else {
      onSubmit?.({
        cardholderName: form.cardholderName.trim(),
        brand,
        last4: digits.slice(-4),
        expiry: form.expiry,
        isDefault: form.isDefault,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (isEdit && editingMethod) {
      onDelete?.(editingMethod.id);
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="flex min-h-full min-h-dvh items-center justify-center p-4 sm:p-6">
        <button
          type="button"
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Close overlay"
        />

        <div className="relative z-10 w-full max-w-md max-h-[min(90vh,calc(100dvh-2rem))] flex flex-col modal-panel rounded-2xl shadow-2xl animate-modal-in overflow-hidden my-4">
          <div className="shrink-0 px-6 py-4 border-b border-black/6 flex items-center justify-between bg-inherit">
            <div>
              <h2 id="payment-modal-title" className="text-charcoal font-semibold text-lg">
                {isEdit ? "Edit Payment Method" : "Add Payment Method"}
              </h2>
              <p className="text-charcoal-muted text-sm mt-0.5">
                {isEdit
                  ? `${editingMethod?.brand} ending in ${editingMethod?.last4}`
                  : "Securely save a card for property purchases"}
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

          <form
            onSubmit={handleSubmit}
            autoComplete="off"
            name="estatery-billing-entry"
            className="overflow-y-auto p-6 space-y-4 flex-1 min-h-0"
          >
            {isEdit && editingMethod && (
              <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/60 px-4 py-3 text-sm">
                <p className="text-charcoal-muted text-xs font-medium uppercase tracking-wide">Card type</p>
                <p className="text-charcoal font-semibold mt-0.5">
                  {editingMethod.brand} · ending in {editingMethod.last4}
                </p>
              </div>
            )}

            <div>
              <label htmlFor={FIELD.name} className="block text-charcoal-muted text-xs font-medium mb-1.5">
                Cardholder Name
              </label>
              <input
                id={FIELD.name}
                name={FIELD.name}
                value={form.cardholderName}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Name on card"
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
              />
              {errors.cardholderName && <p className="text-rose-600 text-xs mt-1">{errors.cardholderName}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor={FIELD.number} className="block text-charcoal-muted text-xs font-medium">
                  Card Number
                </label>
                {!isEdit && digits.length >= 1 && (
                  <span className="text-emerald-700 text-xs font-semibold">{brand}</span>
                )}
              </div>
              <input
                id={FIELD.number}
                name={FIELD.number}
                value={form.cardNumber}
                onChange={handleChange}
                required
                readOnly={isEdit}
                inputMode={isEdit ? undefined : "numeric"}
                className={`${inputClass}${isEdit ? " opacity-70 cursor-not-allowed bg-white/50" : ""}`}
                placeholder="1234 5678 9012 3456"
                autoComplete="new-password"
                data-lpignore="true"
                data-form-type="other"
              />
              {errors.cardNumber && <p className="text-rose-600 text-xs mt-1">{errors.cardNumber}</p>}
            </div>

            <div className={`grid gap-3 ${isEdit ? "grid-cols-1" : "grid-cols-2"}`}>
              <div>
                <label htmlFor={FIELD.expiry} className="block text-charcoal-muted text-xs font-medium mb-1.5">
                  Expiry Date
                </label>
                <input
                  id={FIELD.expiry}
                  name={FIELD.expiry}
                  value={form.expiry}
                  onChange={handleChange}
                  required
                  inputMode="numeric"
                  className={inputClass}
                  placeholder="MM/YY"
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-form-type="other"
                />
                {errors.expiry && <p className="text-rose-600 text-xs mt-1">{errors.expiry}</p>}
              </div>
              {!isEdit && (
                <div>
                  <label htmlFor={FIELD.cvv} className="block text-charcoal-muted text-xs font-medium mb-1.5">
                    CVV
                  </label>
                  <input
                    id={FIELD.cvv}
                    name={FIELD.cvv}
                    value={form.cvv}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    type="text"
                    className={inputClass}
                    placeholder={brand === "Amex" ? "1234" : "123"}
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-form-type="other"
                  />
                  {errors.cvv && <p className="text-rose-600 text-xs mt-1">{errors.cvv}</p>}
                </div>
              )}
            </div>

            <label className="flex items-center gap-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                id={FIELD.isDefault}
                name={FIELD.isDefault}
                checked={form.isDefault}
                onChange={handleChange}
                autoComplete="off"
                className="w-4 h-4 rounded border-black/20 text-emerald-600 focus:ring-emerald-500/30"
              />
              <span className="text-charcoal text-sm">Set as default payment method</span>
            </label>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-900/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {isEdit ? "Save Changes" : "Add Card"}
            </button>

            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full py-3 rounded-xl bg-white/60 border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-sm transition-colors"
              >
                Delete Card
              </button>
            )}
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
