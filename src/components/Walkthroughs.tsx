
import { Footprints, Calendar, Clock, Plus, Filter, Search, CheckCircle2, AlertCircle, MapPin, User, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { IFSWalkthrough } from '../types';

const BEREICHE = [
  "Produktion Linie 1 (Frischbrot)",
  "Produktion Linie 2 (Gemischt)",
  "Produktion Linie 3 (TK-Produkte)",
  "Produktion Linie 4 (Bio)",
  "Wareneingang / Lager",
  "Verpackung",
  "Sozialräume / Umkleide",
  "Außenbereiche"
];

const MOCK_WALKTHROUGHS: IFSWalkthrough[] = [
  {
    id: 'w1',
    area: "Produktion Linie 1 (Frischbrot)",
    date: "2026-05-10",
    shift: "Früh",
    auditor: "T. M. Nuri",
    topics: ["Gebäudezustand", "Hygiene Personal"],
    findings: "Leichte Mehlstaubablagerungen auf den Lüftungsrohren.",
    actionRequired: true,
    actionDetails: "Reinigung der Rohre veranlassen",
    responsible: "Anlagenführer L1",
    deadline: "2026-05-11"
  },
  {
    id: 'w2',
    area: "Sozialräume / Umkleide",
    date: "2026-04-12",
    shift: "Spät",
    auditor: "S. Schmidt",
    topics: ["Hygiene Personal", "Gebäudezustand"],
    findings: "Alles in Ordnung.",
    actionRequired: false
  }
];

export default function Walkthroughs() {
  const [showModal, setShowModal] = useState(false);

  const lastWalkthroughs = useMemo(() => {
    const map: Record<string, string> = {};
    MOCK_WALKTHROUGHS.forEach(w => {
      if (!map[w.area] || new Date(w.date) > new Date(map[w.area])) {
        map[w.area] = w.date;
      }
    });
    return map;
  }, []);

  return (
    <div className="p-10 md:p-16 max-w-7xl mx-auto space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 pb-10 border-b border-surface-200">
        <div className="space-y-4">
          <h2 className="text-6xl font-display font-black tracking-tight text-surface-900 leading-none">Begehungen</h2>
          <p className="micro-label">Regelmäßige Betriebsbegehungen &bull; IFS §5.2.1</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary-600 text-white px-8 py-4 rounded-2xl micro-label hover:bg-black transition-all shadow-xl shadow-primary-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} />
          NEUE BEGEHUNG
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BEREICHE.slice(0, 4).map(area => {
          const lastDate = lastWalkthroughs[area];
          const daysSince = lastDate ? Math.floor((new Date().getTime() - new Date(lastDate).getTime()) / 86400000) : 999;
          const isCritical = daysSince > 30;

          return (
            <div key={area} className={`p-8 rounded-[32px] border ${isCritical ? 'bg-red-50 border-red-100' : 'bg-surface-50 border-surface-100'} space-y-4`}>
              <p className="micro-label !text-surface-400 leading-tight h-8 line-clamp-2">{area}</p>
              <div>
                 <p className={`text-2xl font-display font-black ${isCritical ? 'text-red-600' : 'text-surface-900'}`}>
                   {lastDate ? `${daysSince} Tage` : 'NIE'}
                 </p>
                 <p className="micro-label !text-surface-400">Seit letzter Begehung</p>
              </div>
              {isCritical && (
                <div className="flex items-center gap-2 text-red-600 font-black text-[9px] uppercase animate-pulse">
                  <AlertCircle size={12} />
                  Handlungsbedarf
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
           <h3 className="text-xl font-display font-black uppercase tracking-tight text-surface-900">Letzte Befunde</h3>
           <div className="h-px flex-1 bg-surface-200"></div>
        </div>

        <div className="grid gap-6">
          {MOCK_WALKTHROUGHS.map(w => (
            <div key={w.id} className="bg-white border border-surface-200 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row gap-10">
               <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-mono font-bold text-surface-400">{new Date(w.date).toLocaleDateString()}</span>
                     <span className="bg-surface-100 text-surface-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{w.shift}schicht</span>
                     <h4 className="font-display font-bold text-lg text-surface-900 uppercase tracking-tight">{w.area}</h4>
                  </div>
                  
                  <div className="space-y-4">
                     <p className="text-sm font-medium text-surface-600 leading-relaxed italic border-l-2 border-surface-100 pl-4">
                       {w.findings}
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {w.topics.map(t => (
                          <span key={t} className="text-[9px] font-black uppercase text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">{t}</span>
                        ))}
                     </div>
                  </div>

                  <div className="flex gap-10">
                     <div className="flex items-center gap-2">
                        <User size={14} className="text-surface-300" />
                        <span className="text-xs font-bold text-surface-500">{w.auditor}</span>
                     </div>
                     {w.actionRequired && (
                        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-xl ring-1 ring-orange-200">
                           <AlertCircle size={14} />
                           <span className="text-[10px] font-black uppercase">Maßnahme erfasst</span>
                        </div>
                     )}
                     {!w.actionRequired && (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">
                           <CheckCircle2 size={14} />
                           <span className="text-[10px] font-black uppercase">Konform</span>
                        </div>
                     )}
                  </div>
               </div>
               <div className="flex items-center">
                  <button className="p-4 bg-surface-50 hover:bg-primary-600 hover:text-white rounded-2xl transition-all">
                     <ChevronRight size={20} />
                  </button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
