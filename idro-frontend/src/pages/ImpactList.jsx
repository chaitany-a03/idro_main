import { MapPin, BarChart3, TriangleAlert, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { idroApi } from "../services/api";

export default function ImpactList() {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDisasters = async (isInitial = false) => {
      try {
        if (isInitial) setLoading(true);
        const res = await idroApi.getAlerts();
        const normalized = res.data.map(item => ({ ...item, id: item.id || item._id }));
        setDisasters(normalized.filter(d => d.missionStatus === 'OPEN'));
        setError(null);
      } catch (err) {
        setError("Unable to connect to server.");
      } finally {
        if (isInitial) setLoading(false);
      }
    };
    fetchDisasters(true);
    const interval = setInterval(() => fetchDisasters(false), 3000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityTheme = (magnitude) => {
    const m = magnitude?.toLowerCase();
    if (m === 'critical' || m === 'extreme')
      return {
        card: 'border-red-500/60 bg-red-950/25',
        hoverCard: 'hover:border-red-400 hover:bg-red-950/40',
        glow: 'shadow-[0_0_40px_rgba(239,68,68,0.15),inset_0_0_40px_rgba(239,68,68,0.03)]',
        strip: 'bg-gradient-to-b from-red-400 to-red-700',
        stripGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.8)]',
        severityText: 'text-red-400',
        hoverTitle: 'group-hover:text-red-300',
        badge: 'bg-red-500/20 border border-red-500/50 text-red-300',
        dot: 'bg-red-500',
        dotGlow: 'shadow-[0_0_12px_rgba(239,68,68,1)]',
        label: 'CRITICAL',
        scanline: 'from-red-500/5',
      };
    if (m === 'high')
      return {
        card: 'border-rose-500/60 bg-rose-950/25',
        hoverCard: 'hover:border-rose-400 hover:bg-rose-950/40',
        glow: 'shadow-[0_0_40px_rgba(244,63,94,0.15),inset_0_0_40px_rgba(244,63,94,0.03)]',
        strip: 'bg-gradient-to-b from-rose-400 to-rose-700',
        stripGlow: 'shadow-[0_0_15px_rgba(244,63,94,0.8)]',
        severityText: 'text-rose-400',
        hoverTitle: 'group-hover:text-rose-300',
        badge: 'bg-rose-500/20 border border-rose-500/50 text-rose-300',
        dot: 'bg-rose-500',
        dotGlow: 'shadow-[0_0_12px_rgba(244,63,94,1)]',
        label: 'HIGH',
        scanline: 'from-rose-500/5',
      };
    if (m === 'moderate' || m === 'medium' || m === 'orange')
      return {
        card: 'border-orange-500/60 bg-orange-950/25',
        hoverCard: 'hover:border-orange-400 hover:bg-orange-950/40',
        glow: 'shadow-[0_0_40px_rgba(249,115,22,0.15),inset_0_0_40px_rgba(249,115,22,0.03)]',
        strip: 'bg-gradient-to-b from-orange-400 to-orange-700',
        stripGlow: 'shadow-[0_0_15px_rgba(249,115,22,0.8)]',
        severityText: 'text-orange-400',
        hoverTitle: 'group-hover:text-orange-300',
        badge: 'bg-orange-500/20 border border-orange-500/50 text-orange-300',
        dot: 'bg-orange-500',
        dotGlow: 'shadow-[0_0_12px_rgba(249,115,22,1)]',
        label: 'MODERATE',
        scanline: 'from-orange-500/5',
      };
    if (m === 'low' || m === 'watch' || m === 'minor')
      return {
        card: 'border-green-500/60 bg-green-950/25',
        hoverCard: 'hover:border-green-400 hover:bg-green-950/40',
        glow: 'shadow-[0_0_40px_rgba(34,197,94,0.12),inset_0_0_40px_rgba(34,197,94,0.03)]',
        strip: 'bg-gradient-to-b from-green-400 to-green-700',
        stripGlow: 'shadow-[0_0_15px_rgba(34,197,94,0.8)]',
        severityText: 'text-green-400',
        hoverTitle: 'group-hover:text-green-300',
        badge: 'bg-green-500/20 border border-green-500/50 text-green-300',
        dot: 'bg-green-500',
        dotGlow: 'shadow-[0_0_12px_rgba(34,197,94,1)]',
        label: 'LOW',
        scanline: 'from-green-500/5',
      };
    return {
      card: 'border-emerald-500/50 bg-emerald-950/15',
      hoverCard: 'hover:border-emerald-400 hover:bg-emerald-950/30',
      glow: 'shadow-[0_0_30px_rgba(16,185,129,0.10),inset_0_0_40px_rgba(16,185,129,0.02)]',
      strip: 'bg-gradient-to-b from-emerald-400 to-emerald-700',
      stripGlow: 'shadow-[0_0_15px_rgba(16,185,129,0.8)]',
      severityText: 'text-emerald-400',
      hoverTitle: 'group-hover:text-emerald-300',
      badge: 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300',
      dot: 'bg-emerald-500',
      dotGlow: 'shadow-[0_0_12px_rgba(16,185,129,1)]',
      label: 'STABLE',
      scanline: 'from-emerald-500/5',
    };
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <style>{`
        @keyframes radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .radar-sweep { animation: radar-sweep 2s linear infinite; transform-origin: 50% 50%; }
      `}</style>
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
        <div className="absolute inset-3 rounded-full border border-emerald-500/15" />
        <div className="absolute inset-6 rounded-full border border-emerald-500/10" />
        <div className="radar-sweep absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute top-0 left-1/2 w-0 h-12 origin-bottom"
            style={{ background: 'linear-gradient(to top, rgba(16,185,129,0.6), transparent)', width: '2px', transform: 'translateX(-50%)' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,1)]" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-emerald-400 font-mono text-[10px] tracking-[0.5em] uppercase animate-pulse">Scanning Impact Data</p>
        <p className="text-zinc-700 font-mono text-[9px] tracking-[0.3em] uppercase mt-1">Establishing Secure Uplink...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          92% { opacity: 1; }
          93% { opacity: 0.85; }
          94% { opacity: 1; }
        }
        @keyframes alert-breathe {
          0%, 100% { box-shadow: 0 0 20px rgba(239,68,68,0.2); }
          50% { box-shadow: 0 0 40px rgba(239,68,68,0.5), 0 0 80px rgba(239,68,68,0.1); }
        }
        @keyframes slide-in-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .card-enter { animation: slide-in-up 0.5s ease forwards; }
        .flicker { animation: flicker 8s infinite; }
      `}</style>

      {/* Animated scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden opacity-[0.03]"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)' }}>
      </div>

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-14 py-12">
        <div className="mb-12 flex flex-col gap-2 border-l-4 border-white pl-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <BarChart3 size={16} className="text-white/80" />
            </div>
            <p className="text-white/60 font-mono text-[9px] tracking-[0.45em] uppercase font-black">
              IDRO // STRATEGIC INFRASTRUCTURE
            </p>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-white uppercase leading-none flicker">
            Impact Analyzer
          </h1>
        </div>

        {error && (
          <div className="flex items-center gap-3 mb-8 px-4 py-3 border border-red-500/30 bg-red-950/20 rounded z-20 relative">
            <span className="text-red-300 text-sm font-medium">{error}</span>
          </div>
        )}

        {disasters.length === 0 && !error ? (
          <div className="py-32 flex flex-col items-center gap-4 border border-white/5">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 flex items-center justify-center">
              <ShieldAlert size={28} className="text-emerald-500/40" />
            </div>
            <p className="text-zinc-600 font-black uppercase tracking-[0.4em] text-xs">All Clear — No Active Threats</p>
            <p className="text-zinc-800 font-mono text-[9px] tracking-widest uppercase">System Nominal</p>
          </div>
        ) : (
          <div className="space-y-5">
            {disasters.map((d, idx) => {
              const theme = getSeverityTheme(d.magnitude);
              return (
                <div
                  key={d.id}
                  className={`card-enter cursor-pointer border relative overflow-hidden transition-all duration-300 group ${theme.card} ${theme.hoverCard} ${theme.glow}`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                  onClick={() => navigate(`/impact-analysis/${d.id}`)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.scanline} via-transparent to-transparent pointer-events-none`} />
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.strip} ${theme.stripGlow}`} />

                  <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none transition-all duration-500 group-hover:opacity-[0.07]">
                    <TriangleAlert size={160} className="text-white" />
                  </div>

                  <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-6 pl-10">
                    <div className="flex items-start gap-6 flex-1 min-w-0">
                      <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-1">
                        <div className={`w-3 h-3 rounded-full ${theme.dot} ${theme.dotGlow}`} />
                        <div className={`w-3 h-3 rounded-full ${theme.dot} opacity-30 animate-ping absolute`} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-zinc-700 font-mono text-[9px] tracking-[0.4em] uppercase">
                            #{String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className={`px-3 py-1 font-mono text-[9px] tracking-[0.35em] uppercase font-black rounded ${theme.badge}`}>
                            {theme.label}
                          </div>
                        </div>

                        <h2 className={`text-3xl md:text-4xl font-black text-white uppercase tracking-tight leading-none mb-3 transition-colors duration-300 ${theme.hoverTitle}`}>
                          {d.type || "UNKNOWN"}
                        </h2>

                        <div className="flex items-center gap-2 max-w-2xl">
                          <div className="w-6 h-[1px] bg-zinc-700 flex-shrink-0" />
                          <MapPin size={12} className="text-zinc-600 flex-shrink-0" />
                          <p className="text-[12px] text-zinc-500 font-bold uppercase tracking-[0.12em] leading-relaxed truncate">
                            {d.location || "Unknown Location"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-stretch gap-0 flex-shrink-0">
                      <div className="px-10 border-l border-zinc-800/80 flex flex-col items-end justify-center gap-1.5">
                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.4em]">Severity</span>
                        <span className={`text-2xl font-black uppercase tracking-[0.15em] ${theme.severityText}`}>
                          {d.magnitude || "UNKNOWN"}
                        </span>
                      </div>

                      <div className="px-10 border-l border-zinc-800/80 flex flex-col items-end justify-center gap-1.5 min-w-[140px]">
                        <span className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.4em]">Affected</span>
                        <span className="text-3xl font-black tabular-nums leading-none text-white">
                          {(d.affectedCount || 0).toLocaleString()}
                        </span>
                      </div>

                      <div className="px-8 border-l border-zinc-800/80 flex items-center justify-center">
                        <div className="px-4 py-2 font-black text-[10px] uppercase tracking-[0.2em] rounded border border-white/10 group-hover:bg-white/5 transition-colors">
                          Open Analysis
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-1.5 right-0 h-[2px] bg-white/5">
                    <div
                      className={`h-full ${theme.strip} opacity-40 transition-all duration-1000`}
                      style={{ width: d.magnitude?.toLowerCase() === 'critical' ? '100%' : d.magnitude?.toLowerCase() === 'high' ? '75%' : d.magnitude?.toLowerCase() === 'moderate' ? '50%' : '30%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}