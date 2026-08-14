import { useEffect, useRef, useState } from "react";
import { getUserInitial } from "../utils/auth";
import { DEFAULT_PAYMENT_METHODS, getBrandStyles } from "../utils/paymentMethods";
import AddPaymentMethodModal from "./AddPaymentMethodModal";

const SETTINGS_KEY = "estatery_settings";

const defaultSettings = {
  emailAlerts: true,
  smsAlerts: false,
  priceDropAlerts: true,
  newListingAlerts: true,
  avatarUrl: "",
  isPremium: false,
  paymentMethods: DEFAULT_PAYMENT_METHODS,
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...defaultSettings, paymentMethods: [...DEFAULT_PAYMENT_METHODS] };
    const parsed = JSON.parse(raw);
    return {
      ...defaultSettings,
      ...parsed,
      paymentMethods: parsed.paymentMethods?.length ? parsed.paymentMethods : [...DEFAULT_PAYMENT_METHODS],
    };
  } catch {
    return { ...defaultSettings, paymentMethods: [...DEFAULT_PAYMENT_METHODS] };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function SettingsSection({ title, description, children }) {
  return (
    <section className="listing-card bg-white/20 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[20px] overflow-hidden">
      <div className="px-5 md:px-6 py-4 border-b border-white/15">
        <h3 className="text-white font-semibold text-[15px]">{title}</h3>
        {description && <p className="text-white/55 text-xs mt-0.5">{description}</p>}
      </div>
      <div className="p-5 md:p-6 space-y-4">{children}</div>
    </section>
  );
}

function FieldLabel({ children }) {
  return <label className="block text-white/70 text-xs font-medium mb-1.5">{children}</label>;
}

const MAX_AVATAR_SIZE_MB = 2;

function readImageFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-white/35 focus:ring-1 focus:ring-white/10 transition-all";

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <label className="flex items-start justify-between gap-4 cursor-pointer group">
      <div>
        <p className="text-white text-sm font-medium group-hover:text-emerald-100 transition-colors">{label}</p>
        {description && <p className="text-white/50 text-xs mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-emerald-500" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}

function PaymentMethodRow({ method, onEdit }) {
  const { gradient, label } = getBrandStyles(method.brand);

  return (
    <div className="rounded-xl bg-white/10 border border-white/15 p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-7 rounded bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
          {label ? (
            <span className="text-white/80 text-[8px] font-bold tracking-wider">{label}</span>
          ) : (
            <svg className="w-5 h-3 text-white/90" viewBox="0 0 24 16" fill="currentColor">
              <rect x="1" y="3" width="22" height="10" rx="2" opacity="0.3" />
            </svg>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-medium">
            {method.brand} ending in {method.last4}
          </p>
          <p className="text-white/50 text-xs">
            Expires {method.expiry}
            {method.isDefault ? " · Default" : ""}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onEdit(method)}
        className="text-emerald-300 hover:text-emerald-200 text-xs font-medium shrink-0 transition-colors"
      >
        Edit
      </button>
    </div>
  );
}

export default function AccountSettingsView({ user, onUpdateProfile, onAvatarChange, onSignUpClick }) {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", avatarUrl: "" });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [notifications, setNotifications] = useState(loadSettings());
  const [paymentMethods, setPaymentMethods] = useState(DEFAULT_PAYMENT_METHODS);
  const [paymentModal, setPaymentModal] = useState({ open: false, mode: "add", method: null });
  const [saved, setSaved] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarFileName, setAvatarFileName] = useState("");
  const avatarInputRef = useRef(null);
  const avatarObjectUrlRef = useRef(null);

  useEffect(() => {
    const settings = loadSettings();
    setProfile({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      avatarUrl: settings.avatarUrl || user?.avatarUrl || "",
    });
    setNotifications(settings);
    setPaymentMethods(settings.paymentMethods || [...DEFAULT_PAYMENT_METHODS]);
    setAvatarFileName(settings.avatarUrl ? "Saved profile photo" : "");
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
        avatarObjectUrlRef.current = null;
      }
    };
  }, []);

  const persistSettings = (nextNotifications, nextPaymentMethods = paymentMethods) => {
    const payload = {
      ...nextNotifications,
      avatarUrl: profile.avatarUrl,
      paymentMethods: nextPaymentMethods,
    };
    saveSettings(payload);
    setNotifications(nextNotifications);
    setPaymentMethods(nextPaymentMethods);
  };

  const showSavedToast = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleAddPaymentMethod = (card) => {
    const newMethod = {
      id: `pm_${Date.now()}`,
      brand: card.brand,
      last4: card.last4,
      expiry: card.expiry,
      cardholderName: card.cardholderName,
      isDefault: card.isDefault,
    };

    const updated = card.isDefault
      ? [newMethod, ...paymentMethods.map((m) => ({ ...m, isDefault: false }))]
      : [...paymentMethods, newMethod];

    persistSettings(notifications, updated);
    showSavedToast();
  };

  const handleUpdatePaymentMethod = (card) => {
    let updated = paymentMethods.map((m) => {
      if (m.id !== card.id) {
        return card.isDefault ? { ...m, isDefault: false } : m;
      }
      return {
        ...m,
        cardholderName: card.cardholderName,
        expiry: card.expiry,
        isDefault: card.isDefault,
      };
    });

    if (card.isDefault) {
      updated = updated.map((m) => ({ ...m, isDefault: m.id === card.id }));
    }

    persistSettings(notifications, updated);
    showSavedToast();
  };

  const handleDeletePaymentMethod = (id) => {
    let updated = paymentMethods.filter((m) => m.id !== id);
    if (updated.length > 0 && !updated.some((m) => m.isDefault)) {
      updated = updated.map((m, i) => (i === 0 ? { ...m, isDefault: true } : m));
    }
    persistSettings(notifications, updated);
    showSavedToast();
  };

  const openAddPaymentModal = () => {
    setPaymentModal({ open: true, mode: "add", method: null });
  };

  const openEditPaymentModal = (method) => {
    setPaymentModal({ open: true, mode: "edit", method });
  };

  const closePaymentModal = () => {
    setPaymentModal({ open: false, mode: "add", method: null });
  };

  const handlePaymentModalSubmit = (card) => {
    if (paymentModal.mode === "edit") {
      handleUpdatePaymentMethod(card);
    } else {
      handleAddPaymentMethod(card);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (!user) {
      onSignUpClick?.();
      return;
    }
    onUpdateProfile?.({
      name: profile.name.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
    });
    saveSettings({ ...notifications, avatarUrl: profile.avatarUrl, paymentMethods });
    showSavedToast();
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) return;
    setPasswords({ current: "", next: "", confirm: "" });
    showSavedToast();
  };

  const handleNotificationsSave = (nextNotifications) => {
    persistSettings(nextNotifications);
    showSavedToast();
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setAvatarError("");

    if (!file.type.startsWith("image/")) {
      setAvatarError("Please choose an image file (JPG, PNG, GIF, or WebP).");
      return;
    }

    if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
      setAvatarError(`Image must be ${MAX_AVATAR_SIZE_MB} MB or smaller.`);
      return;
    }

    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    avatarObjectUrlRef.current = objectUrl;
    setAvatarFileName(file.name);
    setProfile((p) => ({ ...p, avatarUrl: objectUrl }));
    onAvatarChange?.(objectUrl);

    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      if (avatarObjectUrlRef.current === objectUrl) {
        URL.revokeObjectURL(objectUrl);
        avatarObjectUrlRef.current = null;
      }
      setProfile((p) => ({ ...p, avatarUrl: dataUrl }));
      onAvatarChange?.(dataUrl);
      persistSettings({ ...notifications, avatarUrl: dataUrl }, paymentMethods);
    } catch {
      setAvatarError("Could not load that image. Try another file.");
      setProfile((p) => ({ ...p, avatarUrl: "" }));
      onAvatarChange?.("");
      setAvatarFileName("");
    }
  };

  const handleRemoveAvatar = () => {
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
      avatarObjectUrlRef.current = null;
    }
    setAvatarError("");
    setAvatarFileName("");
    setProfile((p) => ({ ...p, avatarUrl: "" }));
    onAvatarChange?.("");
    persistSettings({ ...notifications, avatarUrl: "" }, paymentMethods);
  };

  const initial = getUserInitial(profile.name || user?.name);
  const avatarSrc = profile.avatarUrl?.trim();

  if (!user) {
    return (
      <div className="listing-card p-12 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p className="text-white text-lg font-medium">Sign in to manage your account</p>
        <p className="text-white/70 text-sm mt-1 mb-6">Create an account to update profile, security, and billing settings.</p>
        <button
          type="button"
          onClick={onSignUpClick}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5 md:space-y-6 max-w-3xl">
      {saved && (
        <div className="rounded-xl bg-emerald-500/20 border border-emerald-400/30 px-4 py-3 text-emerald-200 text-sm font-medium animate-fade-in">
          Settings saved successfully.
        </div>
      )}

      <SettingsSection title="Profile Information" description="Update your personal details and profile picture.">
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative shrink-0">
              {avatarSrc ? (
                <img src={avatarSrc} alt="" className="w-20 h-20 rounded-full object-cover border-[3px] border-white/30 shadow-lg" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold border-[3px] border-white/30 shadow-lg">
                  {initial}
                </div>
              )}
            </div>
            <div className="flex-1 w-full space-y-2">
              <FieldLabel>Profile Picture</FieldLabel>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="sr-only"
                aria-label="Upload profile picture"
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-semibold transition-colors"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Choose from gallery
                </button>
                {avatarSrc && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/15 text-white/70 hover:text-rose-200 text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              {avatarFileName && !avatarError && (
                <p className="text-white/50 text-xs truncate">{avatarFileName}</p>
              )}
              {avatarError && <p className="text-rose-300 text-xs">{avatarError}</p>}
              <p className="text-white/40 text-xs">JPG, PNG, GIF, or WebP · max {MAX_AVATAR_SIZE_MB} MB</p>
            </div>
          </div>
          <div>
            <FieldLabel>Full Name</FieldLabel>
            <input
              required
              value={profile.name}
              onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
              className={inputClass}
              placeholder="Your full name"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>Email</FieldLabel>
              <input
                required
                type="email"
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                className={inputClass}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <FieldLabel>Phone Number</FieldLabel>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                className={inputClass}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors">
            Save Profile
          </button>
        </form>
      </SettingsSection>

      <SettingsSection title="Password & Security" description="Keep your account secure with a strong password.">
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div>
            <FieldLabel>Current Password</FieldLabel>
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
              className={inputClass}
              placeholder="Enter current password"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel>New Password</FieldLabel>
              <input
                type="password"
                value={passwords.next}
                onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                className={inputClass}
                placeholder="Min. 8 characters"
                minLength={8}
              />
            </div>
            <div>
              <FieldLabel>Confirm New Password</FieldLabel>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                className={inputClass}
                placeholder="Repeat new password"
              />
            </div>
          </div>
          {passwords.confirm && passwords.next !== passwords.confirm && (
            <p className="text-rose-300 text-xs">Passwords do not match.</p>
          )}
          <button
            type="submit"
            disabled={Boolean(passwords.confirm && passwords.next !== passwords.confirm)}
            className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            Update Password
          </button>
        </form>
      </SettingsSection>

      <SettingsSection title="Notification Preferences" description="Choose how Estatery keeps you informed.">
        <div className="space-y-4">
          <ToggleRow
            label="Email Alerts"
            description="Receive updates and property summaries by email."
            checked={notifications.emailAlerts}
            onChange={(v) => {
              const next = { ...notifications, emailAlerts: v };
              handleNotificationsSave(next);
            }}
          />
          <ToggleRow
            label="SMS Alerts"
            description="Get text messages for urgent listing updates."
            checked={notifications.smsAlerts}
            onChange={(v) => {
              const next = { ...notifications, smsAlerts: v };
              handleNotificationsSave(next);
            }}
          />
          <ToggleRow
            label="Price Drop Alerts"
            description="Notify me when favorited properties reduce in price."
            checked={notifications.priceDropAlerts}
            onChange={(v) => {
              const next = { ...notifications, priceDropAlerts: v };
              handleNotificationsSave(next);
            }}
          />
          <ToggleRow
            label="New Listing Alerts"
            description="Alert me when new luxury listings match my search."
            checked={notifications.newListingAlerts}
            onChange={(v) => {
              const next = { ...notifications, newListingAlerts: v };
              handleNotificationsSave(next);
            }}
          />
        </div>
      </SettingsSection>

      <SettingsSection title="Billing & Saved Payment Methods" description="Manage cards used for property purchases.">
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <PaymentMethodRow key={method.id} method={method} onEdit={openEditPaymentModal} />
          ))}
        </div>
        <button
          type="button"
          onClick={openAddPaymentModal}
          className="w-full py-2.5 rounded-xl border border-dashed border-white/25 text-white/70 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors"
        >
          + Add Payment Method
        </button>
      </SettingsSection>

      <AddPaymentMethodModal
        isOpen={paymentModal.open}
        onClose={closePaymentModal}
        mode={paymentModal.mode}
        editingMethod={paymentModal.method}
        onSubmit={handlePaymentModalSubmit}
        onDelete={handleDeletePaymentMethod}
      />
    </div>
  );
}
