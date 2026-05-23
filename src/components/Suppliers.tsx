
import { Truck, ShieldCheck, AlertCircle, Search, Plus, Filter, MoreVertical, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { IFSSupplier } from '../types';

const MOCK_SUPPLIERS: IFSSupplier[] = [
  { 
    id: 's1',
    name: "Mühlenbetrieb GmbH", 
    category: "Rohware", 
    isIfsCertified: true,
    certExpiry: "2025-08-15", 
    status: "freigegeben",
    lastEvaluation: "2024-01-10",
    rawMaterials: ["Weizenmehl", "Roggenmehl"] 
  },
  { 
    id: 's2',
    name: "Backmittel Koch KG", 
    category: "Rohware", 
    isIfsCertified: true,
    certExpiry: "2025-06-01", 
    status: "freigegeben",
    lastEvaluation: "2024-02-15",
    rawMaterials: ["Backmittel", "Sesam", "Soja"] 
  },
  { 
    id: 's3',
    name: "Verpackung Nord", 
    category: "Verpackung", 
    isIfsCertified: false,
    certExpiry: null, 
    status: "in_pruefung",
    lastEvaluation: "2024-03-01",
    rawMaterials: ["Brotbeutel", "Kartonage"] 
  },
  {
    id: 's4',
    name: "Reinigungsservice Blitz",
    category: "Dienstleistung",
    isIfsCertified: false,
    certExpiry: "2024-05-01",
    status: "gesperrt",
    lastEvaluation: "2023-11-20",
    rawMaterials: ["Reinigungsservice"]
  }
];

export default function Suppliers() {
  const [search, setSearch] = useState('');

  const getLieferantStatus = (ablauf: string | null) => {
    if (!ablauf) return "rot";
    const ablaufDate = new Date(ablauf);
    const now = new Date();
    const tage = Math.floor((ablaufDate.getTime() - now.getTime()) / 86400000);
    if (tage < 0) return "rot";
    if (tage < 60) return "gelb";
    return "gruen";
  };

  const getStats = () => {
    let gruen = 0, gelb = 0, rot = 0;
    MOCK_SUPPLIERS.forEach(s => {
      const status = getLieferantStatus(s.certExpiry);
      if (s.status === 'gesperrt') rot++;
      else if (status === 'rot') rot++;
      else if (status === 'gelb') gelb++;
      else gruen++;
    });
    return { gruen, gelb, rot };
  };

  const stats = getStats();

  const filtered = useMemo(() => {
    return MOCK_SUPPLIERS.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.rawMaterials.some(rm => rm.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search]);

  return (
    <div className="p-10 md:p-16 max-w-7xl mx-auto space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 pb-10 border-b border-surface-200">
        <div className="space-y-4">
          <h2 className="text-6xl font-display font-black tracking-tight text-surface-900 leading-none">Lieferanten</h2>
          <p className="micro-label">Zertifikatsmanagement &bull; IFS §4.1.3 (KO Nr. 4)</p>
        </div>
        <button className="bg-primary-600 text-white px-8 py-4 rounded-2xl micro-label hover:bg-black transition-all shadow-xl shadow-primary-600/20 active:scale-95 flex items-center gap-2">
          <Plus size={18} />
          NEUER LIEFERANT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-emerald-50 p-10 rounded-[32px] border border-emerald-100 flex items-center justify-between group hover:shadow-lg transition-all">
          <div>
            <p className="micro-label !text-emerald-700 mb-2">Gültig</p>
            <p className="text-5xl font-display font-black text-emerald-900">{stats.gruen}</p>
          </div>
          <ShieldCheck className="text-emerald-400 group-hover:scale-110 transition-transform" size={48} />
        </div>
        <div className="bg-orange-50 p-10 rounded-[32px] border border-orange-100 flex items-center justify-between group hover:shadow-lg transition-all">
          <div>
            <p className="micro-label !text-orange-700 mb-2">Läuft bald ab</p>
            <p className="text-5xl font-display font-black text-orange-900">{stats.gelb}</p>
          </div>
          <AlertCircle className="text-orange-400 group-hover:scale-110 transition-transform" size={48} />
        </div>
        <div className="bg-red-50 p-10 rounded-[32px] border border-red-100 flex items-center justify-between group hover:shadow-lg transition-all">
          <div>
            <p className="micro-label !text-red-700 mb-2">Gesperrt / Abgelaufen</p>
            <p className="text-5xl font-display font-black text-red-900">{stats.rot}</p>
          </div>
          <AlertCircle className="text-red-400 group-hover:scale-110 transition-transform" size={48} />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
        <input 
          type="text" 
          placeholder="NACH NAME ODER ROHWARE SUCHEN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-16 pr-8 py-6 bg-white border border-surface-200 rounded-[30px] font-bold text-surface-900 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-surface-300 shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filtered.map(s => {
          const status = getLieferantStatus(s.certExpiry);
          const isGesperrt = s.status === 'gesperrt' || status === 'rot';
          const isWarning = status === 'gelb';

          return (
            <motion.div 
              layout
              key={s.id}
              className="bg-white border border-surface-200 rounded-[40px] p-10 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center relative ${
                    isGesperrt ? 'bg-red-50 text-red-600' : isWarning ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    <Truck size={32} />
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${
                       status === 'rot' ? 'bg-red-500' : status === 'gelb' ? 'bg-amber-400' : 'bg-emerald-500'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-2xl text-surface-900 uppercase tracking-tight">{s.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[10px] font-black uppercase text-surface-400 bg-surface-100 px-3 py-1 rounded-full">{s.category}</span>
                       {isGesperrt && <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-3 py-1 rounded-full ring-1 ring-red-200 flex items-center gap-1"><AlertCircle size={10}/> KO-RISIKO</span>}
                    </div>
                  </div>
                </div>
                <button className="p-3 hover:bg-surface-50 rounded-2xl text-surface-400">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-8">
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-surface-100">
                  <div className="space-y-1">
                    <p className="micro-label !text-surface-300">Zertifikat-Ablauf</p>
                    <p className={`text-sm font-mono font-black ${status === 'rot' ? 'text-red-500' : status === 'gelb' ? 'text-orange-500' : 'text-emerald-600'}`}>
                      {s.certExpiry ? new Date(s.certExpiry).toLocaleDateString() : 'KEIN ZERTIFIKAT'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="micro-label !text-surface-300">Status</p>
                    <p className="text-sm font-black uppercase text-surface-700">{s.status}</p>
                  </div>
                </div>

                <div className="space-y-3">
                   <p className="micro-label !text-surface-300">Rohwaren / Leistungen</p>
                   <div className="flex flex-wrap gap-2">
                     {s.rawMaterials.map(rm => (
                       <span key={rm} className="text-[10px] font-bold text-surface-500 bg-surface-50 border border-surface-200 px-3 py-1 rounded-xl">
                         {rm}
                       </span>
                     ))}
                   </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-surface-100 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="micro-label !text-surface-300">Letzte Bewertung</p>
                  <p className="text-xs font-bold text-surface-500">{new Date(s.lastEvaluation).toLocaleDateString()}</p>
                </div>
                <button className="flex items-center gap-2 micro-label text-primary-600 hover:underline">
                  DETAILS <ExternalLink size={12} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
