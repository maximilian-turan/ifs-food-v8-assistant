/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  ClipboardCheck, 
  LayoutDashboard, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Menu,
  X,
  Sparkles,
  Search,
  BookOpen,
  PieChart,
  List,
  LogOut,
  Plus,
  Trash2,
  ShieldAlert,
  Truck,
  Footprints,
  Clock,
  CalendarRange,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

type MockUser = { uid: string; displayName: string | null; email: string | null };
import { IFS_CHAPTERS, IFSScore, IFSRequirement } from './types';
import { MOCK_REQUIREMENTS } from './mockData';
import { getRequirementExplanation } from './services/gemini';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Measures from './components/Measures';
import Suppliers from './components/Suppliers';
import Walkthroughs from './components/Walkthroughs';
import ShiftLogs from './components/ShiftLogs';
import AllergenCalendar from './components/AllergenCalendar';

export default function App() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [view, setView] = useState<'dashboard' | 'audit' | 'koPoints' | 'measures' | 'suppliers' | 'walkthroughs' | 'shiftLogs' | 'allergenCalendar'>('dashboard');
  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [audits, setAudits] = useState<any[]>([]);
  const [currentAuditId, setCurrentAuditId] = useState<string | null>(null);
  
  const [scores, setScores] = useState<Record<string, IFSScore>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [explainingId, setExplainingId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAuditName, setNewAuditName] = useState('');
  const [isCreatingAudit, setIsCreatingAudit] = useState(false);
  const [auditToDelete, setAuditToDelete] = useState<string | null>(null);
  const [showKOWarning, setShowKOWarning] = useState<{id: string, score: IFSScore} | null>(null);
  const [problemsOnly, setProblemsOnly] = useState(false);
  const [immediateActions, setImmediateActions] = useState<Record<string, string>>({});

  // Auto-login (lokaler Modus ohne Firebase)
  useEffect(() => {
    setUser({ uid: 'local-user', displayName: 'Lokaler Nutzer', email: 'local@user.de' });
    setAuthReady(true);
  }, []);

  // Audits aus localStorage laden
  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem('ifs_audits');
    setAudits(stored ? JSON.parse(stored) : []);
  }, [user]);

  // Requirements aus localStorage laden
  useEffect(() => {
    if (!currentAuditId) {
      setScores({});
      setComments({});
      setImmediateActions({});
      return;
    }
    const stored = localStorage.getItem(`ifs_req_${currentAuditId}`);
    if (stored) {
      const reqs = JSON.parse(stored);
      const newScores: Record<string, IFSScore> = {};
      const newComments: Record<string, string> = {};
      const newImmediateActions: Record<string, string> = {};
      Object.entries(reqs).forEach(([id, data]: [string, any]) => {
        newScores[id] = data.score;
        newComments[id] = data.comment;
        newImmediateActions[id] = data.immediateAction;
      });
      setScores(newScores);
      setComments(newComments);
      setImmediateActions(newImmediateActions);
    } else {
      setScores({});
      setComments({});
      setImmediateActions({});
    }
  }, [currentAuditId]);

  const createAudit = async () => {
    if (!user || !newAuditName.trim()) return;
    setIsCreatingAudit(true);
    const auditId = `audit_${Date.now()}`;
    const auditData = {
      id: auditId,
      companyName: newAuditName.trim(),
      auditorName: user.displayName || 'Unbenannt',
      date: new Date().toISOString(),
      status: 'draft',
      ownerId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const existing = JSON.parse(localStorage.getItem('ifs_audits') || '[]');
    const updated = [auditData, ...existing];
    localStorage.setItem('ifs_audits', JSON.stringify(updated));
    setAudits(updated);
    setCurrentAuditId(auditId);
    setView('audit');
    setShowCreateModal(false);
    setNewAuditName('');
    setIsCreatingAudit(false);
  };

  const deleteAudit = async () => {
    if (!auditToDelete) return;
    const existing = JSON.parse(localStorage.getItem('ifs_audits') || '[]');
    const updated = existing.filter((a: any) => a.id !== auditToDelete);
    localStorage.setItem('ifs_audits', JSON.stringify(updated));
    localStorage.removeItem(`ifs_req_${auditToDelete}`);
    setAudits(updated);
    if (currentAuditId === auditToDelete) setCurrentAuditId(null);
    setAuditToDelete(null);
  };

  const selectAudit = (id: string) => {
    setCurrentAuditId(id);
    setView('audit');
  };

  function saveRequirement(reqId: string, data: { score: IFSScore; comment: string; immediateAction: string }) {
    if (!currentAuditId) return;
    const stored = localStorage.getItem(`ifs_req_${currentAuditId}`);
    const reqs = stored ? JSON.parse(stored) : {};
    reqs[reqId] = { ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(`ifs_req_${currentAuditId}`, JSON.stringify(reqs));
  }

  function handleScoreChange(reqId: string, score: IFSScore) {
    if (!currentAuditId) return;
    const req = MOCK_REQUIREMENTS.find(r => r.id === reqId);
    if (req?.isKO && score === 'D') {
      setShowKOWarning({ id: reqId, score });
      return;
    }
    saveRequirement(reqId, { score, comment: comments[reqId] || '', immediateAction: immediateActions[reqId] || '' });
    setScores(prev => ({ ...prev, [reqId]: score }));
  }

  function handleCommentChange(reqId: string, comment: string) {
    if (!currentAuditId) return;
    saveRequirement(reqId, { score: scores[reqId] || 'N/A' as IFSScore, comment, immediateAction: immediateActions[reqId] || '' });
    setComments(prev => ({ ...prev, [reqId]: comment }));
  }

  function handleImmediateActionChange(reqId: string, immediateAction: string) {
    if (!currentAuditId) return;
    saveRequirement(reqId, { score: scores[reqId] || 'N/A' as IFSScore, comment: comments[reqId] || '', immediateAction });
    setImmediateActions(prev => ({ ...prev, [reqId]: immediateAction }));
  }

  const subChapters = useMemo(() => {
    const all = MOCK_REQUIREMENTS.filter(r => r.chapter === activeChapter).map(r => r.subChapter).filter(Boolean);
    return Array.from(new Set(all)) as string[];
  }, [activeChapter]);

  const [activeSubChapter, setActiveSubChapter] = useState<string | null>(null);

  useEffect(() => {
    setActiveSubChapter(null);
  }, [activeChapter]);

  const filteredRequirements = useMemo(() => {
    let base = MOCK_REQUIREMENTS.filter(req => 
      req.chapter === activeChapter && 
      (!activeSubChapter || req.subChapter === activeSubChapter) &&
      (req.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
       req.id.includes(searchQuery))
    );

    if (problemsOnly) {
      const scorePriority: Record<string, number> = {
        'KO-D': 6, // Virtual score for KO requirements with D
        'Major': 5,
        'D': 4,
        'C': 3,
        'B': 2
      };

      return base
        .filter(req => {
          const score = scores[req.id];
          return score && ['B', 'C', 'D', 'Major'].includes(score);
        })
        .sort((a, b) => {
          const scoreA = (a.isKO && scores[a.id] === 'D') ? 'KO-D' : scores[a.id];
          const scoreB = (b.isKO && scores[b.id] === 'D') ? 'KO-D' : scores[b.id];
          return (scorePriority[scoreB as string] || 0) - (scorePriority[scoreA as string] || 0);
        });
    }

    return base;
  }, [activeChapter, activeSubChapter, searchQuery, problemsOnly, scores]);

  const explainRequirement = async (req: IFSRequirement) => {
    setExplainingId(req.id);
    setIsExplaining(true);
    setExplanation(null);
    const result = await getRequirementExplanation(req.id, req.title, req.description);
    setExplanation(result || "Keine Erklärung gefunden.");
    setIsExplaining(false);
  };

  const stats = useMemo(() => {
    const total = MOCK_REQUIREMENTS.length;
    const completed = Object.keys(scores).length;
    
    let activeRequirements = 0;
    let rawPoints = 0;
    let anzahlMajors = 0;
    let anzahlKoD = 0;
    let hasKOfail = false;

    MOCK_REQUIREMENTS.forEach(req => {
      const score = scores[req.id];
      if (!score || score === "N/A") return;

      activeRequirements++;

      if (req.isKO) {
        if (score === "A") rawPoints += 20;
        else if (score === "B") rawPoints += 0;
        else if (score === "D") {
          anzahlKoD++;
          hasKOfail = true;
        }
      } else {
        if (score === "A") rawPoints += 20;
        else if (score === "B") rawPoints += 15;
        else if (score === "C") rawPoints += 5;
        else if (score === "D") rawPoints -= 20;
        else if (score === "Major") {
          anzahlMajors++;
          hasKOfail = true;
        }
      }
    });

    const maxPunkte = activeRequirements * 20;
    const majorAbzug = anzahlMajors * (maxPunkte * 0.15);
    const koDAbzug = anzahlKoD * (maxPunkte * 0.50);
    const endPunkte = rawPoints - majorAbzug - koDAbzug;
    const prozent = maxPunkte > 0 ? Math.round((endPunkte / maxPunkte) * 100) : 0;
    const finalScore = Math.max(0, prozent);
    const progress = (completed / total) * 100;

    let niveau = 'Nicht bestanden';
    if (finalScore >= 95 && anzahlMajors === 0 && anzahlKoD === 0) niveau = 'Höheres Niveau';
    else if (finalScore >= 75 && anzahlMajors === 0 && anzahlKoD === 0) niveau = 'Basisniveau';

    return { 
      total, 
      completed, 
      progress, 
      finalScore, 
      hasKOfail, 
      anzahlMajors, 
      anzahlKoD,
      niveau,
      isPassed: finalScore >= 75 && anzahlMajors === 0 && anzahlKoD === 0
    };
  }, [scores]);

  if (!authReady) return null;
  if (!user) return <Login />;

  return (
    <div className="flex h-screen bg-surface-50 text-surface-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-72 bg-surface-900 flex flex-col z-20 shrink-0 shadow-2xl"
          >
            <div className="p-8 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">IFS</div>
                <div>
                   <h1 className="font-display font-black text-lg uppercase tracking-tight leading-none text-white">Food v8</h1>
                   <p className="micro-label !text-primary-500 mt-1">Digital Assistant</p>
                   <p className="text-[12px] text-white font-black mt-2 opacity-100 tracking-tight whitespace-nowrap">© Rosans GmbH & <a href="https://www.nextlumen.ai" target="_blank" rel="noopener noreferrer" className="italic underline hover:text-primary-400 transition-colors">nextlumen.ai</a></p>
                </div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 space-y-1">
              <div className="micro-label px-3 py-6 !text-white/30">Navigation</div>
              <button
                onClick={() => setView('dashboard')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  view === 'dashboard' 
                  ? 'bg-white/10 text-primary-500 font-bold' 
                  : 'hover:bg-white/5 text-surface-400'
                }`}
              >
                <LayoutDashboard size={18} className={view === 'dashboard' ? 'text-primary-500' : ''} />
                <span className="text-xs font-semibold">Dashboard</span>
              </button>

              <button
                onClick={() => setView('koPoints')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  view === 'koPoints' 
                  ? 'bg-white/10 text-primary-500 font-bold' 
                  : 'hover:bg-white/5 text-surface-400'
                }`}
              >
                <AlertCircle size={18} className={view === 'koPoints' ? 'text-primary-500' : ''} />
                <span className="text-xs font-semibold">10 KO Kriterien</span>
              </button>

              <div className="micro-label px-3 py-4 mt-2 !text-white/30">Management</div>
              
              <button
                onClick={() => setView('measures')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  view === 'measures' ? 'bg-white/10 text-primary-500 font-bold' : 'hover:bg-white/5 text-surface-400'
                }`}
              >
                <ShieldAlert size={18} className={view === 'measures' ? 'text-primary-500' : ''} />
                <span className="text-xs font-semibold">Offene Maßnahmen</span>
              </button>

              <button
                onClick={() => setView('suppliers')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  view === 'suppliers' ? 'bg-white/10 text-primary-500 font-bold' : 'hover:bg-white/5 text-surface-400'
                }`}
              >
                <Truck size={18} className={view === 'suppliers' ? 'text-primary-500' : ''} />
                <span className="text-xs font-semibold">Lieferanten</span>
              </button>

              <button
                onClick={() => setView('walkthroughs')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  view === 'walkthroughs' ? 'bg-white/10 text-primary-500 font-bold' : 'hover:bg-white/5 text-surface-400'
                }`}
              >
                <Footprints size={18} className={view === 'walkthroughs' ? 'text-primary-500' : ''} />
                <span className="text-xs font-semibold">Begehungen</span>
              </button>

              <button
                onClick={() => setView('shiftLogs')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  view === 'shiftLogs' ? 'bg-white/10 text-primary-500 font-bold' : 'hover:bg-white/5 text-surface-400'
                }`}
              >
                <Clock size={18} className={view === 'shiftLogs' ? 'text-primary-500' : ''} />
                <span className="text-xs font-semibold">Schichtprotokoll</span>
              </button>

              <button
                onClick={() => setView('allergenCalendar')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  view === 'allergenCalendar' ? 'bg-white/10 text-primary-500 font-bold' : 'hover:bg-white/5 text-surface-400'
                }`}
              >
                <CalendarRange size={18} className={view === 'allergenCalendar' ? 'text-primary-500' : ''} />
                <span className="text-xs font-semibold">Allergen-Kalender</span>
              </button>

              <div className="micro-label px-3 py-6 mt-4 !text-white/30">Audit Kapitel</div>
              {IFS_CHAPTERS.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    setActiveChapter(chapter.id);
                    setView('audit');
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left group ${
                    view === 'audit' && activeChapter === chapter.id 
                    ? 'bg-white/10 text-primary-500' 
                    : 'hover:bg-white/5 text-surface-400 font-medium'
                  }`}
                >
                  <div className={`mt-0.5 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${view === 'audit' && activeChapter === chapter.id ? 'bg-primary-600 text-white' : 'bg-white/10 text-surface-500 group-hover:bg-white/20 transition-colors'}`}>
                    {chapter.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold truncate leading-relaxed ${view === 'audit' && activeChapter === chapter.id ? 'text-white' : ''}`}>{chapter.title}</div>
                  </div>
                </button>
              ))}
            </nav>

            <div className="p-8 bg-black/40">
               <div className="bg-white/5 p-5 rounded-2xl border border-white/10 subtle-shadow text-white">
                  <div className="flex justify-between items-end mb-3">
                    <span className="micro-label !text-white/30">Fortschritt</span>
                    <span className="text-xs font-mono font-bold text-primary-500">{Math.round(stats.progress)}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.progress}%` }}
                      className="h-full bg-primary-600 rounded-full"
                    />
                  </div>
               </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Top Navbar */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-surface-200 flex items-center justify-between px-10 shrink-0 z-10 sticky top-0">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 hover:bg-surface-100 rounded-xl transition-colors text-surface-600"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="hidden sm:flex items-center text-xs font-bold uppercase tracking-widest text-surface-400">
              <span className="hover:text-primary-600 cursor-pointer transition-colors" onClick={() => setView('dashboard')}>System</span>
              <ChevronRight size={14} className="mx-2 opacity-50" />
              <span className="text-surface-900">{view === 'dashboard' ? 'Overview' : view === 'koPoints' ? '10 KO Kriterien' : `Kapitel ${activeChapter}`}</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-4 text-right border-r border-surface-200 pr-8">
              <div>
                <p className="micro-label mb-1">Eingeloggt als</p>
                <p className="text-xs font-bold text-surface-900">{user.displayName || user.email}</p>
              </div>
              <button 
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="p-2.5 flex items-center justify-center text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Abmelden"
              >
                <LogOut size={18} />
              </button>
            </div>
            
            {view === 'audit' && (
              <div className="relative hidden lg:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={16} />
                <input 
                  type="text" 
                  placeholder="ANFORDERUNG SUCHEN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 bg-surface-100 border-none rounded-2xl micro-label text-surface-900 focus:ring-2 focus:ring-primary-500 transition-all w-64 outline-none placeholder:text-surface-400"
                />
              </div>
            )}
            <button className="bg-primary-600 text-white px-8 py-3 rounded-2xl micro-label hover:bg-black transition-all shadow-lg active:scale-95">
              EXPORT
            </button>
          </div>
        </header>

        {/* View Switcher Content */}
         <div className="flex-1 overflow-y-auto">
          {view === 'dashboard' ? (
            <Dashboard 
              scores={scores} 
              audits={audits}
              onSelectAudit={selectAudit}
              onCreateAudit={() => setShowCreateModal(true)}
              onDeleteAudit={(id) => setAuditToDelete(id)}
              onSelectChapter={(id) => {
                setActiveChapter(id);
                setView('audit');
              }} 
              onShowProblems={(active) => {
                setProblemsOnly(active);
              }}
            />
          ) : view === 'measures' ? (
            <Measures />
          ) : view === 'suppliers' ? (
            <Suppliers />
          ) : view === 'walkthroughs' ? (
            <Walkthroughs />
          ) : view === 'shiftLogs' ? (
            <ShiftLogs />
          ) : view === 'allergenCalendar' ? (
            <AllergenCalendar />
          ) : view === 'koPoints' ? (
            <div className="p-10 max-w-7xl mx-auto space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 pb-10 border-b border-surface-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20">
                      <AlertCircle size={24} />
                    </div>
                    <h2 className="text-7xl font-display font-black tracking-tight text-primary-600 uppercase">
                      10 KO Kriterien
                    </h2>
                  </div>
                  <p className="text-surface-500 font-medium text-base max-w-3xl leading-relaxed italic font-serif opacity-80">
                    Die Einhaltung dieser 10 Knock-out-Anforderungen ist zwingend erforderlich für eine IFS Food Zertifizierung.
                  </p>
                </div>
              </div>

              <div className="grid gap-8">
                {MOCK_REQUIREMENTS.filter(r => r.isKO).map((req) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={req.id}
                    className="bg-primary-50 border-l-[12px] border-l-red-500 border border-primary-100 rounded-3xl p-10 shadow-sm hover:shadow-xl transition-all group"
                  >
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <span className="text-3xl font-display font-black text-black">
                                {req.id}
                              </span>
                              <div className="space-y-1">
                                <span className="bg-red-50 text-red-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-[0.15em]">Knock-out Kriterium</span>
                                <h3 className="font-display font-bold text-xl text-surface-900">{req.title}</h3>
                              </div>
                            </div>
                        </div>
                        <p className="text-surface-500 leading-relaxed font-medium mb-10 text-pretty">{req.description}</p>
                        
                        <div className="flex items-center gap-4">
                          <button 
                            disabled={explainingId === req.id}
                            onClick={() => explainRequirement(req)}
                            className="bg-primary-50 text-primary-700 px-6 py-3 rounded-2xl micro-label hover:bg-primary-600 hover:text-white transition-all flex items-center gap-3 border border-primary-100 disabled:opacity-50"
                          >
                            <Sparkles size={16} className={`${explainingId === req.id ? 'animate-pulse' : ''} text-amber-500`} />
                            {explainingId === req.id ? 'KI ANALYSIERT...' : 'INTERPRETATIONSHILFE'}
                          </button>
                        </div>
                      </div>

                      {currentAuditId && (
                        <div className="w-full lg:w-80 space-y-6 bg-white/60 p-8 rounded-3xl border border-primary-100">
                          <div>
                            <label className="micro-label block mb-4">BEWERTUNG</label>
                            <div className="grid grid-cols-3 gap-2">
                              {['A', 'B', 'D', 'N/A'].map(s => {
                                const isActive = scores[req.id] === s;
                                let colorClass = 'bg-white text-surface-400 border-surface-200';
                                if (isActive) {
                                  if (s === 'A') colorClass = 'bg-emerald-500 text-white border-emerald-500';
                                  else if (s === 'B') colorClass = 'bg-blue-500 text-white border-blue-500 shadow-md';
                                  else if (s === 'D') colorClass = 'bg-red-500 text-white border-red-500 shadow-md';
                                  else colorClass = 'bg-surface-400 text-white border-surface-400';
                                }

                                return (
                                  <button
                                    key={s}
                                    onClick={() => handleScoreChange(req.id, s as IFSScore)}
                                    className={`py-3 rounded-xl font-mono text-[10px] font-bold transition-all border ${colorClass}`}
                                  >
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {scores[req.id] && scores[req.id] !== 'N/A' && (
                            <div className="space-y-4">
                              <div>
                                <label className={`micro-label block mb-3 ${scores[req.id] === 'A' ? '!text-surface-400' : '!text-orange-600 font-black'}`}>
                                  {scores[req.id] === 'A' ? 'NOTIZ (OPTIONAL)' : scores[req.id] === 'D' ? 'KO-NICHTKONFORMITÄT BESCHREIBEN *' : 'KO-ABWEICHUNG BESCHREIBEN *'}
                                </label>
                                <textarea
                                  value={comments[req.id] || ''}
                                  onChange={(e) => handleCommentChange(req.id, e.target.value)}
                                  placeholder={scores[req.id] === 'A' ? "Optionale Notiz..." : "Pflichtfeld: Begründung..."}
                                  className={`w-full h-24 text-xs p-4 bg-white border rounded-2xl font-medium focus:ring-2 transition-all resize-none outline-none ${
                                    scores[req.id] === 'A' ? 'border-surface-200 focus:ring-primary-500' : 
                                    scores[req.id] === 'D' ? 'border-red-500 focus:ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' :
                                    'border-orange-500 focus:ring-orange-500'
                                  }`}
                                />
                              </div>

                              {scores[req.id] === 'D' && (
                                <div>
                                  <label className="micro-label block mb-3 !text-red-600 font-black">SOFORTMASSNAHME *</label>
                                  <textarea
                                    value={immediateActions[req.id] || ''}
                                    onChange={(e) => handleImmediateActionChange(req.id, e.target.value)}
                                    placeholder="Pflichtfeld: Sofortmaßnahme..."
                                    className="w-full h-24 text-xs p-4 bg-white border border-red-500 rounded-2xl font-medium focus:ring-2 focus:ring-red-500 transition-all resize-none outline-none"
                                  />
                                </div>
                              )}
                              
                              {scores[req.id] === 'D' && (
                                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl">
                                  <p className="text-[10px] text-red-700 font-black flex items-center gap-2">
                                    <AlertCircle size={14} />
                                    KO-NICHTKONFORMITÄT — AUDIT NICHT BESTANDEN
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-10 max-w-7xl mx-auto space-y-10">
              <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 pb-10 border-b border-surface-200">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="micro-label bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full">Abschnitt 0{activeChapter}</span>
                    <h2 className="text-4xl font-display font-black tracking-tight text-surface-900">
                      {IFS_CHAPTERS.find(c => c.id === activeChapter)?.title}
                    </h2>
                  </div>
                  <p className="text-surface-500 font-medium text-base max-w-3xl leading-relaxed italic font-serif opacity-80">{IFS_CHAPTERS.find(c => c.id === activeChapter)?.description}</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-start xl:justify-end gap-4">
                    <button 
                      onClick={() => setProblemsOnly(!problemsOnly)}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl micro-label transition-all ${problemsOnly ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-surface-500 border border-surface-200'}`}
                    >
                      <AlertCircle size={16} />
                      NUR PROBLEME ANZEIGEN
                    </button>
                  </div>
                  <div className="text-left xl:text-right w-full">
                    <p className="micro-label mb-3 ml-1 xl:ml-0">Unterkapitel</p>
                    <div className="flex gap-2 flex-wrap justify-start xl:justify-end">
                      <button 
                        onClick={() => setActiveSubChapter(null)}
                        className={`micro-label px-5 py-2.5 rounded-xl transition-all ${!activeSubChapter ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-surface-500 border border-surface-200 hover:border-primary-500 hover:text-primary-600'}`}
                      >
                        Alle
                      </button>
                      {subChapters.map(sc => (
                        <button 
                          key={sc}
                          onClick={() => setActiveSubChapter(sc)}
                          className={`micro-label px-5 py-2.5 rounded-xl transition-all ${activeSubChapter === sc ? 'bg-primary-600 text-white shadow-lg' : 'bg-white text-surface-500 border border-surface-200 hover:border-primary-500 hover:text-primary-600'}`}
                        >
                          {sc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-8">
                {filteredRequirements.map((req) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={req.id}
                    className={`bg-white border rounded-3xl p-10 subtle-shadow hover:shadow-xl transition-all group hover-lift relative overflow-hidden ${
                      req.isKO ? 'border-l-[12px] border-l-red-500' : 
                      scores[req.id] ? 'border-orange-200 bg-orange-50/20' : 'border-primary-100'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row gap-12">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <span className={`text-3xl font-display font-black transition-colors ${scores[req.id] ? 'text-orange-500' : 'text-black'}`}>
                              {req.id}
                            </span>
                            <div className="space-y-1">
                              {req.isKO && (
                                <span className="bg-red-50 text-red-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-[0.15em]">Knock-out Kriterium</span>
                              )}
                              {scores[req.id] && (
                                <span className="bg-orange-100 text-orange-700 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-[0.15em] ml-2">Bewertet</span>
                              )}
                              <h3 className="font-display font-bold text-xl text-surface-900">{req.title}</h3>
                            </div>
                          </div>
                        </div>
                        <p className="text-surface-500 leading-relaxed font-medium mb-10 text-pretty">{req.description}</p>
                        
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => explainRequirement(req)}
                            className="bg-primary-50 text-primary-700 px-6 py-3 rounded-2xl micro-label hover:bg-primary-600 hover:text-white transition-all flex items-center gap-3 border border-primary-100"
                          >
                            <Sparkles size={16} className="text-amber-500" />
                            INTERPRETATIONSHILFE
                          </button>
                        </div>
                      </div>

                      {currentAuditId ? (
                        <div className="w-full lg:w-80 space-y-6 bg-white/60 p-8 rounded-3xl border border-primary-100">
                          <div>
                            <label className="micro-label block mb-4">BEWERTUNG</label>
                            <div className="grid grid-cols-3 gap-2">
                              {(req.isKO ? ['A', 'B', 'D', 'N/A'] : ['A', 'B', 'C', 'D', 'Major', 'N/A']).map(s => {
                                const isActive = scores[req.id] === s;
                                let colorClass = 'bg-white text-surface-400 border-surface-200';
                                if (isActive) {
                                  if (s === 'A') colorClass = 'bg-emerald-500 text-white border-emerald-500';
                                  else if (s === 'B') colorClass = 'bg-blue-500 text-white border-blue-500';
                                  else if (s === 'C') colorClass = 'bg-orange-400 text-white border-orange-400';
                                  else if (s === 'D' || s === 'Major') colorClass = 'bg-red-500 text-white border-red-500';
                                  else colorClass = 'bg-surface-400 text-white border-surface-400';
                                }

                                return (
                                  <button
                                    key={s}
                                    onClick={() => handleScoreChange(req.id, s as IFSScore)}
                                    className={`py-3 rounded-xl font-mono text-[10px] font-bold transition-all border ${colorClass}`}
                                  >
                                    {s}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {scores[req.id] && scores[req.id] !== 'N/A' && (
                            <div className="space-y-4">
                              <div>
                                <label className={`micro-label block mb-3 ${scores[req.id] === 'A' ? '!text-surface-400' : '!text-orange-600 font-black'}`}>
                                  {scores[req.id] === 'A' ? 'NOTIZ (OPTIONAL)' : scores[req.id] === 'Major' || (req.isKO && scores[req.id] === 'D') ? 'NICHTKONFORMITÄT BESCHREIBEN *' : 'ABWEICHUNG BESCHREIBEN *'}
                                </label>
                                <textarea
                                  value={comments[req.id] || ''}
                                  onChange={(e) => handleCommentChange(req.id, e.target.value)}
                                  placeholder={scores[req.id] === 'A' ? "Optionale Notiz..." : "Pflichtfeld: Begründung/Abweichung..."}
                                  className={`w-full h-24 text-xs p-4 bg-white border rounded-2xl font-medium focus:ring-2 transition-all resize-none outline-none ${
                                    scores[req.id] === 'A' ? 'border-surface-200 focus:ring-primary-500' : 
                                    scores[req.id] === 'Major' || (req.isKO && scores[req.id] === 'D') ? 'border-red-500 focus:ring-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' :
                                    'border-orange-500 focus:ring-orange-500'
                                  }`}
                                />
                              </div>

                              {(scores[req.id] === 'Major' || (req.isKO && scores[req.id] === 'D')) && (
                                <div>
                                  <label className="micro-label block mb-3 !text-red-600 font-black">SOFORTMASSNAHME *</label>
                                  <textarea
                                    value={immediateActions[req.id] || ''}
                                    onChange={(e) => handleImmediateActionChange(req.id, e.target.value)}
                                    placeholder="Pflichtfeld: Sofortmaßnahme..."
                                    className="w-full h-24 text-xs p-4 bg-white border border-red-500 rounded-2xl font-medium focus:ring-2 focus:ring-red-500 transition-all resize-none outline-none"
                                  />
                                </div>
                              )}
                              
                              {req.isKO && scores[req.id] === 'D' && (
                                <div className="bg-red-50 border border-red-200 p-4 rounded-2xl">
                                  <p className="text-[10px] text-red-700 font-black flex items-center gap-2">
                                    <AlertCircle size={14} />
                                    KO-NICHTKONFORMITÄT — AUDIT NICHT BESTANDEN
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full lg:w-80 p-8 rounded-3xl border border-dashed border-surface-200 bg-surface-50/50 flex flex-col items-center justify-center text-center">
                          <ClipboardCheck size={32} className="text-surface-300 mb-4" />
                          <p className="micro-label !text-surface-400 leading-relaxed">
                            Um Bewertungen abzugeben, müssen Sie zuerst im Dashboard ein <br/>
                            <span className="text-primary-600 font-bold">Audit starten</span>.
                          </p>
                          <button 
                            onClick={() => setView('dashboard')}
                            className="mt-6 micro-label text-[10px] text-primary-600 hover:underline"
                          >
                            ZUM DASHBOARD →
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="h-16 bg-white border-t border-surface-200 px-10 flex items-center justify-between shrink-0">
          <div className="flex gap-10">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-sm shadow-red-500/50"></div>
              <span className="micro-label">
                {stats.anzahlMajors + Object.values(scores).filter(s => s === 'D').length} Kritische Befunde
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${stats.hasKOfail ? 'bg-red-500 shadow-red-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`}></div>
              <span className="micro-label">
                SCORE: {Math.round(stats.finalScore)}% {stats.hasKOfail && '(Zertifikat ausgeschlossen)'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-primary-500 rounded-full shadow-sm shadow-primary-500/50"></div>
              <span className="micro-label">
                {Object.keys(scores).length} Geprüft
              </span>
            </div>
          </div>
          <div className="micro-label !text-surface-300">
            IFS CORE INTELLIGENCE &copy; 2024
          </div>
        </footer>
      </main>

      {/* AI Assistant Overlay */}
      <AnimatePresence>
        {explainingId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1A1A1A]/30 backdrop-blur-sm z-50 flex items-center justify-end p-4 md:p-8"
            onClick={() => setExplainingId(null)}
          >
            <motion.div 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-full max-w-xl bg-white h-full md:rounded-l-[40px] shadow-2xl flex flex-col overflow-hidden border-l border-surface-200"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-10 border-b border-surface-100 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-900 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="text-amber-400" size={24} />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-xl text-surface-900 leading-none">IFS Experte</h2>
                    <p className="micro-label !text-primary-600 mt-1">Anforderungs-Analyse</p>
                  </div>
                </div>
                <button 
                  onClick={() => setExplainingId(null)}
                  className="p-3 hover:bg-surface-100 rounded-2xl transition-all text-surface-400 hover:text-surface-900"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 bg-gradient-to-b from-white to-surface-50">
                {isExplaining ? (
                  <div className="space-y-8">
                    <div className="h-8 bg-surface-100 rounded-2xl w-3/4 animate-pulse"></div>
                    <div className="h-5 bg-surface-100 rounded-2xl w-1/2 animate-pulse"></div>
                    <div className="space-y-4 pt-6">
                        <div className="h-4 bg-surface-50 rounded-2xl w-full animate-pulse"></div>
                        <div className="h-4 bg-surface-50 rounded-2xl w-full animate-pulse"></div>
                        <div className="h-4 bg-surface-50 rounded-2xl w-5/6 animate-pulse"></div>
                        <div className="h-4 bg-surface-50 rounded-2xl w-full animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-emerald max-w-none font-sans text-surface-700 leading-relaxed font-medium markdown-body">
                    <ReactMarkdown>
                      {explanation || "Keine Erklärung verfügbar."}
                    </ReactMarkdown>
                  </div>
                )}
              </div>

              <div className="p-10 border-t border-surface-100 bg-white">
                <p className="micro-label !text-surface-400 text-center leading-loose">
                   KI-Vorschläge basieren auf den offiziellen <br/>
                   <span className="text-primary-600">IFS Food v8 Guidelines</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Audit Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000]/40 backdrop-blur-md z-[100] flex items-center justify-center p-6"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white p-12 rounded-[40px] shadow-2xl w-full max-w-lg border border-surface-100"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white mb-4">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-3xl font-display font-black uppercase tracking-tight text-surface-900">Neues Audit</h2>
                  <p className="micro-label !text-surface-400">Geben Sie den Namen des Unternehmens ein</p>
                </div>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-3 hover:bg-surface-50 rounded-2xl transition-all text-surface-300 hover:text-surface-900"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="micro-label block mb-4 ml-1">UNTERNEHMENSNAME</label>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="z.B. Müller & Sohn GmbH"
                    value={newAuditName}
                    onChange={(e) => setNewAuditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && createAudit()}
                    className="w-full px-8 py-5 bg-surface-50 border border-surface-200 rounded-2xl font-bold text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-surface-300"
                  />
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-8 py-5 rounded-2xl micro-label text-surface-400 hover:bg-surface-50 transition-all font-bold"
                  >
                    ABBRECHEN
                  </button>
                  <button 
                    disabled={!newAuditName.trim() || isCreatingAudit}
                    onClick={createAudit}
                    className="flex-[2] bg-primary-600 text-white px-8 py-5 rounded-2xl micro-label hover:bg-black transition-all shadow-xl shadow-primary-600/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isCreatingAudit ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'AUDIT STARTEN'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {auditToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-6"
            onClick={() => setAuditToDelete(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-surface-100"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-2xl font-display font-black uppercase tracking-tight text-surface-900">Audit löschen?</h3>
                <p className="text-surface-500 font-medium leading-relaxed">
                  Möchten Sie diesen Bericht wirklich unwiderruflich löschen? Dieser Vorgang kann nicht rückgängig gemacht werden.
                </p>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setAuditToDelete(null)}
                    className="flex-1 py-4 px-6 rounded-2xl micro-label font-bold text-surface-400 hover:bg-surface-50 transition-all"
                  >
                    ABBRECHEN
                  </button>
                  <button 
                    onClick={deleteAudit}
                    className="flex-1 py-4 px-6 rounded-2xl micro-label font-bold bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                  >
                    LÖSCHEN
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* KO Warning Modal */}
      <AnimatePresence>
        {showKOWarning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-950/60 backdrop-blur-xl z-[150] flex items-center justify-center p-6"
            onClick={() => setShowKOWarning(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="bg-white p-12 rounded-[50px] shadow-[0_0_100px_rgba(220,38,38,0.3)] w-full max-w-xl border-4 border-red-500 text-center space-y-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50 animate-bounce">
                <AlertCircle size={48} strokeWidth={3} />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-display font-black uppercase text-red-600 tracking-tighter">KO-KRITERIUM NICHT ERFÜLLT</h3>
                <p className="text-surface-600 font-medium leading-relaxed text-lg">
                  Ein <span className="font-bold text-red-600">D-Score</span> bei einer <span className="font-bold">KO-Anforderung</span> führt zum sofortigen <span className="font-black text-red-700">Zertifikatsausschluss</span> und einem Punktabzug von 50%.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowKOWarning(null)}
                  className="flex-1 py-5 px-8 rounded-3xl micro-label font-bold text-surface-400 hover:bg-surface-50 transition-all"
                >
                  ABBRECHEN
                </button>
                <button 
                  onClick={() => {
                    if (showKOWarning) {
                      const { id, score } = showKOWarning;
                      setShowKOWarning(null);
                      saveRequirement(id, { score, comment: comments[id] || '', immediateAction: immediateActions[id] || '' });
                      setScores(prev => ({ ...prev, [id]: score }));
                    }
                  }}
                  className="flex-1 py-5 px-8 rounded-3xl micro-label font-bold bg-red-600 text-white hover:bg-black transition-all shadow-2xl shadow-red-600/40"
                >
                  BESTÄTIGEN
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


