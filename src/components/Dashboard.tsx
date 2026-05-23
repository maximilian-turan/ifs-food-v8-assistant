
import { PieChart, CheckCircle2, AlertCircle, BarChart3, Plus, Trash2, Calendar, Building2, Sparkles, Clock, ShieldAlert, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { IFS_CHAPTERS, IFSScore, IFSDocumentDeadline } from '../types';
import { MOCK_REQUIREMENTS } from '../mockData';

const MOCK_DOCS: IFSDocumentDeadline[] = [
  { name: "HACCP-Review", ifsRef: "§2.3.11.2", deadline: "2026-07-02", responsible: "QS-Leitung" },
  { name: "Food Defence Plan Review", ifsRef: "§4.21.3", deadline: "2026-05-28" },
  { name: "Verwundbarkeitsanalyse (Food Fraud)", ifsRef: "§4.20.2", deadline: "2026-06-15" },
  { name: "Management Review", ifsRef: "§1.2.1 KO1", deadline: "2026-08-13" },
  { name: "Internes Audit abgeschlossen", ifsRef: "§5.1.1 KO8", deadline: "2026-12-05" },
  { name: "Rückruf-Simulation", ifsRef: "§5.9.1 KO9", deadline: "2026-10-20" },
  { name: "IFS-Zertifikat Ablauf", ifsRef: "Zertifizierung", deadline: "2026-09-01" }
];

interface DashboardProps {
  scores: Record<string, IFSScore>;
  audits: any[];
  onSelectAudit: (id: string) => void;
  onCreateAudit: () => void;
  onDeleteAudit: (id: string) => void;
  onSelectChapter: (id: number) => void;
  onShowProblems: (active: boolean) => void;
}

export default function Dashboard({ scores, audits, onSelectAudit, onCreateAudit, onDeleteAudit, onSelectChapter, onShowProblems }: DashboardProps) {
  const getFristStatus = (frist: string) => {
    const fristDate = new Date(frist);
    const now = new Date();
    const tage = Math.floor((fristDate.getTime() - now.getTime()) / 86400000);
    
    if (tage < 0) return { farbe: "text-red-600 bg-red-50 border-red-200", text: `Seit ${Math.abs(tage)} Tagen überfällig`, icon: <ShieldAlert size={14} className="text-red-600" /> };
    if (tage < 30) return { farbe: "text-red-500 bg-red-50 border-red-100", text: `In ${tage} Tagen fällig`, icon: <AlertCircle size={14} className="text-red-500" /> };
    if (tage < 60) return { farbe: "text-amber-600 bg-amber-50 border-amber-100", text: `In ${tage} Tagen fällig`, icon: <Clock size={14} className="text-amber-600" /> };
    return { farbe: "text-emerald-600 bg-emerald-50 border-emerald-100", text: `In ${tage} Tagen fällig`, icon: <CheckCircle2 size={14} className="text-emerald-600" /> };
  };

  const getChapterStats = (chapterId: number): { progress: number, total: number, completed: number, status: 'green' | 'yellow' | 'red', criticalCount: number } => {
    const chapterReqs = MOCK_REQUIREMENTS.filter(r => r.chapter === chapterId);
    const scored = chapterReqs.filter(r => scores[r.id] && scores[r.id] !== 'N/A');
    const progress = (scored.length / chapterReqs.length) * 100;
    
    let status: 'green' | 'yellow' | 'red' = 'green';
    let criticalCount = 0;

    scored.forEach(req => {
      const s = scores[req.id];
      if (s === 'D' || s === 'Major') {
        status = 'red';
        criticalCount++;
      } else if (s === 'B' || s === 'C') {
        if (status !== 'red') status = 'yellow';
      }
    });

    return { progress, total: chapterReqs.length, completed: scored.length, status, criticalCount };
  };

  const getOverallStats = () => {
    const total = MOCK_REQUIREMENTS.length;
    let activeRequirements = 0;
    let rawPoints = 0;
    let anzahlMajors = 0;
    let anzahlKoD = 0;
    let countA = 0;
    let countB = 0;
    let countC = 0;
    let countD = 0;

    MOCK_REQUIREMENTS.forEach(req => {
      const score = scores[req.id];
      if (!score || score === "N/A") return;

      activeRequirements++;

      if (req.isKO) {
        if (score === "A") { rawPoints += 20; countA++; }
        else if (score === "B") { rawPoints += 0; countB++; }
        else if (score === "D") {
          anzahlKoD++;
          countD++;
        }
      } else {
        if (score === "A") { rawPoints += 20; countA++; }
        else if (score === "B") { rawPoints += 15; countB++; }
        else if (score === "C") { rawPoints += 5; countC++; }
        else if (score === "D") { rawPoints -= 20; countD++; }
        else if (score === "Major") {
          anzahlMajors++;
        }
      }
    });

    const maxPunkte = activeRequirements * 20;
    const majorAbzug = anzahlMajors * (maxPunkte * 0.15);
    const koDAbzug = anzahlKoD * (maxPunkte * 0.50);
    const endPunkte = rawPoints - majorAbzug - koDAbzug;
    const prozent = maxPunkte > 0 ? Math.round((endPunkte / maxPunkte) * 100) : 0;
    const finalScore = Math.max(0, prozent);
    const completionPercentage = (Object.keys(scores).length / total) * 100;

    let level = 'Nicht bestanden';
    if (finalScore >= 95 && anzahlMajors === 0 && anzahlKoD === 0) level = 'Höheres Niveau';
    else if (finalScore >= 75 && anzahlMajors === 0 && anzahlKoD === 0) level = 'Basisniveau';

    return { 
      finalScore, 
      anzahlMajors, 
      anzahlKoD, 
      completionPercentage,
      total,
      completed: Object.keys(scores).length,
      level,
      isPassed: finalScore >= 75 && anzahlMajors === 0 && anzahlKoD === 0,
      counts: {
        critical: anzahlMajors + countD,
        deviations: countB + countC,
        ok: countA
      }
    };
  };

  const getKOStatus = () => {
    const koReqs = MOCK_REQUIREMENTS.filter(r => r.isKO);
    const koFailed = koReqs.some(r => scores[r.id] === 'D');
    return koFailed ? 'Kritisch' : 'Konform';
  };

  const stats = getOverallStats();

  return (
    <div className="p-10 md:p-16 max-w-7xl mx-auto space-y-20">
      {/* Header with quick stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 pb-10 border-b border-surface-200">
        <div className="space-y-4">
          <h2 className="text-6xl font-display font-black tracking-tight text-surface-900 leading-none">Dashboard</h2>
          <p className="micro-label">IFS Food v8 Assistant &bull; Compliance Management System</p>
        </div>
        <button 
          onClick={onCreateAudit}
          className="bg-primary-600 text-white px-10 py-5 rounded-2xl micro-label hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95"
        >
          NEUES AUDIT STARTEN
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-900 p-10 rounded-[40px] text-white shadow-2xl group hover-lift transition-all"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-white/10 text-primary-500 rounded-2xl flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all">
              <Sparkles size={24} />
            </div>
            <h3 className="micro-label !text-white/40">Audit Score</h3>
          </div>
          <div className={`text-6xl font-display font-black mb-4 ${!stats.isPassed ? 'text-red-500' : 'text-emerald-500'}`}>
            {Math.round(stats.finalScore)}<span className="text-3xl opacity-40 ml-1">%</span>
          </div>
          <p className="micro-label !text-white/40 tracking-widest leading-relaxed mb-4">
            {stats.level.toUpperCase()}
          </p>
          
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                {stats.completed} von {stats.total} bewertet
              </span>
              {stats.completed === stats.total ? (
                <div className="flex items-center gap-1.5 text-emerald-500">
                  <CheckCircle2 size={14} />
                  <span className="text-[10px] font-black uppercase">Vollständig</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-amber-500">
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-black uppercase">Unvollständig</span>
                </div>
              )}
            </div>
            {!stats.isPassed && (
              <div className="space-y-2">
                {stats.anzahlMajors > 0 && <p className="text-[10px] text-red-500 font-bold tracking-wider">▲ MAJOR-NICHTKONFORMITÄT VORHANDEN</p>}
                {stats.anzahlKoD > 0 && <p className="text-[10px] text-red-500 font-bold tracking-wider">▲ KO-NICHTKONFORMITÄT VORHANDEN</p>}
                {stats.finalScore < 75 && <p className="text-[10px] text-red-500 font-bold tracking-wider">▲ SCORE UNTER 75%</p>}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-10 rounded-[40px] border border-surface-200 shadow-xl shadow-surface-200/50 flex flex-col group hover-lift transition-all"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
            <h3 className="micro-label">Audit-Abschluss</h3>
          </div>
          <div className="text-6xl font-display font-black mb-6 tabular-nums text-surface-900">
            {Math.round(stats.completionPercentage)}<span className="text-3xl text-surface-300 ml-1">%</span>
          </div>
          <div className="h-3 bg-surface-100 w-full rounded-full overflow-hidden mt-auto">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionPercentage}%` }}
              className="h-full bg-primary-600 rounded-full" 
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-10 rounded-[40px] border border-surface-200 shadow-xl shadow-surface-200/50 group hover-lift transition-all"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
              <AlertCircle size={24} />
            </div>
            <h3 className="micro-label text-red-500/50">KO-Status</h3>
          </div>
          <div className={`text-4xl font-display font-black uppercase mb-4 ${getKOStatus() === 'Kritisch' ? 'text-red-600' : 'text-emerald-500'}`}>
            {getKOStatus()}
          </div>
          <p className="micro-label tracking-widest leading-relaxed">
            {MOCK_REQUIREMENTS.filter(r => r.isKO).length} Knock-out Kriterien aktiv
          </p>
        </motion.div>
      </div>

      {/* Counters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => { onShowProblems(false); onSelectChapter(1); }}
          className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100 flex items-center justify-between group hover:shadow-xl transition-all text-left"
        >
          <div>
            <p className="micro-label !text-emerald-700 mb-1">Status OK (A)</p>
            <p className="text-3xl font-display font-black text-emerald-900">{stats.counts.ok}</p>
          </div>
          <CheckCircle2 className="text-emerald-400 group-hover:scale-110 transition-transform" size={32} />
        </button>
        <button 
          onClick={() => { onShowProblems(true); onSelectChapter(1); }}
          className="bg-orange-50 p-8 rounded-[32px] border border-orange-100 flex items-center justify-between group hover:shadow-xl transition-all text-left"
        >
          <div>
            <p className="micro-label !text-orange-700 mb-1">Abweichungen (B,C)</p>
            <p className="text-3xl font-display font-black text-orange-900">{stats.counts.deviations}</p>
          </div>
          <AlertCircle className="text-orange-400 group-hover:scale-110 transition-transform" size={32} />
        </button>
        <button 
          onClick={() => { onShowProblems(true); onSelectChapter(1); }}
          className="bg-red-50 p-8 rounded-[32px] border border-red-100 flex items-center justify-between group hover:shadow-xl transition-all text-left"
        >
          <div>
            <p className="micro-label !text-red-700 mb-1">Kritische Punkte (D, Major)</p>
            <p className="text-3xl font-display font-black text-red-900">{stats.counts.critical}</p>
          </div>
          <AlertCircle className="text-red-400 group-hover:scale-110 transition-transform" size={32} />
        </button>
      </div>

      {/* Chapters Preview */}
      <div className="space-y-12">
        <div className="flex items-center gap-6">
           <h3 className="text-2xl font-display font-black uppercase tracking-tight text-surface-900">IFS Struktur</h3>
           <div className="h-px flex-1 bg-surface-200"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {IFS_CHAPTERS.map((chapter, idx) => {
            const chStats = getChapterStats(chapter.id);
            return (
              <motion.button
                key={chapter.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx }}
                onClick={() => onSelectChapter(chapter.id)}
                className="group flex flex-col items-start text-left p-10 bg-primary-50 border border-primary-100 rounded-[40px] hover:border-primary-500 transition-all hover:shadow-2xl relative overflow-hidden h-full hover-lift"
              >
                <div className="w-full flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full shadow-lg ${
                      chStats.status === 'red' ? 'bg-red-500' : 
                      chStats.status === 'yellow' ? 'bg-amber-400' : 'bg-emerald-500'
                    }`} />
                    <span className="text-5xl font-display font-black text-surface-50 group-hover:text-primary-50 transition-colors">0{chapter.id}</span>
                  </div>
                  <div className="micro-label px-4 py-2 rounded-full bg-surface-50 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                    {Math.round(chStats.progress)}%
                  </div>
                </div>
                <h4 className="font-display font-black text-lg uppercase tracking-tight mb-2 leading-tight text-surface-900">
                  {chStats.status === 'red' && <span className="mr-2 text-red-500">🔴</span>}
                  {chStats.status === 'yellow' && <span className="mr-2 text-amber-500">🟡</span>}
                  {chStats.status === 'green' && <span className="mr-2 text-emerald-500">🟢</span>}
                  {chapter.title}
                </h4>
                <p className="text-[11px] text-surface-500 font-medium leading-relaxed mb-6 line-clamp-2 italic font-serif opacity-70">{chapter.description}</p>
                <div className="flex items-center gap-3 mb-10">
                  <span className="text-[10px] text-surface-400 font-bold uppercase">{chStats.completed} / {chStats.total} bewertet</span>
                  {chStats.criticalCount > 0 && (
                    <span className="text-[10px] text-red-500 font-black flex items-center gap-1">
                      &bull; {chStats.criticalCount} KRITISCHE PUNKTE
                    </span>
                  )}
                </div>
                <div className="mt-auto w-full h-2 bg-surface-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-surface-900 group-hover:bg-primary-500 transition-all duration-1000 ease-out" 
                    style={{ width: `${chStats.progress}%` }}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Audits List */}
      <div className="space-y-10">
        <div className="flex items-center gap-6">
           <h3 className="text-2xl font-display font-black uppercase tracking-tight text-surface-900">Aktive Berichte</h3>
           <div className="h-px flex-1 bg-surface-200"></div>
        </div>
        
        {audits.length === 0 ? (
          <div className="bg-surface-50 border-4 border-dashed border-surface-200 rounded-[40px] p-24 text-center">
            <div className="w-20 h-20 bg-surface-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Plus className="text-surface-300" size={32} />
            </div>
            <p className="micro-label text-xs mb-8">Keine Audits gefunden</p>
            <button 
              onClick={onCreateAudit} 
              className="micro-label text-primary-600 text-[10px] bg-white px-8 py-4 rounded-2xl shadow-lg hover:bg-primary-50 transition-all border border-primary-100"
            >
              Starten Sie Ihr erstes Audit
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {audits.map((audit) => (
              <motion.div 
                layout
                key={audit.id} 
                className="audit-card group flex flex-col md:flex-row items-center justify-between cursor-pointer relative overflow-hidden"
                onClick={() => onSelectAudit(audit.id)}
              >
                <div className="flex items-center gap-8 flex-1 w-full">
                  <div className="w-16 h-16 bg-surface-50 rounded-3xl text-surface-400 flex items-center justify-center font-black group-hover:bg-primary-600 group-hover:text-white transition-all text-xl">
                    <Building2 size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-black text-2xl uppercase tracking-tight text-surface-900 truncate">{audit.companyName}</h4>
                    <div className="flex items-center gap-8 mt-3">
                      <div className="flex items-center gap-2 micro-label">
                        <Calendar size={14} className="text-primary-500" />
                        {new Date(audit.date).toLocaleDateString()}
                      </div>
                      <span className={`micro-label !text-[9px] px-4 py-1.5 rounded-full ${audit.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary-50 text-primary-700'}`}>
                        {audit.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 mt-8 md:mt-0 w-full md:w-auto justify-end">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAudit(audit.id);
                    }}
                    className="w-12 h-12 flex items-center justify-center text-surface-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="px-10 py-5 bg-surface-900 text-white micro-label !text-[10px] rounded-2xl group-hover:bg-primary-600 transition-all shadow-lg">
                    AUDIT ÖFFNEN
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Document Deadlines Widget */}
      <div className="space-y-10">
        <div className="flex items-center gap-6">
           <h3 className="text-2xl font-display font-black uppercase tracking-tight text-surface-900">Dokumenten-Fristen</h3>
           <div className="h-px flex-1 bg-surface-200"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_DOCS.map((doc, i) => {
            const status = getFristStatus(doc.deadline);
            return (
              <motion.div 
                key={doc.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border border-surface-200 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <p className="micro-label !text-surface-300">{doc.ifsRef}</p>
                    <h4 className="font-display font-bold text-base text-surface-900 leading-tight">{doc.name}</h4>
                  </div>
                  <div className="p-3 bg-surface-50 rounded-xl text-surface-400 group-hover:text-primary-600 group-hover:bg-primary-50 transition-all">
                    <Calendar size={18} />
                  </div>
                </div>
                
                <div className="mt-auto space-y-4">
                  <div className={`p-4 rounded-2xl border flex items-center gap-3 ${status.farbe}`}>
                    {status.icon}
                    <span className="text-[10px] font-black uppercase tracking-wider">{status.text}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-surface-400">Frist: {new Date(doc.deadline).toLocaleDateString()}</span>
                    {doc.responsible && <span className="text-[10px] font-bold text-surface-400">{doc.responsible}</span>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
