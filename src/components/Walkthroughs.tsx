
import { Footprints, Plus, CheckCircle2, AlertCircle, User, ChevronRight, X, Camera, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useEffect } from 'react';
import { IFSWalkthrough } from '../types';
import { supabase, mapWalkthrough } from '../lib/supabase';
import { resizeImageFile } from '../lib/imageResize';
import { analyzeWalkthroughPhotos } from '../services/ai';

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

const WALKTHROUGH_TOPICS = [
  'Baulicher Zustand',
  'Außenbereiche',
  'Produktkontrolle während der Verarbeitung',
  'Hygiene während der Verarbeitung',
  'Fremdkörper/-materialien',
  'Personalhygiene',
];

const SHIFTS: IFSWalkthrough['shift'][] = ['Früh', 'Spät', 'Nacht'];

interface PhotoDraft {
  file: File;
  previewUrl: string;
}

interface WalkthroughForm {
  area: string;
  date: string;
  shift: IFSWalkthrough['shift'];
  auditor: string;
  topics: string[];
  findings: string;
  actionRequired: boolean;
  actionDetails: string;
  responsible: string;
  deadline: string;
}

function emptyForm(): WalkthroughForm {
  return {
    area: BEREICHE[0],
    date: new Date().toISOString().slice(0, 10),
    shift: 'Früh',
    auditor: 'Lokaler Nutzer',
    topics: [],
    findings: '',
    actionRequired: false,
    actionDetails: '',
    responsible: '',
    deadline: '',
  };
}

