
import { Search, AlertCircle, Clock, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { IFSMeasure } from '../types';

// Korrektur = sofortige Behebung, Nachweis innerhalb 4 Wochen
// Korrekturmaßnahme = nachhaltige Ursachenbeseitigung, Frist variabel
// Beide müssen vor dem nächsten Zertifizierungsaudit abgeschlossen sein

const MOCK_MEASURES: IFSMeasure[] = [
  {
    id: 'm1',
    reqNo: '4.19.2',
    reqTitle: 'Allergen-Risikominderung',
    score: 'D',
    deviation: 'Keine Allergenreinigung nach Sesam-Produktion auf Linie 2 dokumentiert.',
    type: 'Korrekturmaßnahme',
    responsible: 'M. Müller (Produktionsleitung)',
    deadline: '2026-05-20',
    status: 'offen',
    createdAt: '2026-05-15'
  },
  {
    id: 'm2',
    reqNo: '3.2.2',
    reqTitle: 'Personalhygiene',
    score: 'Major',
    deviation: 'Mitarbeiter in Schicht 2 trugen Schmuck in der Produktion.',
    type: 'Korrektur',
    responsible: 'S. Schmidt (QS)',
    deadline: '2026-05-16',
    status: 'in_bearbeitung',
    createdAt: '2026-05-14'
  }
];

export default function Measures() {
  const [filter, setFilter] = useState<'all' | 'overdue' | 'open' | 'in_progress' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let base = MOCK_MEASURES.filter(m => 
      m.reqNo.includes(search) || 
      m.reqTitle.toLowerCase().includes(search.toLowerCase()) ||
      m.responsible.toLowerCase().includes(search.toLowerCase())
    );

    const now = new Date();

    if (filter === 'overdue') {
      return base.filter(m => new Date(m.deadline) < now && m.status !== 'wirksam_geprueft');
    }
    if (filter === 'open') {
      return base.filter(m => m.status === 'offen');
    }
    if (filter === 'in_progress') {
      return base.filter(m => m.status === 'in_bearbeitung');
    }
    if (filter === 'completed') {
      return base.filter(m => m.status === 'umgesetzt' || m.status === 'wirksam_geprueft');
    }

    return base.sort((a, b) => {
      const dateA = new Date(a.deadline);
      const dateB = new Date(b.deadline);
      if (dateA < now && dateB >= now) return -1;
      if (dateB < now && dateA >= now) return 1;
      return dateA.getTime() - dateB.getTime();
    });
  }, [filter, search]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'offen': return <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Offen</span>;
      case 'in_bearbeitung': return <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">In Bearbeitung</span>;
      case 'umgesetzt': return <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Umgesetzt</span>;
      case 'wirksam_geprueft': return <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">Wirksam geprüft</span>;
      default: return null;
    }
  };

  return (
    <div className="p-10 md:p-16 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 pb-10 border-b border-surface-200">
        <div className="space-y-4">
          <h2 className="text-6xl font-display font-black tracking-tight text-surface-900 leading-none">CAPA</h2>
          <p className="micro-label">Korrektur- & Korrekturmaßnahmen &bull; IFS §5.11</p>
        </div>
        <div className="flex gap-4">
           {['all', 'overdue', 'open', 'in_progress', 'completed'].map(f => (
             <button
               key={f}
               onClick={() => setFilter(f as any)}
               className={`px-6 py-3 rounded-xl micro-label transition-all border ${
                 filter === f ? 'bg-primary-600 text-white border-primary-600 shadow-lg' : 'bg-white text-surface-500 border-surface-200 hover:border-primary-500'
               }`}
             >
               {f === 'all' ? 'Alle' : f === 'overdue' ? 'Überfällig' : f === 'open' ? 'Offen' : f === 'in_progress' ? 'In Bearbeitung' : 'Abgeschlossen'}
             </button>
           ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
        <input 
          type="text" 
          placeholder="NACH ANFORDERUNG ODER VERANTWORTLICHEM SUCHEN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-16 pr-8 py-5 bg-white border border-surface-200 rounded-[30px] font-bold text-surface-900 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all placeholder:text-surface-300 shadow-sm"
        />
      </div>

      <div className="grid gap-6">
        {filtered.map((m) => {
          const isOverdue = new Date(m.deadline) < new Date() && m.status !== 'wirksam_geprueft';
          const scoreColor = m.score === 'Major' || m.score === 'D' ? 'border-l-red-500' : m.score === 'C' ? 'border-l-orange-400' : 'border-l-blue-500';

          return (
            <motion.div 
              layout
              key={m.id}
              className={`bg-white border-l-[12px] ${scoreColor} border-y border-r border-surface-200 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden`}
            >
              <div className="flex flex-col lg:flex-row justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-display font-black text-surface-900">{m.reqNo}</span>
                    <h3 className="font-display font-bold text-lg text-surface-700">{m.reqTitle}</h3>
                    {getStatusBadge(m.status)}
                    {isOverdue && (
                      <span className="flex items-center gap-1.5 text-red-600 bg-red-50 px-3 py-1 rounded-full text-[10px] font-black uppercase ring-1 ring-red-200">
                        <AlertCircle size={12} />
                        Überfällig
                      </span>
                    )}
                  </div>
                  <p className="text-surface-500 text-sm font-medium line-clamp-2 max-w-3xl leading-relaxed italic border-l-2 border-surface-100 pl-4">
                    "{m.deviation}"
                  </p>
                  <div className="flex flex-wrap gap-10 pt-4">
                    <div className="space-y-1">
                      <p className="micro-label !text-surface-300">Verantwortlich</p>
                      <p className="text-xs font-bold text-surface-700">{m.responsible}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="micro-label !text-surface-300">Frist</p>
                      <p className={`text-xs font-mono font-bold ${isOverdue ? 'text-red-600 underline decoration-2' : 'text-surface-700'}`}>
                        {new Date(m.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="micro-label !text-surface-300">Maßnahmentyp</p>
                      <p className="text-[10px] font-black uppercase text-surface-500 px-2.5 py-1 bg-surface-100 rounded-lg">{m.type}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-4 bg-surface-50 hover:bg-primary-600 hover:text-white rounded-2xl transition-all shadow-sm border border-surface-100 group-hover:border-primary-500">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center bg-surface-50 border-4 border-dashed border-surface-200 rounded-[40px]">
          <FileText className="mx-auto text-surface-200 mb-6" size={48} />
          <p className="micro-label !text-surface-300">Keine Maßnahmen gefunden</p>
        </div>
      )}
    </div>
  );
}
