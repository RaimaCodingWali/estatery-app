import { useEffect, useMemo, useRef, useState } from "react";
import HeroSection from "./components/HeroSection";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import PropertyCard from "./components/PropertyCard";
import AgentsView from "./components/AgentsView";
import ListingsView from "./components/ListingsView";
import Modal from "./components/Modal";
import AddListingModal from "./components/AddListingModal";
import AddPaymentMethodModal from "./components/AddPaymentMethodModal";
import UpgradeModal from "./components/UpgradeModal";
import AgentContactModal from "./components/AgentContactModal";
import AccountSettingsView, { loadSettings, saveSettings } from "./components/AccountSettingsView";
import SignUpModal from "./components/SignUpModal";
import { INITIAL_PROPERTIES, PRICE_RANGES } from "./data/properties";
import { AGENTS } from "./data/agents";
import { loadUser, saveUser, clearUser } from "./utils/auth";
import { createListing, loadUserListings, saveUserListings } from "./utils/listings";
import { DEFAULT_PAYMENT_METHODS } from "./utils/paymentMethods";

export default function App() {
  const dashboardRef = useRef(null);
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [userListings, setUserListings] = useState(() => loadUserListings());
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("0");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, mode: "inquiry", property: null });
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradePaymentModalOpen, setUpgradePaymentModalOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(() => loadSettings().isPremium || false);
  const [paymentMethods, setPaymentMethods] = useState(
    () => loadSettings().paymentMethods || [...DEFAULT_PAYMENT_METHODS]
  );
  const [agentModal, setAgentModal] = useState({ isOpen: false, mode: "call", agent: null, autoStartCall: false });
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const stored = loadUser();
    if (!stored) return null;
    const settings = loadSettings();
    return { ...stored, avatarUrl: settings.avatarUrl || stored.avatarUrl || "" };
  });

  const isAgentsView = activeNav === "agents";
  const isSettingsView = activeNav === "settings";
  const isListingsView = activeNav === "listings";
  const isPropertyView = !isAgentsView && !isSettingsView && !isListingsView;

  const catalogProperties = useMemo(
    () => [...userListings, ...properties],
    [userListings, properties]
  );

  const filterProperties = (source) => {
    const range = PRICE_RANGES[Number(priceRange)];
    const query = searchQuery.toLowerCase().trim();

    return source.filter((p) => {
      const matchesSearch =
        !query ||
        p.title.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query);
      const matchesPrice = p.price >= range.min && p.price <= range.max;
      const matchesFavorites = activeNav !== "favorites" || favorites.has(p.id);
      return matchesSearch && matchesPrice && matchesFavorites;
    });
  };

  const filteredProperties = useMemo(() => {
    if (!isPropertyView) return [];
    return filterProperties(catalogProperties);
  }, [catalogProperties, searchQuery, priceRange, activeNav, favorites, isPropertyView]);

  const filteredUserListings = useMemo(() => {
    if (!isListingsView) return [];
    return filterProperties(userListings);
  }, [userListings, searchQuery, priceRange, isListingsView, favorites, activeNav]);

  const filteredAgents = useMemo(() => {
    if (!isAgentsView) return [];

    const query = searchQuery.toLowerCase().trim();
    if (!query) return AGENTS;

    return AGENTS.filter(
      (agent) =>
        agent.name.toLowerCase().includes(query) ||
        agent.title.toLowerCase().includes(query) ||
        agent.agency.toLowerCase().includes(query)
    );
  }, [searchQuery, isAgentsView]);

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    if (!sidebarOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleOpenSidebar = () => setSidebarOpen(true);
  const handleCloseSidebar = () => setSidebarOpen(false);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openInquiry = (property) => {
    setModal({ isOpen: true, mode: "inquiry", property });
  };

  const closeModal = () => {
    setModal({ isOpen: false, mode: "inquiry", property: null });
  };

  const closeAgentModal = () => {
    setAgentModal({ isOpen: false, mode: "call", agent: null, autoStartCall: false });
  };

  const openAgentCall = (agent) => {
    setAgentModal({ isOpen: true, mode: "call", agent, autoStartCall: true });
  };

  const openAgentMessage = (agent) => {
    setAgentModal({ isOpen: true, mode: "message", agent });
  };

  const handleAgentMessageSubmit = () => {
    // Message sent — modal closes via AgentContactModal
  };

  const handleSignUp = (form) => {
    const newUser = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone?.trim() || "",
    };
    saveUser(newUser);
    setUser(newUser);
  };

  const handleUpdateProfile = (profile) => {
    const updated = { ...user, ...profile };
    saveUser(updated);
    setUser(updated);
    const settings = loadSettings();
    saveSettings({ ...settings, avatarUrl: updated.avatarUrl || "" });
  };

  const handleAvatarChange = (avatarUrl) => {
    if (!user) return;
    const updated = { ...user, avatarUrl: avatarUrl || "" };
    saveUser(updated);
    setUser(updated);
    const settings = loadSettings();
    saveSettings({ ...settings, avatarUrl: avatarUrl || "" });
  };

  const handleLogout = () => {
    clearUser();
    setUser(null);
  };

  const handleModalSubmit = () => {
    // Purchase / inquiry actions handled in Modal
  };

  const handlePublishListing = (data) => {
    const listing = createListing(data);
    const updated = [listing, ...userListings];
    setUserListings(updated);
    saveUserListings(updated);
  };

  const refreshPaymentMethods = () => {
    const settings = loadSettings();
    setPaymentMethods(settings.paymentMethods || [...DEFAULT_PAYMENT_METHODS]);
  };

  const handleUpgradeClick = () => {
    refreshPaymentMethods();
    setUpgradeModalOpen(true);
  };

  const handleUpgradeConfirm = async () => {
    const settings = loadSettings();
    saveSettings({
      ...settings,
      isPremium: true,
      premiumSince: Date.now(),
    });
    setIsPremium(true);
  };

  const handleUpgradeAddPayment = (card) => {
    const settings = loadSettings();
    const newMethod = {
      id: `pm_${Date.now()}`,
      brand: card.brand,
      last4: card.last4,
      expiry: card.expiry,
      cardholderName: card.cardholderName,
      isDefault: card.isDefault,
    };
    const updated = card.isDefault
      ? [newMethod, ...(settings.paymentMethods || []).map((m) => ({ ...m, isDefault: false }))]
      : [...(settings.paymentMethods || []), newMethod];
    saveSettings({ ...settings, paymentMethods: updated });
    setPaymentMethods(updated);
    setUpgradePaymentModalOpen(false);
  };

  const sectionTitle =
    activeNav === "settings"
      ? "Account Settings"
      : activeNav === "agents"
        ? "Our Real Estate Agents"
        : activeNav === "favorites"
          ? "Your Favorites"
          : activeNav === "listings"
            ? "My Listings"
            : "Featured Properties";

  const sectionSubtitle = isSettingsView
    ? "Manage your profile, security, and preferences"
    : isListingsView
      ? filteredUserListings.length === 0
        ? "List your property and reach buyers on Estatery"
        : `${filteredUserListings.length} published listing${filteredUserListings.length === 1 ? "" : "s"}`
    : isAgentsView
      ? `${filteredAgents.length} agent${filteredAgents.length === 1 ? "" : "s"} available`
      : `${filteredProperties.length} propert${filteredProperties.length === 1 ? "y" : "ies"} found${searchQuery && isPropertyView ? ` for "${searchQuery}"` : ""}`;

  return (
    <>
      <div className="leaves-background" aria-hidden="true" />

      <HeroSection onExplore={scrollToDashboard} />

      <section
        id="dashboard"
        ref={dashboardRef}
        className="dashboard-section min-h-screen min-h-dvh flex items-stretch justify-center px-4 md:px-6 lg:px-8 py-4 md:py-8"
      >
        <div className="dashboard-panel w-full max-w-[1400px] h-[calc(100dvh-2rem)] md:h-[min(920px,calc(100dvh-4rem))] max-h-[calc(100dvh-2rem)] md:max-h-[min(920px,calc(100dvh-4rem))] flex rounded-[28px] overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <Sidebar
            activeNav={activeNav}
            onNavChange={setActiveNav}
            isPremium={isPremium}
            onUpgradeClick={handleUpgradeClick}
            isMobileOpen={sidebarOpen}
            onMobileClose={handleCloseSidebar}
          />

          <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-transparent">
            <Header
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              onViewAll={() => setActiveNav("listings")}
              onSignUp={() => setSignUpOpen(true)}
              onLogout={handleLogout}
              onOpenSettings={() => setActiveNav("settings")}
              onMenuOpen={handleOpenSidebar}
              isMenuOpen={sidebarOpen}
              user={user}
              isAgentsView={isAgentsView}
              isSettingsView={isSettingsView}
              isListingsView={isListingsView}
            />

            <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-smooth px-5 md:px-7 py-5 pb-8 bg-transparent">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-[1.65rem] font-bold text-white leading-tight">
                    {sectionTitle}
                  </h2>
                  <p className="text-white/70 text-sm mt-1">
                    {sectionSubtitle}
                    {isAgentsView && searchQuery && ` matching "${searchQuery}"`}
                  </p>
                </div>
              </div>

              {isSettingsView ? (
                <AccountSettingsView
                  user={user}
                  onUpdateProfile={handleUpdateProfile}
                  onAvatarChange={handleAvatarChange}
                  onSignUpClick={() => setSignUpOpen(true)}
                />
              ) : isAgentsView ? (
                filteredAgents.length === 0 ? (
                  <div className="listing-card p-12 text-center">
                    <p className="text-white text-lg font-medium">No agents match your search</p>
                    <p className="text-white/70 text-sm mt-1">Try a different name or agency</p>
                  </div>
                ) : (
                  <AgentsView
                    agents={filteredAgents}
                    onCall={openAgentCall}
                    onMessage={openAgentMessage}
                  />
                )
              ) : isListingsView ? (
                filteredUserListings.length === 0 && (searchQuery || priceRange !== "0") ? (
                  <div className="listing-card p-12 text-center">
                    <p className="text-white text-lg font-medium">No listings match your search</p>
                    <p className="text-white/70 text-sm mt-1">Try adjusting your filters or search terms</p>
                  </div>
                ) : (
                  <ListingsView
                    listings={filteredUserListings}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    onPropertyClick={openInquiry}
                    onAddListing={() => setListingModalOpen(true)}
                  />
                )
              ) : filteredProperties.length === 0 ? (
                <div className="listing-card p-12 text-center">
                  <p className="text-white text-lg font-medium">No properties match your search</p>
                  <p className="text-white/70 text-sm mt-1">Try adjusting your filters or search terms</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                  {filteredProperties.map((property, i) => (
                    <div
                      key={property.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                    >
                      <PropertyCard
                        property={property}
                        isFavorite={favorites.has(property.id)}
                        onToggleFavorite={toggleFavorite}
                        onClick={() => openInquiry(property)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <AddListingModal
        isOpen={listingModalOpen}
        onClose={() => setListingModalOpen(false)}
        onSubmit={handlePublishListing}
        user={user}
      />

      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        mode={modal.mode}
        property={modal.property}
        user={user}
        onSubmit={handleModalSubmit}
      />

      <AgentContactModal
        isOpen={agentModal.isOpen}
        onClose={closeAgentModal}
        mode={agentModal.mode}
        agent={agentModal.agent}
        autoStartCall={agentModal.autoStartCall}
        onSubmit={handleAgentMessageSubmit}
      />

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        paymentMethods={paymentMethods}
        onConfirmUpgrade={handleUpgradeConfirm}
        onAddPaymentMethod={() => setUpgradePaymentModalOpen(true)}
      />

      <AddPaymentMethodModal
        isOpen={upgradePaymentModalOpen}
        onClose={() => setUpgradePaymentModalOpen(false)}
        onSubmit={handleUpgradeAddPayment}
      />

      <SignUpModal
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        onSubmit={handleSignUp}
      />
    </>
  );
}
