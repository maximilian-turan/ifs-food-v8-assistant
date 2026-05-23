
export type IFSScore = 'A' | 'B' | 'C' | 'D' | 'Major' | 'N/A';

export interface IFSRequirement {
  id: string; // e.g. "1.1.1"
  chapter: number;
  subChapter?: string;
  title: string;
  description: string;
  isKO: boolean;
  score?: IFSScore;
  comment?: string;
  immediateAction?: string;
}

export interface IFSChapter {
  id: number;
  title: string;
  description: string;
}

export interface IFSAudit {
  id: string;
  companyName: string;
  date: string;
  auditorName: string;
  status: 'draft' | 'completed';
  requirements: Record<string, IFSScore>; // requirementId -> score
  comments: Record<string, string>; // requirementId -> deviation/comment
  immediateActions: Record<string, string>; // requirementId -> immediate action
}

export interface IFSMeasure {
  id: string;
  reqNo: string;
  reqTitle: string;
  score: IFSScore;
  deviation: string;
  type: 'Korrektur' | 'Korrekturmaßnahme';
  responsible: string;
  deadline: string;
  status: 'offen' | 'in_bearbeitung' | 'umgesetzt' | 'wirksam_geprueft';
  createdAt: string;
}

export interface IFSSupplier {
  id: string;
  name: string;
  category: 'Rohware' | 'Verpackung' | 'Dienstleistung';
  isIfsCertified: boolean;
  certExpiry: string | null;
  status: 'freigegeben' | 'gesperrt' | 'in_pruefung';
  lastEvaluation: string;
  rawMaterials: string[];
}

export interface IFSWalkthrough {
  id: string;
  area: string;
  date: string;
  shift: 'Früh' | 'Spät' | 'Nacht';
  auditor: string;
  topics: string[];
  findings: string;
  actionRequired: boolean;
  actionDetails?: string;
  responsible?: string;
  deadline?: string;
}

export interface IFSShiftLog {
  id: string;
  date: string;
  shift: 'Früh' | 'Spät' | 'Nacht';
  auditor: string;
  employeeCount: number;
  checks: {
    hairnet: boolean;
    protectiveClothing: boolean;
    noJewelry: boolean;
    woundsCovered: boolean;
    noIllness: boolean;
    handsSanitized: boolean;
  };
  deviations: string;
  action: string;
}

export interface IFSDocumentDeadline {
  name: string;
  ifsRef: string;
  deadline: string;
  responsible?: string;
}

export const IFS_CHAPTERS: IFSChapter[] = [
  { id: 1, title: 'Unternehmensführung & -verpflichtung', description: 'Verantwortung der Unternehmensleitung, Politik, Struktur und Managementbewertung.' },
  { id: 2, title: 'QM- & Lebensmittelsicherheits-System', description: 'HACCP-System, Dokumentationsanforderungen und Aufzeichnungen.' },
  { id: 3, title: 'Ressourcenmanagement', description: 'Personalressourcen, Hygiene, Schulung und Sozialeinrichtungen.' },
  { id: 4, title: 'Operative Abläufe', description: 'Größtes Kapitel: Von Einkauf über Produktion bis hin zu Rückverfolgbarkeit und Produktschutz.' },
  { id: 5, title: 'Messungen, Analysen, Verbesserungen', description: 'Interne Audits, Betriebsbegehungen, Prozesskontrolle und Korrekturmaßnahmen.' },
];
