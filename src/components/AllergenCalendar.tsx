
import { Calendar, Download, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

const ALLERGEN_FARBEN: Record<string, string> = {
  "Gluten":  "#E6F1FB",   // blau
  "Sesam":   "#FCEBEB",   // rot
  "Milch":   "#FAEEDA",   // orange
  "Soja":    "#EAF3DE",   // grün
  "Ei":      "#EEEDFE",   // lila
  "Nüsse":   "#FAECE7"    // koralle
};

const TEXT_FARBEN: Record<string, string> = {
  "Gluten":  "#1E40AF",
  "Sesam":   "#B91C1C",
  "Milch":   "#B45309",
  "Soja":    "#166534",
  "Ei":      "#5B21B6",
  "Nüsse":   "#92400E"
};

const BEREICHE = ["Linie 1", "Linie 2", "Linie 3", "Linie 4"];
const WOCHENTAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

const MOCK_PROD = {
  "Linie 1": [
    { p: "Roggenmischbrot", a: ["Gluten"] },
    { p: "Weizenbrot", a: ["Gluten"] },
    { p: "Roggenbrot", a: ["Gluten"] },
    { p: "Dinkelbrot", a: ["Gluten"] },
    { p: "Roggenmischbrot", a: ["Gluten"] },
    { p: "-", a: [] },
    { p: "-", a: [] }
  ],
  "Linie 2": [
    { p: "Sesambrötchen", a: ["Gluten", "Sesam"] },
    { p: "Milchbrötchen", a: ["Gluten", "Milch", "Ei"] },
    { p: "Sojabrötchen", a: ["Gluten", "Soja"] },
    { p: "Sesambrötchen", a: ["Gluten", "Sesam"] },
    { p: "Nussstollen", a: ["Gluten", "Nüsse", "Milch"] },
    { p: "-", a: [] },
    { p: "-", a: [] }
  ],
  "Linie 3": [
    { p: "TK-Baguette", a: ["Gluten"] },
    { p: "TK-Sesambaguette", a: ["Gluten", "Sesam"] },
    { p: "TK-Baguette", a: ["Gluten"] },
    { p: "TK-Soja-Brot", a: ["Gluten", "Soja"] },
    { p: "TK-Baguette", a: ["Gluten"] },
    { p: "-", a: [] },
    { p: "-", a: [] }
  ],
  "Linie 4": [
    { p: "Bio-Brot", a: ["Gluten"] },
    { p: "Bio-Sesambrot", a: ["Gluten", "Sesam"] },
    { p: "Bio-Brot", a: ["Gluten"] },
    { p: "Bio-Brot", a: ["Gluten"] },
    { p: "Bio-Brot", a: ["Gluten"] },
    { p: "-", a: [] },
    { p: "-", a: [] }
  ]
};

export default function AllergenCalendar() {
  return (
    <div className="p-10 md:p-16 max-w-full mx-auto space-y-16 overflow-x-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 pb-10 border-b border-surface-200 min-w-max">
        <div className="space-y-4">
          <h2 className="text-6xl font-display font-black tracking-tight text-surface-900 leading-none">Allergen-Kalender</h2>
          <p className="micro-label">Produktionsplanung & Kreuzkontaminations-Prävention &bull; IFS §4.19</p>
        </div>
        <button className="bg-primary-600 text-white px-8 py-4 rounded-2xl micro-label hover:bg-black transition-all shadow-xl shadow-primary-600/20 active:scale-95 flex items-center gap-2">
          <Download size={18} />
          PDF EXPORTIEREN
        </button>
      </div>

      <div className="bg-white border border-surface-200 rounded-[40px] shadow-2xl overflow-hidden min-w-[1200px]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-surface-900 text-white">
              <th className="p-6 border-r border-white/5 micro-label !text-white/40 text-left w-48">Produktionslinie</th>
              {WOCHENTAGE.map(tag => (
                <th key={tag} className="p-6 border-r border-white/5 micro-label !text-white/40 text-center">{tag}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BEREICHE.map(linie => (
              <tr key={linie} className="border-b border-surface-100 last:border-0 hover:bg-surface-50/50 transition-colors">
                <td className="p-8 border-r border-surface-100 font-display font-black text-lg text-surface-900 uppercase tracking-tight bg-surface-50/30">{linie}</td>
                {WOCHENTAGE.map((_, dayIdx) => {
                  const data = MOCK_PROD[linie as keyof typeof MOCK_PROD][dayIdx];
                  const prevData = dayIdx > 0 ? MOCK_PROD[linie as keyof typeof MOCK_PROD][dayIdx - 1] : null;
                  const needsCleaning = prevData && prevData.a.includes('Sesam') && !data.a.includes('Sesam') && data.p !== '-';

                  return (
                    <td key={dayIdx} className="p-6 border-r border-surface-100 relative group align-top">
                       <div className="space-y-4">
                          <p className={`text-xs font-bold leading-tight ${data.p === '-' ? 'text-surface-200 italic' : 'text-surface-700'}`}>
                            {data.p}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {data.a.map(allergen => (
                              <span 
                                key={allergen} 
                                style={{ backgroundColor: ALLERGEN_FARBEN[allergen], color: TEXT_FARBEN[allergen] }}
                                className="text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border border-current border-opacity-10"
                              >
                                {allergen}
                              </span>
                            ))}
                          </div>
                          {needsCleaning && (
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-amber-100 text-amber-700 p-2.5 rounded-xl border border-amber-200 mt-4 shadow-sm"
                            >
                               <div className="flex items-center gap-1.5 micro-label !text-amber-800 font-black mb-1">
                                  <AlertTriangle size={12} />
                                  REINIGUNG
                               </div>
                               <p className="text-[9px] font-medium leading-tight">Allergenreinigung vor Start erforderlich!</p>
                            </motion.div>
                          )}
                       </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-surface-50 p-8 rounded-[32px] border border-surface-200 flex flex-col md:flex-row gap-10 items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center text-white">
               <Info size={20} />
            </div>
            <p className="text-xs font-semibold text-surface-500 max-w-xl leading-relaxed">
               Der Produktionsplan wird wöchentlich von der QS freigegeben. <br/>
               <span className="text-primary-600">Hinweis:</span> Bei Planänderungen muss das Reinigungsregime sofort angepasst werden.
            </p>
         </div>
         <div className="flex flex-wrap gap-4">
            {Object.keys(ALLERGEN_FARBEN).map(a => (
              <div key={a} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ALLERGEN_FARBEN[a] }}></div>
                 <span className="text-[10px] font-bold text-surface-400">{a}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
