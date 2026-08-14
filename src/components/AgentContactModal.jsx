import { useEffect, useState } from "react";

function PulseRings() {
  return (
    <>
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="call-pulse-ring absolute inset-0 rounded-full border-2 border-emerald-400/60"
          style={{ animationDelay: `${index * 0.7}s` }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

function formatCallDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function CallControlButton({ active, label, onClick, children, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={`flex flex-col items-center gap-1.5 transition-colors ${
        danger ? "" : "text-white/70 hover:text-white"
      }`}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
          danger
            ? "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30"
            : active
              ? "bg-white/25 text-white border border-white/30"
              : "bg-white/10 text-white/80 border border-white/15 hover:bg-white/20"
        }`}
      >
        {children}
      </span>
      <span className={`text-[11px] font-medium ${danger ? "text-red-300" : "text-white/55"}`}>{label}</span>
    </button>
  );
}

function ActiveCallScreen({ agent, callPhase, elapsed, muted, speaker, onToggleMute, onToggleSpeaker, onEndCall }) {
  const isConnected = callPhase === "connected";

  return (
    <div className="relative px-8 py-10 text-center">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent" />

      <div className="relative mx-auto mb-6 flex h-36 w-36 items-center justify-center">
        {(callPhase === "ringing" || isConnected) && <PulseRings />}
        <img
          src={agent.avatar}
          alt={agent.name}
          className="relative z-10 h-28 w-28 rounded-full object-cover ring-4 ring-emerald-400/50 ring-offset-4 ring-offset-[#0d2418]/90"
        />
      </div>

      {callPhase === "ringing" ? (
        <p className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
          </span>
          Calling...
        </p>
      ) : (
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Call Connected
        </p>
      )}

      <h2 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-white">{agent.name}</h2>
      <p className="mt-1 text-sm text-white/65">{agent.title}</p>
      <p className="mt-1 text-xs text-white/45">{agent.agency}</p>

      <p className="mt-5 font-mono text-lg tracking-widest text-white/80 tabular-nums">
        {isConnected ? formatCallDuration(elapsed) : agent.phone}
      </p>
      {isConnected && <p className="mt-1 text-xs text-white/40">Duration</p>}

      <div className="mt-8 flex items-end justify-center gap-6">
        <CallControlButton active={muted} label={muted ? "Unmute" : "Mute"} onClick={onToggleMute}>
          {muted ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M9 9v3.375c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 013 13.125V9.75m9 0V6.375A1.125 1.125 0 0113.125 5.25h2.25A1.125 1.125 0 0116.5 6.375V9.75m-9 0h9" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6.75 6.75 0 006.75-6.75V4.5a.75.75 0 00-1.5 0v7.5a5.25 5.25 0 01-10.5 0V4.5a.75.75 0 00-1.5 0v7.5a6.75 6.75 0 006.75 6.75z" />
            </svg>
          )}
        </CallControlButton>

        <CallControlButton active={speaker} label="Speaker" onClick={onToggleSpeaker}>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.594-.705-1.594-1.563V9.813c0-.858.714-1.563 1.594-1.563H6.75z" />
          </svg>
        </CallControlButton>

        <CallControlButton label="End Call" onClick={onEndCall} danger>
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 rotate-[135deg]">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.56.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.56 1 1 0 01-.25 1.01l-2.2 2.22z" />
          </svg>
        </CallControlButton>
      </div>
    </div>
  );
}

export default function AgentContactModal({ isOpen, onClose, mode, agent, onSubmit, autoStartCall = false }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [callPhase, setCallPhase] = useState("preview");
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);

  useEffect(() => {
    if (isOpen && mode === "message" && agent) {
      setForm({
        name: "",
        email: "",
        phone: "",
        message: `Hi ${agent.name}, I'd like to discuss luxury properties with you. Please get in touch at your earliest convenience.`,
      });
    }
  }, [isOpen, mode, agent]);

  useEffect(() => {
    if (!isOpen || mode !== "call") {
      setCallPhase("preview");
      setElapsed(0);
      setMuted(false);
      setSpeaker(false);
      return;
    }

    setCallPhase(autoStartCall ? "ringing" : "preview");
    setElapsed(0);
    setMuted(false);
    setSpeaker(false);
  }, [isOpen, mode, agent?.id, autoStartCall]);

  useEffect(() => {
    if (callPhase !== "ringing") return undefined;

    const connectTimer = setTimeout(() => setCallPhase("connected"), 2800);
    return () => clearTimeout(connectTimer);
  }, [callPhase]);

  useEffect(() => {
    if (callPhase !== "connected") return undefined;

    const interval = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [callPhase]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (mode === "call" && callPhase !== "preview") {
          onClose();
        } else if (mode !== "call" || callPhase === "preview") {
          onClose();
        }
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, mode, callPhase]);

  if (!isOpen || !agent) return null;

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl bg-white/70 border border-black/8 text-charcoal placeholder:text-charcoal-faint text-sm focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/15 transition-all";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form, agent);
    onClose();
  };

  const startCall = () => setCallPhase("ringing");

  const endCall = () => onClose();

  const isActiveCall = mode === "call" && callPhase !== "preview";
  const phoneDigits = agent.phone.replace(/\D/g, "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 backdrop-blur-sm ${
          isActiveCall ? "bg-[#0d2418]/85" : "bg-charcoal/30"
        }`}
        onClick={isActiveCall ? undefined : onClose}
        aria-hidden="true"
      />

      {mode === "call" && isActiveCall ? (
        <div className="call-modal-enter relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-white/20 bg-[#0d2418]/90 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <ActiveCallScreen
            agent={agent}
            callPhase={callPhase}
            elapsed={elapsed}
            muted={muted}
            speaker={speaker}
            onToggleMute={() => setMuted((m) => !m)}
            onToggleSpeaker={() => setSpeaker((s) => !s)}
            onEndCall={endCall}
          />
        </div>
      ) : (
        <div className="relative modal-panel rounded-2xl w-full max-w-md animate-modal-in overflow-hidden">
          <div className="px-6 py-4 border-b border-black/6 flex items-center justify-between">
            <div>
              <h2 className="text-charcoal font-semibold text-lg">
                {mode === "call" ? "Contact Agent" : "Message Agent"}
              </h2>
              <p className="text-charcoal-muted text-sm mt-0.5">
                {agent.name} · {agent.title}
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

          {mode === "call" ? (
            <div className="p-6 text-center">
              <img
                src={agent.avatar}
                alt=""
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-emerald-400/40 shadow-md ring-2 ring-emerald-400/20"
              />
              <h3 className="text-charcoal font-semibold text-lg">{agent.name}</h3>
              <p className="text-charcoal-muted text-sm">{agent.title}</p>
              <p className="text-charcoal-faint text-xs mt-1 mb-3">{agent.agency}</p>
              <p className="text-charcoal-muted text-sm mb-1">Direct line</p>
              <p className="text-charcoal font-bold text-xl tracking-tight">{agent.phone}</p>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={startCall}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  Call Now
                </button>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(agent.phone)}
                  className="flex-1 py-3 rounded-xl bg-white/60 border border-black/8 text-charcoal font-semibold text-sm hover:bg-white/80 transition-colors"
                >
                  Copy Number
                </button>
              </div>
              <a href={`tel:${phoneDigits}`} className="sr-only">
                Dial {agent.phone}
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Your Name</label>
                <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Your name" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="you@email.com" />
                </div>
                <div>
                  <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Phone</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} placeholder="(555) 123-4567" />
                </div>
              </div>
              <div>
                <label className="block text-charcoal-muted text-xs font-medium mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={`${inputClass} resize-none`}
                  placeholder={`Write a message to ${agent.name}...`}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-900/15 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
