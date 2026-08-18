import { useEffect, useRef, useState } from "react";
import { PRICE_RANGES } from "../data/properties";
import { getUserFirstName, getUserInitial } from "../utils/auth";

function UserAvatar({ user, className, textClassName = "text-xs" }) {
  const initial = getUserInitial(user.name);
  const avatarUrl = user.avatarUrl?.trim();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className={`object-cover border border-white/30 shadow-md ${className}`}
      />
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold border border-white/30 shadow-md ${className}`}
    >
      <span className={textClassName}>{initial}</span>
    </div>
  );
}

function ProfileDropdownMenu({ user, isOpen, onClose, onOpenSettings, onLogout, align = "right", containerRef }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose, containerRef]);

  if (!isOpen) return null;

  const handleSettings = () => {
    onOpenSettings?.();
    onClose();
  };

  const handleLogout = () => {
    onLogout?.();
    onClose();
  };

  return (
    <div
      className={`absolute top-[calc(100%+8px)] z-50 w-64 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/25 shadow-2xl shadow-black/20 overflow-hidden animate-fade-in ${
        align === "right" ? "right-0" : "left-0"
      }`}
      role="menu"
      aria-label="Account menu"
    >
      <div className="px-4 py-3.5 border-b border-white/15 bg-white/5">
        <div className="flex items-center gap-3">
          <UserAvatar user={user} className="w-10 h-10 rounded-full shrink-0" textClassName="text-sm" />
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user.name}</p>
            <p className="text-white/55 text-xs truncate">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="p-1.5">
        <button
          type="button"
          role="menuitem"
          onClick={handleSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/85 hover:text-white hover:bg-white/10 text-sm font-medium transition-colors text-left"
        >
          <svg className="w-4 h-4 text-white/50 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Account Settings
        </button>

        <button
          type="button"
          role="menuitem"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 text-sm font-medium transition-colors text-left mt-0.5"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  );
}

function ProfileMenuTrigger({ user, compact = false, onOpenSettings, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const firstName = getUserFirstName(user.name);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Account menu for ${user.name}`}
        className={`flex items-center gap-2 transition-all hover:bg-white/15 ${
          compact
            ? "p-0 rounded-xl"
            : "px-2.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20"
        } ${isOpen ? "ring-2 ring-white/20" : ""}`}
      >
        <UserAvatar user={user} className={`${compact ? "w-9 h-9 rounded-xl" : "w-8 h-8 rounded-full"} shrink-0`} textClassName={compact ? "text-sm" : "text-xs"} />
        {!compact && (
          <>
            <span className="text-white text-sm font-medium max-w-[120px] truncate">{firstName}</span>
            <svg
              className={`w-3.5 h-3.5 text-white/50 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      <ProfileDropdownMenu
        user={user}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onOpenSettings={onOpenSettings}
        onLogout={onLogout}
        align="right"
        containerRef={containerRef}
      />
    </div>
  );
}

function GenericProfileIcon() {
  return (
    <button
      type="button"
      aria-label="Account"
      className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-colors"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    </button>
  );
}

export default function Header({
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  onViewAll,
  onSignUp,
  onLogout,
  onOpenSettings,
  onMenuOpen,
  isMenuOpen = false,
  user,
  isAgentsView = false,
  isSettingsView = false,
  isListingsView = false,
}) {
  const isLoggedIn = Boolean(user);
  const hideFilters = isAgentsView || isSettingsView || isListingsView;

  return (
    <header className="dashboard-header shrink-0 px-5 md:px-7 py-4 border-b border-white/20 bg-white/10 backdrop-blur-xl">
      <div className="flex flex-col xl:flex-row xl:items-center gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0 w-full">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => onMenuOpen?.()}
              className="md:hidden relative z-20 shrink-0 p-2.5 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white/80 hover:text-white hover:bg-white/15 active:bg-white/20 transition-colors touch-manipulation"
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div className="min-w-0 flex-1">
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Estatery Dashboard</p>
              <h1 className="font-[family-name:var(--font-display)] text-xl md:text-2xl font-bold text-white tracking-tight truncate">
                Explore Properties
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto xl:hidden">
            {!isLoggedIn && (
              <button
                type="button"
                onClick={onSignUp}
                className="xl:hidden px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-sm font-semibold transition-colors"
              >
                Sign Up
              </button>
            )}
            {isLoggedIn && (
              <div className="xl:hidden">
                <ProfileMenuTrigger
                  user={user}
                  compact
                  onOpenSettings={onOpenSettings}
                  onLogout={onLogout}
                />
              </div>
            )}
            <button
              onClick={onViewAll}
              className="xl:hidden px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
            >
              View All
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col sm:flex-row gap-3 min-w-0">
          {!hideFilters && (
          <>
          <div className="flex-1 relative min-w-0">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={isAgentsView ? "Search Agents..." : "Search Location..."}
              className="dashboard-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>

          {!isAgentsView && (
          <select
            value={priceRange}
            onChange={(e) => onPriceRangeChange(e.target.value)}
            className="dashboard-input sm:w-44 px-3 py-2.5 rounded-xl text-sm cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27rgba(255,255,255,0.6)%27 stroke-width=%272%27%3e%3cpath stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M19 9l-7 7-7-7%27/%3e%3c/svg%3e')] bg-[length:16px] bg-[right_10px_center] bg-no-repeat"
          >
            {PRICE_RANGES.map((range, i) => (
              <option key={range.label} value={i} className="bg-[#0d2418] text-white">
                {range.label}
              </option>
            ))}
          </select>
          )}
          </>
          )}
        </div>

        <div className="hidden xl:flex items-center gap-2.5 shrink-0">
          {!isLoggedIn && (
            <button
              type="button"
              onClick={onSignUp}
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              Sign Up
            </button>
          )}
          {isLoggedIn ? (
            <ProfileMenuTrigger user={user} onOpenSettings={onOpenSettings} onLogout={onLogout} />
          ) : (
            <GenericProfileIcon />
          )}
          <button
            onClick={onViewAll}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
          >
            View All
          </button>
        </div>
      </div>
    </header>
  );
}