export default function Walkthroughs() {
  const [walkthroughs, setWalkthroughs] = useState<IFSWalkthrough[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string[]>>({});

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<WalkthroughForm>(emptyForm());
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('walkthroughs')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data }) => {
        setWalkthroughs((data || []).map(mapWalkthrough));
        setIsLoadingList(false);
      });
  }, []);

  useEffect(() => {
    const allPaths = walkthroughs.flatMap(w => w.photoPaths);
    if (allPaths.length === 0) {
      setPhotoUrls({});
      return;
    }
    supabase.storage
      .from('walkthrough-photos')
      .createSignedUrls(allPaths, 3600)
      .then(({ data }) => {
        if (!data) return;
        const urlByPath: Record<string, string> = {};
        data.forEach(entry => {
          if (entry.signedUrl && entry.path) urlByPath[entry.path] = entry.signedUrl;
        });
        const grouped: Record<string, string[]> = {};
        walkthroughs.forEach(w => {
          grouped[w.id] = w.photoPaths.map(p => urlByPath[p]).filter((u): u is string => Boolean(u));
        });
        setPhotoUrls(grouped);
      });
  }, [walkthroughs]);

  const lastWalkthroughs = useMemo(() => {
    const map: Record<string, string> = {};
    walkthroughs.forEach(w => {
      if (!map[w.area] || new Date(w.date) > new Date(map[w.area])) {
        map[w.area] = w.date;
      }
    });
    return map;
  }, [walkthroughs]);

  function toggleTopic(topic: string) {
    setForm(prev => ({
      ...prev,
      topics: prev.topics.includes(topic) ? prev.topics.filter(t => t !== topic) : [...prev.topics, topic],
    }));
  }

  function addPhotos(fileList: FileList | null) {
    const files = Array.from(fileList || []);
    const drafts = files.map(file => ({ file, previewUrl: URL.createObjectURL(file) }));
    setPhotos(prev => [...prev, ...drafts]);
  }

  function removePhoto(index: number) {
    setPhotos(prev => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].previewUrl);
      next.splice(index, 1);
      return next;
    });
  }

  function closeModal() {
    photos.forEach(p => URL.revokeObjectURL(p.previewUrl));
    setShowModal(false);
    setForm(emptyForm());
    setPhotos([]);
    setAnalysisError(null);
    setSaveError(null);
  }

  async function analyzePhotos() {
    if (photos.length === 0) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const resized = await Promise.all(photos.map(p => resizeImageFile(p.file)));
      const images = resized.map(img => ({ data: img.base64, mediaType: img.mediaType }));
      const report = await analyzeWalkthroughPhotos(form.area, form.topics, images);
      setForm(prev => ({ ...prev, findings: report }));
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : 'Fehler bei der Fotoanalyse.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function saveWalkthrough() {
    if (!form.area || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const id = `walkthrough_${Date.now()}`;

      const uploadResults = await Promise.allSettled(
        photos.map(draft => {
          const path = `${id}/${Date.now()}-${draft.file.name}`;
          return supabase.storage.from('walkthrough-photos').upload(path, draft.file).then(({ error }) => {
            if (error) throw error;
            return path;
          });
        })
      );

      const photoPaths = uploadResults
        .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
        .map(r => r.value);
      const failedUploadCount = uploadResults.length - photoPaths.length;

      const parsedDate = new Date(form.date);
      if (Number.isNaN(parsedDate.getTime())) {
        throw new Error('Ungültiges Datum. Bitte ein gültiges Datum auswählen.');
      }

      const { data, error } = await supabase
        .from('walkthroughs')
        .insert({
          id,
          area: form.area,
          date: parsedDate.toISOString(),
          shift: form.shift,
          auditor: form.auditor,
          topics: form.topics,
          findings: form.findings,
          action_required: form.actionRequired,
          action_details: form.actionDetails,
          responsible: form.responsible,
          deadline: form.deadline || null,
          photo_paths: photoPaths,
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Begehung konnte nicht gespeichert werden.');

      setWalkthroughs(prev => [mapWalkthrough(data), ...prev]);

      if (failedUploadCount > 0) {
        setSaveError(`Begehung gespeichert, aber ${failedUploadCount} von ${uploadResults.length} Fotos konnten nicht hochgeladen werden.`);
      } else {
        closeModal();
      }
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Fehler beim Speichern der Begehung.');
    } finally {
      setIsSaving(false);
    }
  }

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

        {isLoadingList && (
          <p className="text-sm font-bold text-surface-400">Lädt...</p>
        )}

        {!isLoadingList && walkthroughs.length === 0 && (
          <p className="text-sm font-bold text-surface-400">Noch keine Begehungen erfasst.</p>
        )}

        <div className="grid gap-6">
          {walkthroughs.map(w => (
            <div key={w.id} className="bg-white border border-surface-200 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row gap-10">
               <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                     <span className="text-xs font-mono font-bold text-surface-400">{new Date(w.date).toLocaleDateString()}</span>
                     <span className="bg-surface-100 text-surface-600 px-3 py-1 rounded-full text-[9px] font-black uppercase">{w.shift}schicht</span>
                     <h4 className="font-display font-bold text-lg text-surface-900 uppercase tracking-tight">{w.area}</h4>
                  </div>

                  <div className="space-y-4">
                     <p className="text-sm font-medium text-surface-600 leading-relaxed italic border-l-2 border-surface-100 pl-4 whitespace-pre-line">
                       {w.findings || 'Keine Befunde erfasst.'}
                     </p>
                     <div className="flex flex-wrap gap-2">
                        {w.topics.map(t => (
                          <span key={t} className="text-[9px] font-black uppercase text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">{t}</span>
                        ))}
                     </div>
                  </div>

                  {photoUrls[w.id] && photoUrls[w.id].length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {photoUrls[w.id].map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-xl overflow-hidden border border-surface-200 hover:ring-2 hover:ring-primary-500 transition-all">
                          <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                        </a>
                      ))}
                    </div>
                  )}

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

      {/* New Walkthrough Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000]/40 backdrop-blur-md z-[100] flex items-center justify-center p-6"
            onClick={() => !isSaving && closeModal()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white p-12 rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-surface-100"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white mb-4">
                    <Plus size={24} />
                  </div>
                  <h2 className="text-3xl font-display font-black uppercase tracking-tight text-surface-900">Neue Begehung</h2>
                  <p className="micro-label !text-surface-400">Bereich, Fotos und Befunde erfassen</p>
                </div>
                <button
                  onClick={closeModal}
                  disabled={isSaving}
                  className="p-3 hover:bg-surface-50 rounded-2xl transition-all text-surface-300 hover:text-surface-900 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="micro-label block mb-4 ml-1">BEREICH</label>
                    <select
                      value={form.area}
                      onChange={e => setForm(prev => ({ ...prev, area: e.target.value }))}
                      className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-bold text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    >
                      {BEREICHE.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="micro-label block mb-4 ml-1">SCHICHT</label>
                    <select
                      value={form.shift}
                      onChange={e => setForm(prev => ({ ...prev, shift: e.target.value as IFSWalkthrough['shift'] }))}
                      className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-bold text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    >
                      {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="micro-label block mb-4 ml-1">DATUM</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-bold text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="micro-label block mb-4 ml-1">PRÜFER</label>
                    <input
                      type="text"
                      value={form.auditor}
                      onChange={e => setForm(prev => ({ ...prev, auditor: e.target.value }))}
                      className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-bold text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="micro-label block mb-4 ml-1">THEMEN</label>
                  <div className="flex flex-wrap gap-2">
                    {WALKTHROUGH_TOPICS.map(topic => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                          form.topics.includes(topic)
                            ? 'bg-primary-600 text-white'
                            : 'bg-surface-50 text-surface-500 hover:bg-surface-100'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="micro-label block mb-4 ml-1">FOTOS</label>
                  <label className="flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-surface-200 rounded-2xl cursor-pointer hover:border-primary-400 hover:bg-surface-50 transition-all">
                    <Camera size={20} className="text-surface-400" />
                    <span className="text-sm font-bold text-surface-500">Fotos auswählen oder aufnehmen</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={e => { addPhotos(e.target.files); e.target.value = ''; }}
                      className="hidden"
                    />
                  </label>

                  {photos.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {photos.map((p, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-surface-200 group">
                          <img src={p.previewUrl} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                          >
                            <Trash2 size={16} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {photos.length > 0 && (
                    <button
                      type="button"
                      onClick={analyzePhotos}
                      disabled={isAnalyzing}
                      className="mt-4 flex items-center gap-2 px-6 py-3 bg-surface-900 text-white rounded-2xl micro-label hover:bg-black transition-all disabled:opacity-50"
                    >
                      {isAnalyzing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Sparkles size={16} />
                      )}
                      FOTOS ANALYSIEREN
                    </button>
                  )}

                  {analysisError && (
                    <p className="mt-3 text-xs font-bold text-red-600">{analysisError}</p>
                  )}
                </div>

                <div>
                  <label className="micro-label block mb-4 ml-1">BEFUNDE</label>
                  <textarea
                    value={form.findings}
                    onChange={e => setForm(prev => ({ ...prev, findings: e.target.value }))}
                    rows={5}
                    placeholder="Befunde eintragen oder Fotos analysieren lassen..."
                    className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-medium text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.actionRequired}
                    onChange={e => setForm(prev => ({ ...prev, actionRequired: e.target.checked }))}
                    className="w-5 h-5 rounded accent-primary-600"
                  />
                  <span className="text-sm font-bold text-surface-700">Handlungsbedarf</span>
                </label>

                {form.actionRequired && (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="micro-label block mb-4 ml-1">MASSNAHME</label>
                      <input
                        type="text"
                        value={form.actionDetails}
                        onChange={e => setForm(prev => ({ ...prev, actionDetails: e.target.value }))}
                        className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-medium text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="micro-label block mb-4 ml-1">VERANTWORTLICH</label>
                      <input
                        type="text"
                        value={form.responsible}
                        onChange={e => setForm(prev => ({ ...prev, responsible: e.target.value }))}
                        className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-medium text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="micro-label block mb-4 ml-1">FRIST</label>
                      <input
                        type="date"
                        value={form.deadline}
                        onChange={e => setForm(prev => ({ ...prev, deadline: e.target.value }))}
                        className="w-full px-6 py-4 bg-surface-50 border border-surface-200 rounded-2xl font-medium text-surface-900 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {saveError && (
                  <p className="text-xs font-bold text-red-600">{saveError}</p>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={closeModal}
                    disabled={isSaving}
                    className="flex-1 px-8 py-5 rounded-2xl micro-label text-surface-400 hover:bg-surface-50 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ABBRECHEN
                  </button>
                  <button
                    disabled={!form.area || isSaving}
                    onClick={saveWalkthrough}
                    className="flex-[2] bg-primary-600 text-white px-8 py-5 rounded-2xl micro-label hover:bg-black transition-all shadow-xl shadow-primary-600/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'BEGEHUNG SPEICHERN'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
