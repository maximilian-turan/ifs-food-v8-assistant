import { Clock, CheckCircle2, AlertCircle, Plus, Calendar, User, UserCheck, ShieldCheck, X, Save, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useEffect } from 'react';
import { IFSShiftLog } from '../types';
import { db, auth } from '../lib/firebase';
import { collection, onSnapshot, query, orderBy, setDoc, doc, serverTimestamp, deleteDoc, where } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firebase';

const INITIAL_FORM: Partial<IFSShiftLog> = {
  shift: 'Früh',
  auditor: '',
  employeeCount: 0,
  checks: {
    hairnet: true,
    protectiveClothing: true,
    noJewelry: true,
    woundsCovered: true,
    noIllness: true,
    handsSanitized: true
  },
  deviations: '',
  action: ''
};

export default function ShiftLogs() {
  const [logs, setLogs] = useState<IFSShiftLog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState<Partial<IFSShiftLog> | null>(null);
  const [loading, setLoading] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  
  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'shiftlogs'), 
      where('ownerId', '==', auth.currentUser.uid),
      orderBy('date', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as IFSShiftLog)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'shiftlogs'));
  }, []);

  const todayLogs = useMemo(() => {
    return logs.filter(l => l.date === today);
  }, [logs, today]);

  const ko3Status = todayLogs.length;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog || !auth.currentUser) return;
    setLoading(true);

    try {
      const id = editingLog.id || `log_${Date.now()}`;
      const logData = {
        ...editingLog,
        id,
        date: editingLog.date || today,
        ownerId: auth.currentUser.uid,
        updatedAt: serverTimestamp()
      };
      
      await setDoc(doc(db, 'shiftlogs', id), logData, { merge: true });
      setShowModal(false);
      setEditingLog(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'shiftlogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Protokoll wirklich löschen?')) return;
    try {
      await deleteDoc(doc(db, 'shiftlogs', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `shiftlogs/${id}`);
    }
  };

  return (
    <div className="p-10 md:p-16 max-w-7xl mx-auto space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 pb-10 border-b border-surface-200">
        <div className="space-y-4">
          <h2 className="text-6xl font-display font-black tracking-tight text-surface-900 leading-none">Schichtprotokoll</h2>
          <p className="micro-label">Personalhygiene-Kontrolle &bull; IFS §3.2.2 (KO Nr. 3)</p>
        </div>
        <button 
          onClick={() => {
            setEditingLog({ ...INITIAL_FORM, date: today, auditor: auth.currentUser?.displayName || '' });
            setShowModal(true);
          }}
          className="bg-primary-600 text-white px-8 py-4 rounded-2xl micro-label hover:bg-black transition-all shadow-xl shadow-primary-600/20 active:scale-95 flex items-center gap-2"
        >
          <Plus size={18} />
          NEUE KONTROLLE
        </button>
      </div>

      <div className="bg-surface-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10 text-center md:text-left">
          <div className="space-y-4">
            <h3 className="text-4xl font-display font-black uppercase tracking-tight">KO 3 STATUS HEUTE</h3>
            <p className="text-white/40 text-sm font-medium tracking-widest uppercase italic">Personalhygiene muss pro Schicht protokolliert werden</p>
          </div>
          <div className="flex items-center gap-10">
             <div className="text-center">
                <p className={`text-7xl font-display font-black ${ko3Status >= 3 ? 'text-emerald-500' : 'text-amber-400'}`}>
                   {ko3Status}/3
                </p>
                <p className="micro-label !text-white/30">Schichten</p>
             </div>
             <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 ${ko3Status >= 3 ? 'border-emerald-500 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'border-amber-400 text-amber-400 animate-pulse'}`}>
                {ko3Status >= 3 ? <ShieldCheck size={40} /> : <AlertCircle size={40} />}
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </div>

      <div className="space-y-10">
        <h3 className="text-2xl font-display font-black uppercase tracking-tight text-surface-900">Letzte Protokolle</h3>
        <div className="grid gap-6">
          {logs.map(log => (
             <motion.div layout key={log.id} className="bg-white border border-surface-200 rounded-[40px] p-10 shadow-sm hover:shadow-xl transition-all group relative">
                <div className="flex flex-col lg:flex-row gap-10">
                   <div className="w-full lg:w-64 space-y-4 shrink-0">
                      <div className="flex items-center gap-3">
                         <Calendar size={16} className="text-primary-500" />
                         <span className="text-sm font-black uppercase text-surface-900">{log.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <Clock size={16} className="text-primary-500" />
                         <span className="text-sm font-black uppercase text-surface-900">{log.shift}schicht</span>
                      </div>
                      <div className="flex items-center gap-3">
                         <User size={16} className="text-primary-500" />
                         <span className="text-sm font-bold text-surface-600">{log.auditor}</span>
                      </div>
                      <div className="pt-4 border-t border-surface-100 flex items-center gap-3">
                         <UserCheck size={16} className="text-emerald-500" />
                         <span className="text-xs font-black text-surface-900">{log.employeeCount} Mitarbeiter</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={() => { setEditingLog(log); setShowModal(true); }}
                          className="p-2 hover:bg-primary-50 text-surface-400 hover:text-primary-600 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(log.id)}
                          className="p-2 hover:bg-red-50 text-surface-400 hover:text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                   </div>

                   <div className="flex-1 space-y-8">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                         {Object.entries(log.checks).map(([key, val]) => (
                           <div key={key} className="flex items-center gap-3">
                              {val ? <CheckCircle2 className="text-emerald-500" size={18} /> : <AlertCircle className="text-red-500" size={18} />}
                              <span className="text-[10px] font-bold text-surface-600 leading-tight">
                                 {key === 'hairnet' ? 'HAARNETZ KORREKT' :
                                  key === 'protectiveClothing' ? 'KLEIDUNG SAUBER' :
                                  key === 'noJewelry' ? 'KEIN SCHMUCK' :
                                  key === 'woundsCovered' ? 'PFLASTER/WUNDEN' :
                                  key === 'noIllness' ? 'KEINE KRANKH.' : 'HÄNDE DESINF.'}
                              </span>
                           </div>
                         ))}
                      </div>

                      {log.deviations && (
                         <div className="p-8 bg-amber-50 rounded-3xl border border-amber-200 space-y-4">
                            <p className="text-[10px] font-black uppercase text-amber-700">Beanstandungen</p>
                            <p className="text-sm font-medium italic text-amber-900 leading-relaxed">"{log.deviations}"</p>
                            <div className="pt-4 border-t border-amber-200/50">
                               <p className="text-[10px] font-black uppercase text-amber-700">Maßnahme</p>
                               <p className="text-sm font-bold text-amber-900">{log.action}</p>
                            </div>
                         </div>
                      )}
                   </div>
                </div>
             </motion.div>
          ))}
          {logs.length === 0 && (
            <div className="py-20 text-center bg-surface-50 border-4 border-dashed border-surface-200 rounded-[40px]">
              <Clock className="mx-auto text-surface-200 mb-6" size={48} />
              <p className="micro-label !text-surface-300">Noch keine Protokolle vorhanden</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && editingLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowModal(false); setEditingLog(null); }}
              className="absolute inset-0 bg-surface-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-surface-100 flex justify-between items-center bg-surface-50">
                <div>
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-surface-900">
                    {editingLog.id ? 'Protokoll Bearbeiten' : 'Neue Schichtkontrolle'}
                  </h3>
                  <p className="micro-label">Personalhygiene-Prüfung</p>
                </div>
                <button onClick={() => { setShowModal(false); setEditingLog(null); }} className="p-4 hover:bg-white rounded-2xl transition-all">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-8 overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="micro-label !text-surface-400">Datum</label>
                    <input 
                      type="date"
                      required
                      value={editingLog.date}
                      onChange={e => setEditingLog({ ...editingLog, date: e.target.value })}
                      className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="micro-label !text-surface-400">Schicht</label>
                    <select 
                      value={editingLog.shift}
                      onChange={e => setEditingLog({ ...editingLog, shift: e.target.value as any })}
                      className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="Früh">Frühschicht</option>
                      <option value="Spät">Spätschicht</option>
                      <option value="Nacht">Nachtschicht</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="micro-label !text-surface-400">Kontrolleur</label>
                    <input 
                      type="text"
                      required
                      value={editingLog.auditor}
                      onChange={e => setEditingLog({ ...editingLog, auditor: e.target.value })}
                      className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="micro-label !text-surface-400">Anzahl Mitarbeiter</label>
                    <input 
                      type="number"
                      required
                      value={editingLog.employeeCount}
                      onChange={e => setEditingLog({ ...editingLog, employeeCount: parseInt(e.target.value) })}
                      className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="micro-label !text-surface-400">Checkliste</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(editingLog.checks || {}).map(([key, val]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setEditingLog({
                          ...editingLog,
                          checks: { ...editingLog.checks!, [key]: !val }
                        })}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          val ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase">
                           {key === 'hairnet' ? 'Haarnetz korrekt' :
                            key === 'protectiveClothing' ? 'Schutzkleidung sauber' :
                            key === 'noJewelry' ? 'Kein Schmuck/Uhr' :
                            key === 'woundsCovered' ? 'Wunden/Pflaster OK' :
                            key === 'noIllness' ? 'Keine Erkr.' : 'Hände desinfiziert'}
                        </span>
                        {val ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="micro-label !text-surface-400">Beanstandungen (Optional)</label>
                    <textarea 
                      value={editingLog.deviations}
                      onChange={e => setEditingLog({ ...editingLog, deviations: e.target.value })}
                      className="w-full p-4 bg-surface-50 border border-surface-200 rounded-2xl font-medium text-xs h-24 resize-none outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  {editingLog.deviations && (
                    <div className="space-y-2">
                      <label className="micro-label !text-orange-600 font-black">Maßnahme (Pflicht bei Beanstandung)</label>
                      <input 
                        type="text"
                        required
                        value={editingLog.action}
                        onChange={e => setEditingLog({ ...editingLog, action: e.target.value })}
                        className="w-full p-4 bg-orange-50 border border-orange-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-surface-100 flex gap-4">
                   <button 
                    disabled={loading}
                    type="submit" 
                    className="flex-1 bg-primary-600 text-white py-5 rounded-3xl micro-label hover:bg-black transition-all shadow-xl shadow-primary-600/20 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    <Save size={20} />
                    {loading ? 'SPEICHERT...' : 'PROTOKOLL SPEICHERN'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
