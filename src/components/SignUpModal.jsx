import { useEffect, useState } from "react";

export default function SignUpModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isOpen) {
      setForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    }
  }, [isOpen]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return;
    onSubmit?.(form);
    onClose();
  };

  const passwordsMismatch = form.confirmPassword && form.password !== form.confirmPassword;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative modal-panel rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-modal-in">
        <div className="sticky top-0 modal-panel px-6 py-4 border-b border-black/6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-charcoal font-semibold text-lg">Create Your Account</h2>
            <p className="text-charcoal-muted text-sm mt-0.5">Join Estatery to save favorites and list properties</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="you@email.com" />
          </div>
          <div>
            <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Phone (optional)</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="(555) 123-4567" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} className={inputClass} placeholder="Min. 8 characters" />
            </div>
            <div>
              <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Confirm</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required minLength={8} className={inputClass} placeholder="Repeat password" />
            </div>
          </div>
          {passwordsMismatch && (
            <p className="text-rose-600 text-xs -mt-2">Passwords do not match.</p>
          )}

          <button
            type="submit"
            disabled={passwordsMismatch}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-md shadow-emerald-900/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign Up
          </button>

          <p className="text-center text-charcoal-muted text-xs">
            Already have an account?{" "}
            <button type="button" onClick={onClose} className="text-emerald-700 font-medium hover:text-emerald-600 transition-colors">
              Log in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
