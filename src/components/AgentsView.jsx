import AgentCard from "./AgentCard";

export default function AgentsView({ agents, onCall, onMessage }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
      {agents.map((agent, i) => (
        <div key={agent.id} className="animate-fade-in" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
          <AgentCard agent={agent} onCall={onCall} onMessage={onMessage} />
        </div>
      ))}
    </div>
  );
}
