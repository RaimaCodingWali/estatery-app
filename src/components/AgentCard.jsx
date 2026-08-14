export default function AgentCard({ agent, onCall, onMessage }) {
  const listingsLabel =
    agent.listingsCount === 1 ? "1 Property Listed" : `${agent.listingsCount} Properties Listed`;

  return (
    <article className="agent-card group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl bg-white/20 backdrop-blur-xl border border-white/20 shadow-2xl rounded-[20px] overflow-hidden">
      <div className="p-5 md:p-6 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-[88px] h-[88px] rounded-full object-cover object-center aspect-square border-[3px] border-white/40 shadow-lg ring-2 ring-white/10"
            loading="lazy"
            draggable="false"
          />
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white/80" aria-hidden="true" />
        </div>

        <h3 className="text-white font-semibold text-[16px] leading-snug mb-0.5">{agent.name}</h3>
        <p className="text-emerald-200/90 text-sm font-medium mb-2">{agent.title}</p>
        <p className="text-white/65 text-sm mb-0.5">{agent.agency}</p>
        <p className="text-white/50 text-xs mb-5">{listingsLabel}</p>

        <div className="flex gap-2.5 w-full">
          <button
            type="button"
            onClick={() => onCall(agent)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors shadow-md shadow-emerald-900/20"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
              />
            </svg>
            Call
          </button>
          <button
            type="button"
            onClick={() => onMessage(agent)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-white text-sm font-semibold transition-colors"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
              />
            </svg>
            Message
          </button>
        </div>
      </div>
    </article>
  );
}
