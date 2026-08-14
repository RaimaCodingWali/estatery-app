import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getBrandStyles } from "../utils/paymentMethods";

const PREMIUM_PRICE = 29;

const PREMIUM_FEATURES = [
  "Unlimited access to all premium listings",
  "Priority agent matching & concierge support",
  "Advanced price alerts & market insights",
  "Early access to new luxury properties",
];

function PaymentMethodOption({ method, selected, onSelect }) {
  const { gradient, label } = getBrandStyles(method.brand);

  return (
    <label
      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
        selected
          ? "border-emerald-500/50 bg-emerald-50/80 ring-1 ring-emerald-500/20"
          : "border-black/8 bg-white/50 hover:bg-white/70"
      }`}
    >
      <input
        type="radio"
        name="upgrade-payment"
        checked={selected}
        onChange={onSelect}
        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500/30"
      />
      <div className={`w-10 h-7 rounded bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
        {label ? (
          <span className="text-white/80 text-[8px] font-bold tracking-wider">{label}</span>
        ) : (
          <svg className="w-5 h-3 text-white/90" viewBox="0 0 24 16" fill="currentColor">
            <rect x="1" y="3" width="22" height="10" rx="2" opacity="0.3" />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-charcoal text-sm font-medium">
          {method.brand} ending in {method.last4}
        </p>
        <p className="text-charcoal-muted text-xs">
          Expires {method.expiry}
          {method.isDefault ? " · Default" : ""}
        </p>
      </div>
    </label>
  );
}

export default function UpgradeModal({
  isOpen,
  onClose,
  paymentMethods,
  onConfirmUpgrade,
  onAddPaymentMethod,
}) {
  const [step, setStep] = useState("checkout");
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setStep("checkout");
    setError("");
    setIsProcessing(false);
    const defaultMethod = paymentMethods.find((m) => m.isDefault) || paymentMethods[0];
    setSelectedId(defaultMethod?.id ?? null);
  }, [isOpen, paymentMethods]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && step !== "processing") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, step]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedId) {
      setError("Select a payment method to continue.");
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      await onConfirmUpgrade?.(selectedId);
      setStep("success");
    } catch {
      setError("Payment could not be processed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] overflow-y-auto overscroll-contain"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      <div className="flex min-h-full min-h-dvh items-center justify-center p-4 sm:p-6">
        <button
          type="button"
          className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm"
          onClick={() => !isProcessing && onClose()}
          aria-label="Close overlay"
        />

        <div className="relative z-10 w-full max-w-md max-h-[min(90vh,calc(100dvh-2rem))] flex flex-col modal-panel rounded-2xl shadow-2xl animate-modal-in overflow-hidden my-4">
          {step === "success" ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 id="upgrade-modal-title" className="text-charcoal font-semibold text-xl mb-2">
                Successfully upgraded to Premium!
              </h2>
              <p className="text-charcoal-muted text-sm leading-relaxed mb-6">
                Your Pro membership is now active. Enjoy unlimited access to premium listings and exclusive Estatery features.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="shrink-0 px-6 py-4 border-b border-black/6 flex items-center justify-between bg-inherit">
                <div>
                  <h2 id="upgrade-modal-title" className="text-charcoal font-semibold text-lg">
                    Upgrade to Premium
                  </h2>
                  <p className="text-charcoal-muted text-sm mt-0.5">
                    Unlock all listings &amp; premium features
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="w-8 h-8 rounded-lg bg-white/60 border border-black/8 flex items-center justify-center text-charcoal-muted hover:text-charcoal hover:bg-white/80 transition-colors disabled:opacity-50"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-5 flex-1 min-h-0">
                <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 p-4 text-white">
                  <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Estatery Pro</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold">${PREMIUM_PRICE}</span>
                    <span className="text-white/80 text-sm">/ month</span>
                  </div>
                  <p className="text-white/70 text-xs mt-2">Billed instantly · Cancel anytime</p>
                </div>

                <ul className="space-y-2">
                  {PREMIUM_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-charcoal-muted">
                      <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-charcoal-muted text-xs font-medium uppercase tracking-wide">Payment method</p>
                    <button
                      type="button"
                      onClick={onAddPaymentMethod}
                      className="text-emerald-700 text-xs font-semibold hover:text-emerald-600 transition-colors"
                    >
                      + Add new
                    </button>
                  </div>

                  {paymentMethods.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-black/12 bg-white/40 p-4 text-center">
                      <p className="text-charcoal-muted text-sm mb-3">No saved payment methods yet.</p>
                      <button
                        type="button"
                        onClick={onAddPaymentMethod}
                        className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                      >
                        Add Payment Method
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {paymentMethods.map((method) => (
                        <PaymentMethodOption
                          key={method.id}
                          method={method}
                          selected={selectedId === method.id}
                          onSelect={() => setSelectedId(method.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {error && <p className="text-rose-600 text-xs">{error}</p>}

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isProcessing || paymentMethods.length === 0}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-semibold text-sm shadow-md shadow-emerald-900/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isProcessing ? "Processing payment..." : `Confirm Upgrade · $${PREMIUM_PRICE}/mo`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
