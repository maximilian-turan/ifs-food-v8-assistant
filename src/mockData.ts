
import { IFSRequirement } from './types';

export const MOCK_REQUIREMENTS: IFSRequirement[] = [
  // KAPITEL 1: Unternehmensführung & -verpflichtung
  { 
    id: '1.1.1', 
    chapter: 1, 
    subChapter: '1.1 Politik', 
    title: 'Unternehmenspolitik', 
    description: 'Eine Unternehmenspolitik muss von der Unternehmensleitung entwickelt, umgesetzt und aufrechterhalten werden. Diese berücksichtigt mindestens: Lebensmittelsicherheit, Produktqualität, -legalität und -authentizität, Kundenorientierung, Lebensmittelsicherheitskultur und Nachhaltigkeit. Die Ziele hinsichtlich Lebensmittelsicherheitskultur beinhalten mindestens die Kommunikation über Lebensmittelsicherheitspolitik, Schulungen, Rückmeldungen der Mitarbeiter und Leistungsmessung.', 
    isKO: false 
  },
  { 
    id: '1.1.2', 
    chapter: 1, 
    subChapter: '1.1 Politik', 
    title: 'Mitarbeiterkommunikation', 
    description: 'Alle relevanten Informationen hinsichtlich Lebensmittelsicherheit, Produktqualität, -legalität und -authentizität werden effektiv und zeitnah an die betroffenen Mitarbeiter kommuniziert.', 
    isKO: false 
  },
  { 
    id: '1.2.1', 
    chapter: 1, 
    subChapter: '1.2 Unternehmensführung', 
    title: 'KO Nr. 1: Unternehmensführung und Engagement', 
    description: 'Die Unternehmensleitung stellt sicher, dass die Mitarbeiter ihre Verantwortlichkeiten hinsichtlich der Lebensmittelsicherheit und Produktqualität kennen und dass Mechanismen umgesetzt sind, um die Wirksamkeit ihrer Handlungen zu überwachen. Diese Mechanismen sind identifiziert und dokumentiert.', 
    isKO: true 
  },
  { 
    id: '1.2.2', 
    chapter: 1, 
    subChapter: '1.2 Unternehmensführung', 
    title: 'Bereitstellung von Ressourcen', 
    description: 'Die Unternehmensleitung stellt ausreichende und geeignete Ressourcen zur Erfüllung der Produkt- und Prozessanforderungen bereit.', 
    isKO: false 
  },
  { 
    id: '1.2.3', 
    chapter: 1, 
    subChapter: '1.2 Unternehmensführung', 
    title: 'Berichtswesen & Organigramm', 
    description: 'Die für Qualitäts- und Lebensmittelsicherheits-Management verantwortliche Abteilung berichtet unmittelbar an die Unternehmensleitung. Ein Organigramm, welches die Struktur des Unternehmens aufzeigt, ist zu dokumentieren und zu pflegen.', 
    isKO: false 
  },
  { 
    id: '1.2.4', 
    chapter: 1, 
    subChapter: '1.2 Unternehmensführung', 
    title: 'Kenntnis der Prozesse', 
    description: 'Die Unternehmensleitung stellt sicher, dass die Prozesse (dokumentierte und nicht dokumentierte) dem betreffenden Personal bekannt sind und einheitlich angewendet werden.', 
    isKO: false 
  },
  { 
    id: '1.2.5', 
    chapter: 1, 
    subChapter: '1.2 Unternehmensführung', 
    title: 'Informationssystem & Wissensmanagement', 
    description: 'Die Unternehmensleitung hat ein System, das sicherstellt, dass das Unternehmen über alle relevanten Gesetze, wissenschaftliche und technische Entwicklungen, Verfahrenskodizes der Industrie, Vorfälle bezüglich Lebensmittelsicherheit und Produktqualität informiert wird.', 
    isKO: false 
  },
  { 
    id: '1.2.6', 
    chapter: 1, 
    subChapter: '1.2 Unternehmensführung', 
    title: 'Meldepflicht an die Zertifizierungsstelle', 
    description: 'Die Unternehmensleitung informiert die Zertifizierungsstelle über Änderungen (Name, Standort) sowie bei Produktrückrufen, Rücknahmen oder Behördenbesuchen innerhalb von 3 Werktagen.', 
    isKO: false 
  },
  { 
    id: '1.3.1', 
    chapter: 1, 
    subChapter: '1.3 Managementbewertung', 
    title: 'Review des Managementsystems', 
    description: 'Die Unternehmensleitung stellt sicher, dass das Lebensmittelsicherheit- und Qualitätsmanagementsystem überprüft wird (Intervall max. 12-15 Monate). Beinhaltet Ziele, Politik, Auditergebnisse, Kundenfeedback, Prozesskonformität, Food Fraud/Defence Assessment und Behördenmeldungen.', 
    isKO: false 
  },
  { 
    id: '1.3.2', 
    chapter: 1, 
    subChapter: '1.3 Managementbewertung', 
    title: 'Verbesserungsmaßnahmen', 
    description: 'Die aus der Managementbewertung resultierenden Maßnahmen dienen der Verbesserung. Die Überprüfung durch die Unternehmensleitung ist vollständig dokumentiert.', 
    isKO: false 
  },
  { 
    id: '1.3.3', 
    chapter: 1, 
    subChapter: '1.3 Managementbewertung', 
    title: 'Infrastruktur & Arbeitsumfeld', 
    description: 'Die Unternehmensleitung prüft Infrastruktur und Arbeitsumfeld (Gebäude, Anlagen, Versorgung, Hygiene) mindestens einmal jährlich oder bei signifikanten Änderungen. Ergebnisse fließen risikobasiert in die Investitionsplanung ein.', 
    isKO: false 
  },

  // KAPITEL 2: Lebensmittelsicherheits- und Qualitätsmanagementsystem
  { 
    id: '2.1.1.1', 
    chapter: 2, 
    subChapter: '2.1 Qualitätsmanagement', 
    title: 'Dokumentenlenkung', 
    description: 'Ein Verfahren zur Lenkung von Dokumenten und ihren Änderungen wird dokumentiert, umgesetzt und aufrechterhalten. Alle Dokumente liegen in der aktuellen Version vor.', 
    isKO: false 
  },
  { 
    id: '2.1.1.2', 
    chapter: 2, 
    subChapter: '2.1 Qualitätsmanagement', 
    title: 'Aufbewahrung des Systems', 
    description: 'Das Lebensmittelsicherheits- und Qualitätsmanagementsystem wird dokumentiert, umgesetzt und an einem sicheren Ort aufbewahrt (physisch oder digital).', 
    isKO: false 
  },
  { 
    id: '2.1.1.3', 
    chapter: 2, 
    subChapter: '2.1 Qualitätsmanagement', 
    title: 'Verfügbarkeit der Dokumente', 
    description: 'Alle Dokumente sind lesbar, eindeutig und umfassend. Sie stehen den betreffenden Mitarbeitern jederzeit zur Verfügung.', 
    isKO: false 
  },
  { 
    id: '2.1.2.1', 
    chapter: 2, 
    subChapter: '2.1 Qualitätsmanagement', 
    title: 'Aufzeichnungen & Echtheit', 
    description: 'Aufzeichnungen sind lesbar, korrekt ausgefüllt und authentisch. Nachträgliche Änderungen müssen ausgeschlossen sein; elektronische Systeme benötigen Zugriffsschutz.', 
    isKO: false 
  },
  { 
    id: '2.1.2.2', 
    chapter: 2, 
    subChapter: '2.1 Qualitätsmanagement', 
    title: 'Aufbewahrungsfristen', 
    description: 'Aufzeichnungen werden gemäß rechtlicher und Kundenanforderungen aufbewahrt (mindestens MHD + 1 Jahr).', 
    isKO: false 
  },
  { 
    id: '2.1.2.3', 
    chapter: 2, 
    subChapter: '2.1 Qualitätsmanagement', 
    title: 'Sichere Lagerung', 
    description: 'Die Aufzeichnungen und dokumentierten Informationen sind sicher gelagert und leicht zugänglich.', 
    isKO: false 
  },
  { 
    id: '2.2.1.1', 
    chapter: 2, 
    subChapter: '2.2 Sicherheit', 
    title: 'HACCP-Plan Basis', 
    description: 'Grundlage ist ein vollständig umgesetzter HACCP-Plan nach Codex Alimentarius, GHP und gesetzlichen Anforderungen der Produktions- und Bestimmungsländer.', 
    isKO: false 
  },
  { 
    id: '2.2.1.2', 
    chapter: 2, 
    subChapter: '2.2 Sicherheit', 
    title: 'HACCP Umfang', 
    description: 'Der HACCP-Plan umfasst alle Rohwaren, Verpackungen, Prozesse vom Wareneingang bis zum Versand inkl. Produktentwicklung.', 
    isKO: false 
  },
  { 
    id: '2.2.1.3', 
    chapter: 2, 
    subChapter: '2.2 Sicherheit', 
    title: 'Wissenschaftliche Basis', 
    description: 'HACCP basiert auf Fachliteratur oder externer Expertise und berücksichtigt den technischen Fortschritt.', 
    isKO: false 
  },
  { 
    id: '2.2.1.4', 
    chapter: 2, 
    subChapter: '2.2 Sicherheit', 
    title: 'HACCP Review', 
    description: 'Überprüfung des HACCP-Plans bei Änderungen von Rohwaren, Prozessen oder Infrastruktur.', 
    isKO: false 
  },
  { 
    id: '2.3.1.1', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'HACCP-Team', 
    description: 'Multidisziplinäres Team inklusive Produktion mit entsprechender Fachkenntnis.', 
    isKO: false 
  },
  { 
    id: '2.3.1.2', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'Teamleiter & Schulung', 
    description: 'Interner Teamleiter vorhanden; Team ist in HACCP-Grundsätzen und spezifischem Wissen geschult.', 
    isKO: false 
  },
  { 
    id: '2.3.2.1', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'Produktbeschreibung', 
    description: 'Dokumentierte Informationen zu Zusammensetzung, Eigenschaften, rechtlichen Anforderungen, Verpackung, Haltbarkeit und Distribution.', 
    isKO: false 
  },
  { 
    id: '2.3.3.1', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'Verwendungszweck', 
    description: 'Beschreibung des erwarteten Gebrauchs durch Endverbraucher unter Berücksichtigung sensibler Gruppen.', 
    isKO: false 
  },
  { 
    id: '2.3.4.1', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'Fließdiagramm', 
    description: 'Detailliertes Diagramm aller Prozessschritte inkl. Nachbearbeitung und Kontrollmaßnahmen.', 
    isKO: false 
  },
  { 
    id: '2.3.5.1', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'Vor-Ort-Bestätigung', 
    description: 'Verifizierung des Fließdiagramms vor Ort zu allen Betriebszeiten durch das HACCP-Team.', 
    isKO: false 
  },
  { 
    id: '2.3.6.1', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'Gefahrenanalyse', 
    description: 'Analyse physikalischer, chemischer und biologischer Gefahren inkl. Verpackung und Arbeitsumfeld.', 
    isKO: false 
  },
  { 
    id: '2.3.7.1', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'CCP Festlegung', 
    description: 'Anwendung eines Entscheidungsbaums zur Bestimmung Kritischer Lenkungspunkte (CCP).', 
    isKO: false 
  },
  { 
    id: '2.3.8.1', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'Grenzwerte', 
    description: 'Definition und Validierung kritischer Grenzwerte für jeden CCP.', 
    isKO: false 
  },
  { 
    id: '2.3.9.1', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'KO Nr. 2: Überwachung der CCPs', 
    description: '2.3.9.1* KO Nr. 2: Für jeden CCP sind spezifische Überwachungsverfahren in Bezug auf die Methode, die Häufigkeit der Messungen oder Beobachtungen und die Aufzeichnung der Ergebnisse zu dokumentieren, umzusetzen und aufrechterhalten zu werden, um jeden Kontrollverlust bei diesem CCP zu erkennen. Jeder festgelegte CCP wird beherrscht. Die Überwachung bzw. Beherrschung jedes CCPs wird durch Aufzeichnungen nachgewiesen.', 
    isKO: true 
  },
  { 
    id: '2.3.9.2', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'Review Monitoring', 
    description: 'Aufzeichnungen über CCP-Überwachung werden von verantwortlichen Personen überprüft.', 
    isKO: false 
  },
  { 
    id: '2.3.10.1', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'Korrekturmaßnahmen', 
    description: 'Dokumentierte Maßnahmen bei Abweichungen von CCPs inkl. Ursachenanalyse und Umgang mit nichtkonformen Produkten.', 
    isKO: false 
  },
  { 
    id: '2.3.11.2', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'Verifizierungsverfahren', 
    description: 'Jährliche Prüfung der HACCP-Wirksamkeit durch interne Audits, Tests, Analysen und Beschwerdeauswertungen.', 
    isKO: false 
  },
  { 
    id: '2.3.12.1', 
    chapter: 2, 
    subChapter: '2.3 HACCP-Analyse', 
    title: 'HACCP-Dokumentation', 
    description: 'Verfügbarkeit aller HACCP-relevanten Dokumente wie Gefahrenanalyse, Grenzwerte, Monitoring-Ergebnisse und Schulungsnachweise.', 
    isKO: false 
  },

  // KAPITEL 3: Ressourcenmanagement
  { 
    id: '3.1.1', 
    chapter: 3, 
    subChapter: '3.1 Personalressourcen', 
    title: 'Mitarbeiterkompetenz', 
    description: 'Alle Mitarbeiter besitzen die notwendige Kompetenz durch Ausbildung, Berufserfahrung oder Schulung für Aufgaben mit Einfluss auf Produktsicherheit.', 
    isKO: false 
  },
  { 
    id: '3.1.2', 
    chapter: 3, 
    subChapter: '3.1 Personalressourcen', 
    title: 'Verantwortlichkeiten & Stellenbeschreibungen', 
    description: 'Verantwortlichkeiten, Kompetenzen und Stellenbeschreibungen sind dokumentiert. Zuweisung von Schlüsselrollen ist festgelegt.', 
    isKO: false 
  },
  { 
    id: '3.2.1', 
    chapter: 3, 
    subChapter: '3.2 Personalhygiene', 
    title: 'Personalhygiene-Vorgaben', 
    description: 'Dokumentierte Vorgaben zu Haaren, Schutzkleidung, Handhygiene, Essen/Rauchen, Verletzungen, Schmuck und Infektionskrankheiten.', 
    isKO: false 
  },
  { 
    id: '3.2.2', 
    chapter: 3, 
    subChapter: '3.2 Personalhygiene', 
    title: 'KO Nr. 3: Personalhygiene', 
    description: '3.2.2* KO Nr. 3: Die Anforderungen an die Personalhygiene sind dokumentiert, umgesetzt und von allen relevanten Mitarbeitern, Dienstleistern und Besuchern verstanden und angewendet, es sei denn, andere Personen (z. B. Dienstleister, Besucher) sind durch andere Maßnahmen abgesichert. Diese Anforderungen basieren auf Gefahrenanalyse und Bewertung der damit verbundenen Risiken.', 
    isKO: true 
  },
  { 
    id: '3.2.3', 
    chapter: 3, 
    subChapter: '3.2 Personalhygiene', 
    title: 'Hygiene-Compliance Check', 
    description: 'Einhaltung der Personalhygiene wird risikobasiert mindestens alle 3 Monate überwacht.', 
    isKO: false 
  },
  { 
    id: '3.2.5', 
    chapter: 3, 
    subChapter: '3.2 Personalhygiene', 
    title: 'Schmuck & Uhren', 
    description: 'Sichtbarer Schmuck (inkl. Piercing) und Uhren werden nicht getragen. Ausnahmen sind risikobasiert bewertet und verwaltet.', 
    isKO: false 
  },
  { 
    id: '3.2.6', 
    chapter: 3, 
    subChapter: '3.2 Personalhygiene', 
    title: 'Wundversorgung', 
    description: 'Schnittwunden sind mit wasserfesten, farblich unterscheidbaren Pflastern (ggf. mit Metallstreifen) zu bedecken.', 
    isKO: false 
  },
  { 
    id: '3.2.7', 
    chapter: 3, 
    subChapter: '3.2 Personalhygiene', 
    title: 'Kopfbedeckung & Bartkappen', 
    description: 'Haare und Bärte sind in vorgesehenen Bereichen vollständig zu bedecken, um Kontaminationen zu verhindern.', 
    isKO: false 
  },
  { 
    id: '3.2.10', 
    chapter: 3, 
    subChapter: '3.2 Personalhygiene', 
    title: 'Reinigung der Schutzkleidung', 
    description: 'Schutzkleidung wird gründlich and regelmäßig gereinigt. Trennung von schmutziger und sauberer Wäsche ist sichergestellt.', 
    isKO: false 
  },
  { 
    id: '3.3.1', 
    chapter: 3, 
    subChapter: '3.3 Schulung', 
    title: 'Schulungsprogramme', 
    description: 'Dokumentierte Schulungen inkl. Inhalten, Intervallen, Sprachen und Erfolgskontrolle für alle Mitarbeiter.', 
    isKO: false 
  },
  { 
    id: '3.3.2', 
    chapter: 3, 
    subChapter: '3.3 Schulung', 
    title: 'Erstunterweisung', 
    description: 'Alle Mitarbeiter (inkl. Saison- und Zeitarbeitskräfte) werden vor erstmaliger Arbeitsaufnahme geschult.', 
    isKO: false 
  },
  { 
    id: '3.3.4', 
    chapter: 3, 
    subChapter: '3.3 Schulung', 
    title: 'Relevanz der Schulungsinhalte', 
    description: 'Regelmäßige Überprüfung der Inhalte (Hygiene, Food Fraud, Food Defence, gesetzliche Anforderungen).', 
    isKO: false 
  },
  { 
    id: '3.4.1', 
    chapter: 3, 
    subChapter: '3.4 Sozialeinrichtungen', 
    title: 'Ausstattung Sozialeinrichtungen', 
    description: 'Größe und Ausstattung der Mitarbeiterzahl angepasst. Instandhaltung verhindert Kontaminationsrisiken.', 
    isKO: false 
  },
  { 
    id: '3.4.3', 
    chapter: 3, 
    subChapter: '3.4 Sozialeinrichtungen', 
    title: 'Umkleideräume & Trennung', 
    description: 'Getrennte Lagerung von Außenbekleidung und Schutzkleidung. Direkter Zugang zu Produktionsräumen bevorzugt.', 
    isKO: false 
  },
  { 
    id: '3.4.5', 
    chapter: 3, 
    subChapter: '3.4 Sozialeinrichtungen', 
    title: 'Händewasch-Anlagen', 
    description: 'Geeignete Anzahl an Handwaschbecken an den Zugangspunkten, ausschließlich zur Reinigung der Hände.', 
    isKO: false 
  },
  { 
    id: '3.4.7', 
    chapter: 3, 
    subChapter: '3.4 Sozialeinrichtungen', 
    title: 'Verstärkte Hygiene-Einrichtungen', 
    description: 'Berührungslos geschaltete Armaturen, Händedesinfektion und kontaktfreie Abfallbehälter in Hochrisikobereichen.', 
    isKO: false 
  },

  // KAPITEL 4: Operative Abläufe
  { 
    id: '4.1.1', 
    chapter: 4, 
    subChapter: '4.1 Kundenorientierung und Vertragsprüfung', 
    title: 'Ermittlung Kundenbedürfnisse', 
    description: 'Ein Verfahren, mit dem die grundsätzlichen Kundenbedürfnisse und Erwartungen ermittelt werden, ist umgesetzt und wird gepflegt. Rückmeldungen aus diesem Prozess werden zur kontinuierlichen Verbesserung des Unternehmens genutzt.', 
    isKO: false 
  },
  { 
    id: '4.1.2', 
    chapter: 4, 
    subChapter: '4.1 Kundenorientierung und Vertragsprüfung', 
    title: 'Kommunikation Kundenanforderungen', 
    description: 'Die zwischen den Vertragspartnern vereinbarten Anforderungen bezüglich Lebensmittelsicherheit und Produktqualität und alle Änderungen an bestehenden Vereinbarungen sind in den entsprechenden Unternehmensbereichen kommuniziert und umgesetzt.', 
    isKO: false 
  },
  { 
    id: '4.1.3', 
    chapter: 4, 
    subChapter: '4.1 Kundenorientierung und Vertragsprüfung', 
    title: 'KO Nr. 4: Kundenvereinbarungen', 
    description: '4.1.3* KO Nr. 4: Sofern Kundenvereinbarungen in Bezug auf Produktrezeptur (einschließlich der Eigenschaften der Rohwaren), Prozess, technologische Anforderungen, Test- und Überwachungspläne, Verpackung und Etikettierung bestehen, werden diese eingehalten.', 
    isKO: true 
  },
  { 
    id: '4.1.4', 
    chapter: 4, 
    subChapter: '4.1 Kundenorientierung und Vertragsprüfung', 
    title: 'Informationspflicht bei Abweichungen', 
    description: 'Die Unternehmensleitung informiert die betroffenen Vertragspartner, entsprechend den Kundenanforderungen, umgehend bei allen Belangen, welche die Produktsicherheit oder -legalität betreffen, insbesondere bei Abweichungen und Nichtkonformitäten, die durch zuständige Behörden festgestellt wurden.', 
    isKO: false 
  },
  { 
    id: '4.2.1.1', 
    chapter: 4, 
    subChapter: '4.2 Spezifikationen und Rezepturen', 
    title: 'Spezifikationen Endprodukte', 
    description: '4.2.1.1* Für alle Endprodukte sind Spezifikationen dokumentiert und umgesetzt. Die Spezifikationen sind aktuell, eindeutig formuliert und entsprechen immer den gültigen rechtlichen Bestimmungen und den Kundenanforderungen.', 
    isKO: false 
  },
  { 
    id: '4.2.1.2', 
    chapter: 4, 
    subChapter: '4.2 Spezifikationen und Rezepturen', 
    title: 'Verfahren für Spezifikationen', 
    description: 'Ein Verfahren zur Erstellung, Freigabe und Änderung von Spezifikationen ist dokumentiert, umgesetzt und aufrechtzuerhalten. Dieses schließt, wo gefordert, die Zustimmung des Kunden ein. Wo vom Kunden gefordert, sind die Produktspezifikationen schriftlich vereinbart. Dieses Verfahren umfasst die Aktualisierung der Endproduktspezifikationen im Falle von Änderungen in Bezug auf: Rohwaren, Rezepturen, Prozesse mit Einfluss auf die Endprodukte, Verpackungsmaterial mit Einfluss auf die Endprodukte.', 
    isKO: false 
  },
  { 
    id: '4.2.1.3', 
    chapter: 4, 
    subChapter: '4.2 Spezifikationen und Rezepturen', 
    title: 'KO Nr. 5: Rohwarenspezifikationen', 
    description: '4.2.1.3* KO Nr. 5: Für alle Rohwaren (Zutaten, Zusatzstoffe, Verpackungsmaterialien, Rework) sind Spezifikationen dokumentiert und umgesetzt. Diese Spezifikationen sind aktuell und eindeutig formuliert und entsprechen immer den gültigen rechtlichen Bestimmungen und, wenn solche festgelegt sind, den Kundenanforderungen.', 
    isKO: true 
  },
  { 
    id: '4.2.1.4', 
    chapter: 4, 
    subChapter: '4.2 Spezifikationen und Rezepturen', 
    title: 'Verfügbarkeit Spezifikationen', 
    description: 'Die Spezifikationen bzw. deren Inhalte liegen in den relevanten Bereichen vor und sind für die betreffenden Mitarbeiter zugänglich.', 
    isKO: false 
  },
  { 
    id: '4.2.1.5', 
    chapter: 4, 
    subChapter: '4.2 Spezifikationen und Rezepturen', 
    title: 'Auslobungen (Claims)', 
    description: '4.2.1.5* Wenn Produkte mit einer Auslobung (Claim) gekennzeichnet und/oder beworben werden sollen oder wenn bestimmte Behandlungs- oder Produktionsmethoden ausgeschlossen werden, sind Maßnahmen implementiert, die die Einhaltung einer solchen Aussage nachweist.', 
    isKO: false 
  },
  { 
    id: '4.3.1', 
    chapter: 4, 
    subChapter: '4.3 Produktentwicklung / Produktänderung / Änderungen der Produktionsprozesse', 
    title: 'Verfahren für Entwicklung und Änderungen', 
    description: 'Ein Verfahren für die Entwicklung oder Änderung von Produkten und/oder Prozessen ist zu dokumentieren, umzusetzen und aufrechtzuerhalten. Es umfasst mindestens eine Gefahrenanalyse und Bewertung der damit verbundenen Risiken.', 
    isKO: false 
  },
  { 
    id: '4.3.2', 
    chapter: 4, 
    subChapter: '4.3 Produktentwicklung / Produktänderung / Änderungen der Produktionsprozesse', 
    title: 'Gesetzeskonformität Kennzeichnung', 
    description: '4.3.2* Das Verfahren stellt sicher, dass die Kennzeichnung / Deklaration der aktuellen Gesetzgebung des Ziellandes/der Zielländer und den Kundenanforderungen entspricht.', 
    isKO: false 
  },
  { 
    id: '4.3.3', 
    chapter: 4, 
    subChapter: '4.3 Produktentwicklung / Produktänderung / Änderungen der Produktionsprozesse', 
    title: 'Ergebnisse des Entwicklungsprozesses', 
    description: '4.3.3* Der Entwicklungs- und/oder Änderungsprozess führt zu Spezifikationen über Rezeptur, Nachbearbeitung (Rework), Verpackungsmaterialien und Herstellungsprozessen und erfüllt die Anforderungen bezüglich Lebensmittelsicherheit, Produktqualität, -legalität, -authentizität sowie Kundenanforderungen. Dazu gehören Werksversuche, Produkttests und Prozessüberwachung. Der Verlauf und die Ergebnisse der Produktentwicklung sind aufzuzeichnen.', 
    isKO: false 
  },
  { 
    id: '4.3.4', 
    chapter: 4, 
    subChapter: '4.3 Produktentwicklung / Produktänderung / Änderungen der Produktionsprozesse', 
    title: 'Haltbarkeitsvalidierung', 
    description: 'Es werden Tests zur Haltbarkeit oder vergleichbare Validierungen durch mikrobiologische, chemische und organoleptische Beurteilungen, unter Berücksichtigung von Rezeptur, Verpackung, Herstellungs- und Deklarationsangaben, durchgeführt. Die Haltbarkeitsdauer wird auf Grundlage dieser Bewertung festgelegt.', 
    isKO: false 
  },
  { 
    id: '4.3.5', 
    chapter: 4, 
    subChapter: '4.3 Produktentwicklung / Produktänderung / Änderungen der Produktionsprozesse', 
    title: 'Validierung von Gebrauchsanweisungen', 
    description: 'Zubereitungsempfehlungen und/oder Anweisungen für die Verwendung von Lebensmitteln, hinsichtlich der Lebensmittelsicherheit und/oder die Produktqualität, sind zu validieren und zu dokumentieren.', 
    isKO: false 
  },
  { 
    id: '4.3.6', 
    chapter: 4, 
    subChapter: '4.3 Produktentwicklung / Produktänderung / Änderungen der Produktionsprozesse', 
    title: 'Validierung von Nährwertangaben', 
    description: 'Nährwertangaben oder Auslobungen (Claims), die in der Kennzeichnung angegeben werden, sind durch Studien und/oder Tests während der gesamten Haltbarkeitsdauer der Produkte zu validieren.', 
    isKO: false 
  },

  { 
    id: '4.4.1', 
    chapter: 4, 
    subChapter: '4.4 Einkauf', 
    title: 'Beschaffungsverfahren und Lieferantenüberwachung', 
    description: '4.4.1* Ein Verfahren für die Beschaffung von Rohwaren, Zwischenprodukten und Verpackungsmaterialien sowie die Zulassung und Überwachung von Lieferanten (intern und extern) ist zu dokumentieren, umzusetzen und aufrechtzuerhalten.', 
    isKO: false 
  },
  { 
    id: '4.4.2', 
    chapter: 4, 
    subChapter: '4.4 Einkauf', 
    title: 'Inhalt des Beschaffungsverfahrens', 
    description: 'Das Verfahren beinhaltet mindestens: Rohwaren und/oder Risiken der Lieferanten, erforderliche Leistungsstandards (z. B. Zertifizierung, Herkunft etc.), Ausnahmesituationen (z. B. Noteinkauf) und risikobasiert zusätzliche Kriterien wie Audits, Testergebnisse, Lieferantenzuverlässigkeit, Beschwerden und Lieferantenfragebogen.', 
    isKO: false 
  },
  { 
    id: '4.4.3', 
    chapter: 4, 
    subChapter: '4.4 Einkauf', 
    title: 'Dienstleistungsbewertung', 
    description: '4.4.3* Eingekaufte Dienstleistungen, die einen Einfluss auf die Lebensmittelsicherheit und die Produktqualität haben, sind risikobasiert zu bewerten, um sicherzustellen, dass sie die festgelegten Anforderungen einhalten. Dabei ist mindestens Folgendes zu berücksichtigen: Anforderungen an die Dienstleistung, Lieferantenstatus und Auswirkung auf das Endprodukt.', 
    isKO: false 
  },
  { 
    id: '4.4.4', 
    chapter: 4, 
    subChapter: '4.4 Einkauf', 
    title: 'Ausgelagerte Prozesse', 
    description: '4.4.4* Wird ein Teil der Produktionsprozesse und/oder des Primärverpackungsvorganges und/oder der Etikettierung ausgelagert, ist dies im Lebensmittelsicherheits- und Qualitätsmanagementsystem zu dokumentieren. Diese Prozesse werden kontrolliert und festgelegt. Falls erforderlich, ist der Nachweis der Kundeninformation und -zustimmung zu erbringen.', 
    isKO: false 
  },
  { 
    id: '4.4.5', 
    chapter: 4, 
    subChapter: '4.4 Einkauf', 
    title: 'Vereinbarung ausgelagerte Prozesse', 
    description: 'Eine schriftliche Vereinbarung zu den ausgelagerten Prozessen ist dokumentiert und umgesetzt. Diese beinhaltet alle in diesem Zusammenhang getroffenen Vereinbarungen, einschließlich prozessinterner Kontrollen, Test- und Überwachungspläne.', 
    isKO: false 
  },
  { 
    id: '4.4.6', 
    chapter: 4, 
    subChapter: '4.4 Einkauf', 
    title: 'Zulassung Lieferanten ausgelagerter Prozesse', 
    description: 'Lieferanten, die ausgelagerte Prozesse durchführen, sind zugelassen durch: eine Zertifizierung nach IFS Food oder einem anderen GFSI-anerkannten Zertifizierungsstandard oder ein dokumentiertes Lieferantenaudit, durchgeführt von einer erfahrenen und kompetenten Person, welches mindestens Anforderungen an Lebensmittelsicherheit, Produktqualität und -legalität sowie -authentizität berücksichtigt.', 
    isKO: false 
  },
  { 
    id: '4.4.7', 
    chapter: 4, 
    subChapter: '4.4 Einkauf', 
    title: 'Review Einkauf & Lieferanten', 
    description: 'Die Bewertungen von Einkauf und Lieferanten sind mindestens einmal innerhalb eines 12-monatigen Zeitraums oder bei signifikanten Änderungen zu überprüfen. Die Ergebnisse dieser Überprüfung sowie daraus resultierende Maßnahmen sind dokumentiert.', 
    isKO: false 
  },
  { 
    id: '4.5.1', 
    chapter: 4, 
    subChapter: '4.5 Produktverpackung', 
    title: 'Spezifikationen und Eignung Verpackung', 
    description: '4.5.1 * Basierend auf Risiken und dem vorgesehenen Gebrauch sind Schlüsselparameter für die Verpackungsmaterialien in detaillierten Spezifikationen, unter Einhaltung der aktuellen rechtlichen Bestimmungen und Berücksichtigung anderer relevanter Risiken oder Gefahren, definiert. Die Eignung der Verpackungsmaterialien mit Lebensmittelkontakt und das Vorhandensein funktioneller Barrieren sind für jedes relevante Produkt zu validieren. Dies ist zu überwachen und durch Tests/Analysen nachzuweisen, z. B.: organoleptische Tests, Lagertests, chemische Analysen, Ergebnisse aus Migrationstests.', 
    isKO: false 
  },
  { 
    id: '4.5.2', 
    chapter: 4, 
    subChapter: '4.5 Produktverpackung', 
    title: 'Konformitätserklärungen Verpackung', 
    description: '4.5.2 Für alle Verpackungsmaterialien, die einen Einfluss auf Produkte haben könnten, sind Konformitätserklärungen zu dokumentieren, mit denen die Einhaltung der gesetzlichen Anforderungen bescheinigt wird. Wenn keine spezifischen rechtlichen Bestimmungen zur Anwendung kommen, werden Nachweise über die Eignung des Verpackungsmaterials für den Verwendungszweck geführt. Dies gilt für Verpackungsmaterialien, die Einfluss auf Rohwaren, Zwischen- und Endprodukte haben könnten.', 
    isKO: false 
  },
  { 
    id: '4.5.3', 
    chapter: 4, 
    subChapter: '4.5 Produktverpackung', 
    title: 'Konformität Verpackung und Etikettierung', 
    description: '4.5.3 Die verwendete Verpackung und Etikettierung entspricht dem jeweiligen zu verpackenden Produkt und den mit dem Kunden vereinbarten Produktspezifikationen. Die Kennzeichnungsinformationen müssen lesbar und dauerhaft sein. Dies ist mindestens zu Beginn und am Ende eines Produktionsdurchlaufs sowie bei jedem Produktwechsel zu überwachen und zu dokumentieren.', 
    isKO: false 
  },
  { 
    id: '4.6.1', 
    chapter: 4, 
    subChapter: '4.6 Betriebsstandort', 
    title: 'Bewertung der Betriebsumgebung', 
    description: '4.6.1* Mögliche nachteilige Auswirkungen auf die Lebensmittelsicherheit und/oder die Produktqualität aus der Betriebsumgebung (z. B. Boden, Luft) sind zu untersuchen. Wurden Risiken festgestellt (z. B. extrem staubhaltige Luft, starke Gerüche), sind Maßnahmen zu dokumentieren und umzusetzen und mindestens einmal innerhalb eines 12-monatigen Zeitraums oder bei signifikanten Änderungen auf ihre Wirksamkeit zu überprüfen.', 
    isKO: false 
  },
  { 
    id: '4.7.1', 
    chapter: 4, 
    subChapter: '4.7 Außengelände', 
    title: 'Gestaltung und Instandhaltung Außenbereiche', 
    description: '4.7.1 Alle Außenbereiche des Betriebs müssen sauber und ordentlich sein und so gestaltet und instand gehalten werden, dass eine Kontamination verhindert wird. Falls eine natürliche Entwässerung nicht ausreicht, ist ein geeignetes Abflusssystem vorhanden.', 
    isKO: false 
  },
  { 
    id: '4.7.2', 
    chapter: 4, 
    subChapter: '4.7 Außengelände', 
    title: 'Lagerhaltung im Außenbereich', 
    description: '4.7.2 Eine Lagerhaltung im Freien ist auf ein Minimum beschränkt. Sofern Ware im Freien gelagert wird, ist sicherzustellen, dass weder ein Kontaminationsrisiko, noch eine Beeinträchtigung von Lebensmittelsicherheit und -qualität besteht.', 
    isKO: false 
  },
  { 
    id: '4.8.1', 
    chapter: 4, 
    subChapter: '4.8 Anlagengestaltung und Verfahrensabläufe', 
    title: 'Standortplan und Prozessabläufe', 
    description: 'Ein Standortplan, der alle Gebäude umfasst, ist zu dokumentieren und zu pflegen und beschreibt mindestens den Prozessablauf für: Endprodukte, Zwischenprodukte, einschließlich Nachbearbeitung (Rework), Verpackungsmaterialien, Rohwaren, Personal, Abfall, Wasser.', 
    isKO: false 
  },
  { 
    id: '4.8.2', 
    chapter: 4, 
    subChapter: '4.8 Anlagengestaltung und Verfahrensabläufe', 
    title: 'Vermeidung von Kontaminationen', 
    description: '4.8.2* Der Prozessablauf vom Wareneingang bis zum Versand wird umgesetzt, aufrechterhalten, überprüft und bei Bedarf verändert, um sicherzustellen, dass das Risiko einer mikrobiologischen, chemischen und physikalischen Kontamination von Rohwaren, Verpackungsmaterialien, teilverarbeiteten Produkten und Endprodukten vermieden wird. Das Risiko einer Kreuzkontamination wird durch wirksame Maßnahmen minimiert.', 
    isKO: false 
  },
  { 
    id: '4.8.3', 
    chapter: 4, 
    subChapter: '4.8 Anlagengestaltung und Verfahrensabläufe', 
    title: 'Betrieb sensibler Bereiche', 
    description: 'Wurden für mikrobiologische, chemische und physikalische Risiken sensible Bereiche ermittelt, so sind diese so zu gestalten und zu betreiben, dass die Produktsicherheit nicht beeinträchtigt ist.', 
    isKO: false 
  },
  { 
    id: '4.8.4', 
    chapter: 4, 
    subChapter: '4.8 Anlagengestaltung und Verfahrensabläufe', 
    title: 'Einfluss von Laboreinrichtungen', 
    description: 'Vorhandene Laboreinrichtungen und In-Prozesskontrollen beeinträchtigen die Produktsicherheit nicht.', 
    isKO: false 
  },
  { 
    id: '4.9.1.1', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Bauliche Anforderungen', 
    description: '4.9.1.1* Räumlichkeiten, in denen Lebensmittel zubereitet, behandelt, verarbeitet und gelagert werden, sind so konzipiert, erbaut und gewartet, dass die Lebensmittelsicherheit gewährleistet ist.', 
    isKO: false 
  },
  { 
    id: '4.9.2.1', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Mauern Gestaltung', 
    description: '4.9.2.1 Mauern sind so gestaltet und konstruiert, dass sie den Produktionsanforderungen entsprechen und eine Kontamination verhindern, Kondensation und Schimmelbildung verringern sowie eine leichte Reinigung und falls notwendig Desinfektion ermöglichen.', 
    isKO: false 
  },
  { 
    id: '4.9.2.2', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Mauern Beschaffenheit', 
    description: '4.9.2.2 Die Wandflächen sind so beschaffen, dass eine Kontamination verhindert wird und sie leicht zu reinigen sind. Sie sind wasserundurchlässig und abriebfest, um das Risiko einer Produktkontamination zu minimieren.', 
    isKO: false 
  },
  { 
    id: '4.9.2.3', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Mauern Stöße/Ecken', 
    description: '4.9.2.3 Die Stöße zwischen Wänden und Fußboden bzw. die Ecken sind leicht zu reinigen und falls notwendig zu desinfizieren.', 
    isKO: false 
  },
  { 
    id: '4.9.3.1', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Fußböden Beschaffenheit', 
    description: '4.9.3.1 Bodenbeläge sind so konzipiert und beschaffen, dass sie den Produktionsanforderungen entsprechen. Sie sind so instand zu halten, dass eine Kontamination verhindert sowie Reinigung und falls notwendig, Desinfektion erleichtert wird. Oberflächen sind wasserundurchlässig und abriebfest.', 
    isKO: false 
  },
  { 
    id: '4.9.3.2', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Abflusssysteme', 
    description: '4.9.3.2 Eine hygienische Entsorgung von Abwasser und anderen Flüssigkeiten ist sichergestellt. Abfluss-systeme sind so konzipiert, errichtet und instand gehalten, dass das Risiko einer Produktkontamination minimiert wird (z. B. Eindringen von Schädlingen, Geruchsübertragung oder Kontamination in sensiblen Bereichen) und sie leicht zu reinigen sind.', 
    isKO: false 
  },
  { 
    id: '4.9.3.3', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Maschinenabwässer', 
    description: '4.9.3.3 In Bereichen, wo mit Lebensmitteln umgegangen wird, sind Maschinen und Leitungen so angeordnet, dass Produktionsabwässer möglichst direkt in den Abfluss geleitet werden. Wasser und andere Flüssigkeiten gelangen problemlos durch geeignete Maßnahmen zum Abfluss. Flüssigkeitsansammlungen sind zu vermeiden.', 
    isKO: false 
  },
  { 
    id: '4.9.4.1', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Decken Gestaltung', 
    description: '4.9.4.1 Decken (oder sofern Decken nicht vorhanden sind, Dachinnenseiten) und Deckenkonstruktionen (inkl. Rohrleitungen, Kabel, Lampen, etc.) sind so errichtet und instand gehalten, dass Schmutzansammlungen und Kondensation minimiert werden und kein Risiko für physikalische und / oder mikrobiologische Kontamination darstellen.', 
    isKO: false 
  },
  { 
    id: '4.9.4.2', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Abgehängte Decken', 
    description: 'Bei abgehängten Decken ist ein Zugang zum Hohlraum vorhanden, sodass Reinigung, Wartung und Inspektionen zur Schädlingsbekämpfung möglich sind.', 
    isKO: false 
  },
  { 
    id: '4.9.5.1', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Fenster Gestaltung', 
    description: 'Fenster und andere Öffnungen sind so entworfen und gebaut und instand zu halten, dass Schmutzansammlungen vermieden und eine Kontamination verhindert wird.', 
    isKO: false 
  },
  { 
    id: '4.9.5.2', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Fenster geschlossen', 
    description: 'Sofern das Risiko einer Kontamination besteht, sind Fenster und Dachverglasung während des Herstellungsprozesses geschlossen und verriegelt zu halten.', 
    isKO: false 
  },
  { 
    id: '4.9.5.3', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Belüftungsfenster/Gitter', 
    description: '4.9.5.3 Wo Fenster und Dachverglasungen zu Belüftungszwecken geöffnet werden, sind diese mit leicht zu reinigenden Insektengittern oder anderer Ausrüstung versehen, um jegliche Kontaminationen zu verhindern.', 
    isKO: false 
  },
  { 
    id: '4.9.5.4', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Fensterschutz', 
    description: 'In Bereichen, in denen mit unverpackten Produkten gearbeitet wird, sind Fenster gegen Bruch gesichert.', 
    isKO: false 
  },
  { 
    id: '4.9.6.1', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Türen Beschaffenheit', 
    description: '4.9.6.1 Türen und Tore sind so gewartet, dass Verunreinigungen vermieden werden und sie leicht zu reinigen sind. Sie sind aus nicht saugfähigem Material hergestellt, um Folgendes zu verhindern: Absplittern von kleinen Teilen, Abblättern von Farbe, Korrosion.', 
    isKO: false 
  },
  { 
    id: '4.9.6.2', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Außentüren', 
    description: 'Außentüren und Tore sind so konstruiert, dass das Eindringen von Schädlingen verhindert wird.', 
    isKO: false 
  },
  { 
    id: '4.9.6.3', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Streifenvorhänge', 
    description: '4.9.6.3 Kunststoffstreifenvorhänge zur Trennung von Bereichen sind so instand zu halten, dass eine Kontamination verhindert wird und sie leicht zu reinigen sind.', 
    isKO: false 
  },
  { 
    id: '4.9.7.1', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Beleuchtung', 
    description: 'Alle Produktions-, Lager-, Wareneingangs- und Versandbereiche sind angemessen beleuchtet.', 
    isKO: false 
  },
  { 
    id: '4.9.8.1', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Belüftung Planung', 
    description: 'In allen Bereichen ist eine angemessene natürliche und / oder künstliche Belüftung zu planen, zu erzeugen und aufrechtzuerhalten.', 
    isKO: false 
  },
  { 
    id: '4.9.8.2', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Lüftungsanlagen Filter', 
    description: 'Sind Lüftungsanlagen installiert, dann sind Filter und andere Komponenten leicht zugänglich, werden überwacht, gereinigt oder bei Bedarf ausgetauscht.', 
    isKO: false 
  },
  { 
    id: '4.9.8.3', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Klimaanlagen', 
    description: 'Klimaanlagen und künstlich erzeugter Luftstrom führen zu keiner Beeinträchtigung von Produktsicherheit und -qualität.', 
    isKO: false 
  },
  { 
    id: '4.9.8.4', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Staubabsaugung', 
    description: 'In Bereichen mit starker Staubentwicklung sind geeignete Staubabsauganlagen gebaut und gewartet.', 
    isKO: false 
  },
  { 
    id: '4.9.9.1', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Trinkwasserqualität', 
    description: '4.9.9.1* Wasser, das zum Händewaschen, Reinigen und Desinfizieren oder als Zutat im Herstellungsprozess verwendet wird, hat zum Zeitpunkt der Verwendung Trinkwasserqualität und steht in ausreichender Menge zur Verfügung.', 
    isKO: false 
  },
  { 
    id: '4.9.9.2', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Wasser-Überwachungsplan', 
    description: 'Die Qualität von Wasser (einschließlich aufbereitetem Wasser), Dampf oder Eis wird anhand eines risikobasierten Stichprobenplans überwacht.', 
    isKO: false 
  },
  { 
    id: '4.9.9.3', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Aufbereitetes Wasser', 
    description: 'Aufbereitetes Wasser, das zum Einsatz kommt, darf kein Kontaminationsrisiko darstellen.', 
    isKO: false 
  },
  { 
    id: '4.9.9.4', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Nichttrinkwasser-Leitungen', 
    description: '4.9.9.4 Nichttrinkwasser wird durch separate und ordnungsgemäß gekennzeichnete Leitungen geführt. Es besteht weder eine Verbindung zur Trinkwasserleitung noch die Möglichkeit des Rückflusses zur Trinkwasserleitung, um Kontamination des Trinkwassers oder der Betriebsumgebung zu vermeiden.', 
    isKO: false 
  },
  { 
    id: '4.9.10.1', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Druckluftqualität', 
    description: 'Die Qualität von Druckluft mit direktem Kontakt zu Lebensmitteln oder Lebensmittelkontaktmaterialien wird risikobasiert überwacht.', 
    isKO: false 
  },
  { 
    id: '4.9.10.2', 
    chapter: 4, 
    subChapter: '4.9 Produktions- und Lagerräumlichkeiten', 
    title: 'Gase', 
    description: 'Gase, die in direkten Kontakt mit Lebensmitteln kommen, müssen die Sicherheit und Qualität für den Verwendungszweck nachweisen.', 
    isKO: false 
  },
  { 
    id: '4.10.1', 
    chapter: 4, 
    subChapter: '4.10 Reinigung und Desinfektion', 
    title: 'Reinigungs- und Desinfektionspläne', 
    description: '4.10.1* Risikobasierte Reinigungs- und Desinfektionspläne sind zu validieren, zu dokumentieren und umzusetzen. Diese beinhalten: Zweckmäßigkeit, Verantwortlichkeiten, die verwendeten Produkte und ihre Anwendungsvorschriften, Dosierung der Reinigungs- und Desinfektionsmittel, die Bereiche und Zeitfenster für Reinigungs- und Desinfektionstätigkeiten, Reinigungs- und Desinfektionsintervalle, CIP-Kriterien (Cleaning in Place), wenn anwendbar, Aufzeichnungspflichten sowie Gefahrensymbole (falls notwendig).', 
    isKO: false 
  },
  { 
    id: '4.10.2', 
    chapter: 4, 
    subChapter: '4.10 Reinigung und Desinfektion', 
    title: 'Durchführung der Reinigung', 
    description: 'Reinigungs- und Desinfektionstätigkeiten werden durchgeführt und führen zu wirksam gereinigten Räumen, Einrichtungen und Ausrüstungen.', 
    isKO: false 
  },
  { 
    id: '4.10.3', 
    chapter: 4, 
    subChapter: '4.10 Reinigung und Desinfektion', 
    title: 'Dokumentation und Überprüfung', 
    description: 'Reinigungs- und Desinfektionstätigkeiten sind zu dokumentieren und diese Aufzeichnungen sind von einer verantwortlichen, im Unternehmen benannten Person zu überprüfen.', 
    isKO: false 
  },
  { 
    id: '4.10.4', 
    chapter: 4, 
    subChapter: '4.10 Reinigung und Desinfektion', 
    title: 'Sachkunde und Schulung Personal', 
    description: '4.10.4* Reinigungs- und Desinfektionstätigkeiten werden ausschließlich von sachkundigem Personal durchgeführt. Dieses wird hinsichtlich der Anwendung der Reinigungs- und Desinfektionspläne regelmäßig geschult und fortgebildet.', 
    isKO: false 
  },
  { 
    id: '4.10.5', 
    chapter: 4, 
    subChapter: '4.10 Reinigung und Desinfektion', 
    title: 'Nutzung Reinigungsgeräte', 
    description: '4.10.5* Die vorgesehene Nutzung der Reinigungs- und Desinfektionsausrüstung ist eindeutig festgelegt. Sie ist so zu verwenden und zu lagern, dass eine Kontamination vermieden wird.', 
    isKO: false 
  },
  { 
    id: '4.10.6', 
    chapter: 4, 
    subChapter: '4.10 Reinigung und Desinfektion', 
    title: 'Sicherheitsdatenblätter und Fachwissen', 
    description: 'Für Reinigungs- und Desinfektionschemikalien liegen vor Ort Sicherheitsdatenblätter und Anweisungen vor. Das für Reinigungs- und Desinfektionsaktivitäten verantwortliche Personal kann sein Wissen bezüglich der Anweisungen demonstrieren.', 
    isKO: false 
  },
  { 
    id: '4.10.7', 
    chapter: 4, 
    subChapter: '4.10 Reinigung und Desinfektion', 
    title: 'Verifizierung der Wirksamkeit', 
    description: 'Die Wirksamkeit der Reinigungs- und Desinfektionsmaßnahmen ist zu verifizieren. Die Verifizierung stützt sich auf einen risikobasierten Stichprobenplan und berücksichtigt eine oder mehrere Tätigkeiten, z. B. visuelle Überprüfung, Schnelltests oder analytische Untersuchungsmethoden. Daraus abgeleitete Maßnahmen sind dokumentiert.', 
    isKO: false 
  },
  { 
    id: '4.10.8', 
    chapter: 4, 
    subChapter: '4.10 Reinigung und Desinfektion', 
    title: 'Bewertung der Reinigungspläne', 
    description: 'Reinigungs- und Desinfektionspläne werden bewertet und falls notwendig, im Fall von Änderungen der Produkte, Prozesse oder der Reinigungs- und Desinfektionsausrüstung, angepasst.', 
    isKO: false 
  },
  { 
    id: '4.10.9', 
    chapter: 4, 
    subChapter: '4.10 Reinigung und Desinfektion', 
    title: 'Beauftragung von Dienstleistern', 
    description: 'Wenn ein Unternehmen einen Dienstleister mit den Reinigungs- und Desinfektionstätigkeiten in Produktionsbereichen beauftragt, sind alle zuvor genannten Anforderungen im entsprechenden Dienstleistungsvertrag dokumentiert.', 
    isKO: false 
  },
  { 
    id: '4.11.1', 
    chapter: 4, 
    subChapter: '4.11 Abfallmanagement', 
    title: 'Verfahren Abfallmanagement', 
    description: '4.11.1* Zur Vermeidung von Kreuzkontaminationen ist ein Verfahren zum Abfallmanagement dokumentiert, umgesetzt und aufrechtzuerhalten.', 
    isKO: false 
  },
  { 
    id: '4.11.2', 
    chapter: 4, 
    subChapter: '4.11 Abfallmanagement', 
    title: 'Rechtliche Bestimmungen Abfall', 
    description: '4.11.2 Alle lokalen rechtlichen Bestimmungen zur Abfallentsorgung werden eingehalten.', 
    isKO: false 
  },
  { 
    id: '4.11.3', 
    chapter: 4, 
    subChapter: '4.11 Abfallmanagement', 
    title: 'Entfernung von Abfällen', 
    description: '4.11.3 Lebensmittelabfälle und andere Abfälle werden so rasch wie möglich aus Räumen, in denen mit Lebensmitteln umgegangen wird, entfernt. Eine Anhäufung dieser Abfälle wird vermieden.', 
    isKO: false 
  },
  { 
    id: '4.11.4', 
    chapter: 4, 
    subChapter: '4.11 Abfallmanagement', 
    title: 'Abfallbehälter', 
    description: '4.11.4 Die Abfallbehälter sind eindeutig gekennzeichnet, angemessen gebaut und instand gehalten, leicht zu reinigen und wenn erforderlich, zu desinfizieren.', 
    isKO: false 
  },
  { 
    id: '4.11.5', 
    chapter: 4, 
    subChapter: '4.11 Abfallmanagement', 
    title: 'Anforderungen Futtermittelversorgungskette', 
    description: '4.11.5 Trennt das Unternehmen Lebensmittelabfälle, um diese der Futtermittelversorgungskette zuzuführen, sind Maßnahmen oder Verfahren umgesetzt, um Kontamination oder Verderb dieses Materials zu verhindern.', 
    isKO: false 
  },
  { 
    id: '4.11.6', 
    chapter: 4, 
    subChapter: '4.11 Abfallmanagement', 
    title: 'Sammlung und Entsorgungswege', 
    description: '4.11.6 Abfälle sind in getrennten Behältern entsprechend der vorgesehenen Entsorgungswege zu sammeln. Die Entsorgung dieser Abfälle erfolgt ausschließlich durch befugte Dritte. Das Unternehmen führt Aufzeichnungen zur Abfallentsorgung.', 
    isKO: false 
  },
  { 
    id: '4.12.1', 
    chapter: 4, 
    subChapter: '4.12 Risikominderung für Fremdmaterialien und -chemikalien', 
    title: 'KO Nr. 6: Risikominderung Fremdmaterialien', 
    description: '4.12.1* KO Nr. 6: Auf der Grundlage von Risiken sind Verfahren dokumentiert, umgesetzt und aufrechtzuerhalten, um eine Kontamination mit Fremdmaterialien zu verhindern. Kontaminierte Produkte sind wie nichtkonforme Produkte zu behandeln.', 
    isKO: true 
  },
  { 
    id: '4.12.2', 
    chapter: 4, 
    subChapter: '4.12 Risikominderung für Fremdmaterialien und -chemikalien', 
    title: 'Schutz gegen physikalische Kontamination', 
    description: '4.12.2 Die zu verarbeitenden Produkte sind gegen physikalische Kontamination geschützt, dies beinhaltet unter anderem: Umweltkontaminanten, Öle oder herabtropfende Flüssigkeiten aus Maschinen, Staubverschmutzungen. Besonders zu berücksichtigen ist Produktkontamination durch: Ausrüstung und Utensilien, Rohrleitungen, Gehwege, Arbeitsbühnen, Leitern. Ist der Schutz der Produkte aufgrund technologischer Merkmale und/oder Erfordernisse nicht möglich, sind geeignete Kontrollmaßnahmen umgesetzt.', 
    isKO: false 
  },
  { 
    id: '4.12.3', 
    chapter: 4, 
    subChapter: '4.12 Risikominderung für Fremdmaterialien und -chemikalien', 
    title: 'Eignung und Handhabung von Chemikalien', 
    description: '4.12.3 Alle Chemikalien innerhalb des Standorts sind für den Verwendungszweck geeignet und werden so gekennzeichnet, gelagert und gehandhabt, dass keine Kontaminationsrisiken entstehen.', 
    isKO: false 
  },
  { 
    id: '4.12.4', 
    chapter: 4, 
    subChapter: '4.12 Risikominderung für Fremdmaterialien und -chemikalien', 
    title: 'Installation und Wartung von Detektoren', 
    description: '4.12.4 Sind Metall- und Fremdkörperdetektoren erforderlich, sind diese so installiert, dass eine maximale Wirksamkeit der Detektion gewährleistet ist, um eine nachfolgende Kontamination zu verhindern. Die Detektoren sind mindestens einmal innerhalb eines 12-monatigen Zeitraums oder bei wesentlichen Änderungen einer Wartung zu unterziehen, um Fehlfunktionen zu vermeiden.', 
    isKO: false 
  },
  { 
    id: '4.12.5', 
    chapter: 4, 
    subChapter: '4.12 Risikominderung für Fremdmaterialien und -chemikalien', 
    title: 'Messgenauigkeit und Funktionsprüfungen', 
    description: '4.12.5 Die Messgenauigkeit aller Geräte und Methoden zur Erkennung und / oder Beseitigung von Fremdmaterial ist bestimmt. Funktionsprüfungen solcher Geräte und Methoden sind in risikobasierter Häufigkeit durchzuführen. Im Falle einer Fehlfunktion oder Störung sind die Auswirkungen auf Produkte und Prozesse zu bewerten.', 
    isKO: false 
  },
  { 
    id: '4.12.6', 
    chapter: 4, 
    subChapter: '4.12 Risikominderung für Fremdmaterialien und -chemikalien', 
    title: 'Umgang mit kontaminierten Produkten', 
    description: '4.12.6 Möglicherweise kontaminierte Produkte werden ausgesondert. Der Zugriff sowie Maßnahmen zur weiteren Handhabung / Nachkontrolle erfolgen nur von berechtigten Personen.', 
    isKO: false 
  },
  { 
    id: '4.12.7', 
    chapter: 4, 
    subChapter: '4.12 Risikominderung für Fremdmaterialien und -chemikalien', 
    title: 'Verwendung von Glas und zerbrechlichem Material', 
    description: '4.12.7 In Bereichen, in denen mit Rohwaren, Zwischenprodukten und Endprodukten umgegangen wird, ist die Verwendung von Glas und/oder zerbrechlichem Material ausgeschlossen. Wo die Anwesenheit von Glas oder zerbrechlichem Material nicht vermeidbar ist, ist das Risiko unter Kontrolle. Das Glas und/oder zerbrechliche Material ist sauber und stellt keine Gefährdung der Produktsicherheit dar.', 
    isKO: false 
  },
  { 
    id: '4.12.8', 
    chapter: 4, 
    subChapter: '4.12 Risikominderung für Fremdmaterialien und -chemikalien', 
    title: 'Umgang mit Behältern im Prozess', 
    description: '4.12.8 Risikobasierte Maßnahmen für den Umgang mit Verpackungsglas, Glasbehältern oder andere Arten von Behältern im Produktionsprozess (Wenden, Ausblasen, Spülen etc.) sind dokumentiert, umgesetzt und aufrechterhalten. Nach diesem Prozessschritt besteht kein weiteres Kontaminationsrisiko.', 
    isKO: false 
  },
  { 
    id: '4.12.9', 
    chapter: 4, 
    subChapter: '4.12 Risikominderung für Fremdmaterialien und -chemikalien', 
    title: 'Maßnahmen bei Glasbruch', 
    description: '4.12.9 Es sind Verfahren dokumentiert, umgesetzt und aufrechtzuerhalten, in denen die Maßnahmen beschrieben werden, die im Falle von Glasbruch und/oder zerbrechlichen Materialien zu ergreifen sind. Dazu gehört die Festlegung des Umfangs der zu isolierenden Ware, Angaben zum verantwortlichen Personal, die Reinigung sowie falls notwendig die Desinfektion des Produktionsumfeldes und die Freigabe der Produktionslinie für die weitere Produktion.', 
    isKO: false 
  },
  { 
    id: '4.12.10', 
    chapter: 4, 
    subChapter: '4.12 Risikominderung für Fremdmaterialien und -chemikalien', 
    title: 'Aufzeichnung von Glasbruch', 
    description: '4.12.10 Bruch von Glas und zerbrechlichen Materialien wird aufgezeichnet. Ausnahmen sind begründet und dokumentiert.', 
    isKO: false 
  },
  { 
    id: '4.12.11', 
    chapter: 4, 
    subChapter: '4.12 Risikominderung für Fremdmaterialien und -chemikalien', 
    title: 'Visuelle Kontrollen Fremdmaterial', 
    description: '4.12.11 Wenn visuelle Kontrollen zur Detektion von Fremdmaterialien genutzt werden, sind die für diesen Bereich eingesetzten Mitarbeiter geschult und ein Personalwechsel wird in angemessener Häufigkeit durchgeführt, um die maximale Wirksamkeit des Prozesses zu erreichen.', 
    isKO: false 
  },
  { 
    id: '4.12.12', 
    chapter: 4, 
    subChapter: '4.12 Risikominderung für Fremdmaterialien und -chemikalien', 
    title: 'Verwendung von Holz', 
    description: '4.12.12 In Bereichen, in denen mit Rohwaren, Zwischenprodukten und Endprodukten umgegangen wird, ist die Verwendung von Holz ausgeschlossen. Wo der Einsatz von Holz nicht vermeidbar ist, ist das Risiko unter Kontrolle. Das Holz ist sauber und stellt kein Risiko für die Produktsicherheit dar.', 
    isKO: false 
  },
  { 
    id: '4.13.1', 
    chapter: 4, 
    subChapter: '4.13 Schädlingsüberwachung/Schädlingsbekämpfung', 
    title: 'Vermeidung von Schädlingsbefall', 
    description: '4.13.1 Das Werksgelände und die Ausrüstung sind so konzipiert, gebaut und instand gehalten, dass ein Schädlingsbefall vermieden wird.', 
    isKO: false 
  },
  { 
    id: '4.13.2', 
    chapter: 4, 
    subChapter: '4.13 Schädlingsüberwachung/Schädlingsbekämpfung', 
    title: 'Risikobasierte Maßnahmen zur Schädlingsbekämpfung', 
    description: '4.13.2* Risikobasierte Maßnahmen zur Schädlingsbekämpfung sind zu dokumentieren, umzusetzen und aufrechtzuerhalten. Sie müssen die lokalen gesetzlichen Bestimmungen erfüllen und mindestens Folgendes berücksichtigen: Werksgelände und -umgebung (potenzielle und Zielschädlinge), Arten der Rohwaren / Endprodukte, Lageplan mit Anwendungsorten (Köderplan), für Schädlingsbefall anfällige Konstruktionen (z. B. Decken, Keller, Rohre/Ecken), Köderidentifizierung vor Ort, Verantwortlichkeiten (intern/extern), verwendete Mittel und Anwendungsvorschriften, Inspektionsintervalle, gemietete Lagerräume.', 
    isKO: false 
  },
  { 
    id: '4.13.3', 
    chapter: 4, 
    subChapter: '4.13 Schädlingsüberwachung/Schädlingsbekämpfung', 
    title: 'Beauftragung externer Dienstleister', 
    description: '4.13.3 Wird vom Unternehmen ein externer Dienstleister zur Schädlingsbekämpfung beauftragt, sind alle zuvor genannten Anforderungen im entsprechenden Dienstleistungsvertrag dokumentiert. Eine kompetente Person des Unternehmens ist zur Überwachung der Schädlingsbekämpfungsaktivitäten benannt. Die Verantwortung für die erforderlichen Maßnahmen (einschließlich der laufenden Aufsicht) verbleibt im Unternehmen.', 
    isKO: false 
  },
  { 
    id: '4.13.4', 
    chapter: 4, 
    subChapter: '4.13 Schädlingsüberwachung/Schädlingsbekämpfung', 
    title: 'Dokumentation von Inspektionen und Maßnahmen', 
    description: '4.13.4 Die Inspektionen und die daraus resultierenden Maßnahmen zur Schädlingsbekämpfung sind zu dokumentieren. Die Umsetzung der Maßnahmen wird überwacht und aufgezeichnet. Jeglicher Befall wird dokumentiert und Maßnahmen zur Schädlingsbekämpfung werden ergriffen.', 
    isKO: false 
  },
  { 
    id: '4.13.5', 
    chapter: 4, 
    subChapter: '4.13 Schädlingsüberwachung/Schädlingsbekämpfung', 
    title: 'Köder, Fallen und Insektenvernichter', 
    description: '4.13.5 Köder, Fallen und Insektenvernichter sind voll funktionsfähig, in ausreichender Anzahl vorhanden, für den Verwendungszweck geeignet, an geeigneter Stelle korrekt angebracht und so verwendet, dass eine Kontamination verhindert wird.', 
    isKO: false 
  },
  { 
    id: '4.13.6', 
    chapter: 4, 
    subChapter: '4.13 Schädlingsüberwachung/Schädlingsbekämpfung', 
    title: 'Inspektion eingehender Lieferungen', 
    description: '4.13.6 Eingehende Lieferungen werden im Wareneingang auf die Anwesenheit von Schädlingen inspiziert. Jeder Fund wird aufgezeichnet.', 
    isKO: false 
  },
  { 
    id: '4.13.7', 
    chapter: 4, 
    subChapter: '4.13 Schädlingsüberwachung/Schädlingsbekämpfung', 
    title: 'Überwachung der Wirksamkeit und Trendanalyse', 
    description: '4.13.7 Die Wirksamkeit der Schädlingsbekämpfungsmaßnahmen ist überwacht. Dies schließt aktuelle Trendanalysen zur rechtzeitigen Einleitung geeigneter Maßnahmen ein. Aufzeichnungen zur Überwachung sind vorhanden.', 
    isKO: false 
  },
  { 
    id: '4.14.1', 
    chapter: 4, 
    subChapter: '4.14 Wareneingang und Lagerung von Waren', 
    title: 'Prübung angelieferter Waren', 
    description: '4.14.1* Alle angelieferten Waren, inkl. Verpackungsmaterial und Etiketten, werden auf Einhaltung der Spezifikationen und nach einem festgelegten risikobasierten Überwachungsplan überprüft. Der Überwachungsplan ist durch die Risikobewertung bestätigt. Die Ergebnisse dieser Inspektionen werden dokumentiert.', 
    isKO: false 
  },
  { 
    id: '4.14.2', 
    chapter: 4, 
    subChapter: '4.14 Wareneingang und Lagerung von Waren', 
    title: 'System für Lagerbedingungen', 
    description: '4.14.2* Es ist ein System umgesetzt und aufrechtzuerhalten, das sicherstellt, dass die Lagerbedingungen für Rohwaren, Zwischen- und Endprodukte sowie Verpackungsmaterialien den jeweiligen Produktspezifikationen entsprechen und keine negative Auswirkung auf andere Produkte haben.', 
    isKO: false 
  },
  { 
    id: '4.14.3', 
    chapter: 4, 
    subChapter: '4.14 Wareneingang und Lagerung von Waren', 
    title: 'Minimierung von Kontaminationsrisiken', 
    description: '4.14.3 Rohwaren, Verpackung, Zwischen- und Endprodukte sind so gelagert, dass Kontaminationsrisiken und andere negative Auswirkungen minimiert sind.', 
    isKO: false 
  },
  { 
    id: '4.14.4', 
    chapter: 4, 
    subChapter: '4.14 Wareneingang und Lagerung von Waren', 
    title: 'Lagerung von Betriebs- und Hilfsstoffen', 
    description: '4.14.4 Für die Handhabung und Lagerung von Betriebs-, Hilfs- und Zusatzstoffen sind angemessene Lagereinrichtungen vorhanden. Das für die Kontrolle der Lagereinrichtungen verantwortliche Personal ist geschult.', 
    isKO: false 
  },
  { 
    id: '4.14.5', 
    chapter: 4, 
    subChapter: '4.14 Wareneingang und Lagerung von Waren', 
    title: 'Kennzeichnung und FIFO/FEFO', 
    description: '4.14.5* Alle Produkte sind zu kennzeichnen. Der Gebrauch der Produkte wird nach den Grundsätzen des First In / First Out bzw. First Expired / First Out vorgenommen.', 
    isKO: false 
  },
  { 
    id: '4.14.6', 
    chapter: 4, 
    subChapter: '4.14 Wareneingang und Lagerung von Waren', 
    title: 'Anforderungen an externe Lagerhaltung', 
    description: '4.14.6 Werden externe Dienstleister für die Lagerhaltung eingesetzt, sind diese nach IFS Logistics oder einem anderen GFSI-anerkannten Standard zertifiziert, der den jeweiligen Anwendungsbereich abdeckt. Ist dies nicht der Fall, so sind alle relevanten Anforderungen, die den eigenen Lagerhaltungspraktiken des Unternehmens entsprechen, erfüllt. Dies ist in einem Dienstleistungsvertrag festgeschrieben.', 
    isKO: false 
  },
  { 
    id: '4.15.1', 
    chapter: 4, 
    subChapter: '4.15 Transport', 
    title: 'Zustandsprüfung Transportfahrzeuge', 
    description: '4.15.1* Der Zustand in den Fahrzeugen bezogen auf die Abwesenheit von z. B.: Fremdgerüchen, Staubentwicklung, unerwünschter Luftfeuchtigkeit, Schädlingen, Schimmel wird vor der Beladung überprüft und dokumentiert, um die Einhaltung der festgelegten Bedingungen zu gewährleisten.', 
    isKO: false 
  },
  { 
    id: '4.15.2', 
    chapter: 4, 
    subChapter: '4.15 Transport', 
    title: 'Prüfung der Ladetemperatur', 
    description: '4.15.2 Sofern für den Transport eine bestimmte Temperaturanforderung vorgesehen ist, wird vor der Beladung die Temperatur im Transportfahrzeug geprüft und dokumentiert.', 
    isKO: false 
  },
  { 
    id: '4.15.3', 
    chapter: 4, 
    subChapter: '4.15 Transport', 
    title: 'Verfahren zur Kontaminationsvermeidung', 
    description: '4.15.3 Verfahren zur Vermeidung von Kontaminationen während des Transports, einschließlich des Be- und Entladens, sind dokumentiert, umgesetzt und aufrechtzuerhalten. Dabei werden gegebenenfalls verschiedene Kategorien von Waren berücksichtigt (Lebensmittel / Non-Food).', 
    isKO: false 
  },
  { 
    id: '4.15.4', 
    chapter: 4, 
    subChapter: '4.15 Transport', 
    title: 'Temperaturüberwachung während des Transports', 
    description: '4.15.4 Sofern für den Transport eine bestimmte Temperaturanforderung vorgesehen ist, wird die Einhaltung der Temperatur während des Transports sichergestellt und dokumentiert.', 
    isKO: false 
  },
  { 
    id: '4.15.5', 
    chapter: 4, 
    subChapter: '4.15 Transport', 
    title: 'Hygieneanforderungen für Transportmittel', 
    description: '4.15.5 Es sind risikobasierte Hygieneanforderungen für alle Transportfahrzeuge und Hilfsmittel für die Be- und Entladung (z. B. Schläuche für Siloanlagen) umgesetzt. Durchgeführte Maßnahmen sind aufgezeichnet.', 
    isKO: false 
  },
  { 
    id: '4.15.6', 
    chapter: 4, 
    subChapter: '4.15 Transport', 
    title: 'Gestaltung des Verladebereichs', 
    description: '4.15.6 Der Verladebereich ist für den Verwendungszweck geeignet. Er ist in der Art gestaltet, dass: das Risiko von Schädlingsbefall minimiert ist, Produkte gegen widrige Wetterverhältnisse geschützt sind, Ansammlung von Abfall vermieden wird, Kondensation und Schimmelbildung verhindert werden, Reinigung und erforderlichenfalls Desinfektion problemlos durchgeführt werden können.', 
    isKO: false 
  },
  { 
    id: '4.15.7', 
    chapter: 4, 
    subChapter: '4.15 Transport', 
    title: 'Einsatz von Transportdienstleistern', 
    description: '4.15.7 Werden Transportdienstleister beauftragt, sind diese nach IFS Logistics oder einem anderen GFSI-anerkannten Standard, der den jeweiligen Anwendungsbereich abdeckt, zertifiziert. Ist dies nicht der Fall, sind alle relevanten Anforderungen, die den eigenen Transportpraktiken des Unternehmens entsprechen, erfüllt. Dies ist in einem Dienstleistungsvertrag festgeschrieben.', 
    isKO: false 
  },
  { 
    id: '4.16.1', 
    chapter: 4, 
    subChapter: '4.16 Wartung und Reparatur', 
    title: 'Wartungsplan und Dokumentation', 
    description: '4.16.1* Ein Wartungsplan ist dokumentiert, umgesetzt und aufrechtzuerhalten, der alle kritischen Ausrüstungen (inkl. Transport und Lagerräumlichkeiten) umfasst, um Lebensmittelsicherheit, Produktqualität und -legalität sicherzustellen. Dies gilt gleichermaßen für interne Wartungsarbeiten und Tätigkeiten durch Dienstleister. Der Plan beinhaltet Verantwortlichkeiten, Prioritäten und Fälligkeitstermine.', 
    isKO: false 
  },
  { 
    id: '4.16.2', 
    chapter: 4, 
    subChapter: '4.16 Wartung und Reparatur', 
    title: 'Gewährleistung der Sicherheit bei Wartungsarbeiten', 
    description: '4.16.2 Lebensmittelsicherheit, Produktqualität, -legalität und -authentizität sind während und nach Wartungs- und Reparaturarbeiten zu gewährleisten. Wartungs- und Reparaturarbeiten werden dokumentiert.', 
    isKO: false 
  },
  { 
    id: '4.16.3', 
    chapter: 4, 
    subChapter: '4.16 Wartung und Reparatur', 
    title: 'Eignung von Wartungsmaterialien', 
    description: '4.16.3 Alle für Wartungs- und Reparaturarbeiten eingesetzten Materialien sind für den Verwendungszweck geeignet und stellen kein Kontaminationsrisiko dar.', 
    isKO: false 
  },
  { 
    id: '4.16.4', 
    chapter: 4, 
    subChapter: '4.16 Wartung und Reparatur', 
    title: 'Identifikation von Ausfällen und Fehlfunktionen', 
    description: '4.16.4 Ausfälle und Fehlfunktionen von Anlagen und Geräten (einschließlich Transport), die für die Lebensmittelsicherheit und Produktqualität wesentlich sind, sind identifiziert, dokumentiert und überprüft, um rechtzeitige Maßnahmen zu ermöglichen und den Wartungsplan zu verbessern.', 
    isKO: false 
  },
  { 
    id: '4.16.5', 
    chapter: 4, 
    subChapter: '4.16 Wartung und Reparatur', 
    title: 'Provisorische Reparaturarbeiten', 
    description: '4.16.5 Provisorische Reparaturarbeiten sind ohne Beeinträchtigung der Lebensmittelsicherheit and Produktqualität durchzuführen. Diese Arbeiten sind dokumentiert. Eine kurze Frist zur Beseitigung des Problems ist festgelegt.', 
    isKO: false 
  },
  { 
    id: '4.16.6', 
    chapter: 4, 
    subChapter: '4.16 Wartung und Reparatur', 
    title: 'Anforderungen an externe Wartungsdienstleister', 
    description: '4.16.6 Werden externe Dienstleister für Wartungs- und Reparaturarbeiten eingesetzt, sind alle Anforderungen des Unternehmens zu eingesetzten Materialien, Geräten und Durchführungsvorschriften in einem Dienstleistungsvertrag festgelegt, dokumentiert und einzuhalten, um jegliche Produktkontamination zu vermeiden.', 
    isKO: false 
  },
  { 
    id: '4.17.1', 
    chapter: 4, 
    subChapter: '4.17 Anlagen und Ausrüstungsgegenstände', 
    title: 'Anlagengestaltung und Validierung', 
    description: '4.17.1* Anlagen und Ausrüstungen sind für den Verwendungszweck entsprechend definiert und konstruiert. Vor der Inbetriebnahme neuer Anlagen und Ausrüstungen ist die Einhaltung der Anforderungen an Lebensmittelsicherheit, Produktqualität, -legalität, -authentizität sowie der Kundenanforderungen zu validieren.', 
    isKO: false 
  },
  { 
    id: '4.17.2', 
    chapter: 4, 
    subChapter: '4.17 Anlagen und Ausrüstungsgegenstände', 
    title: 'Konformitätsnachweise Ausrüstung', 
    description: '4.17.2 Für alle eingesetzten Ausrüstungsgegenstände und Utensilien, die Einfluss auf das Produkt haben könnten, ist die Einhaltung der gesetzlichen Anforderungen nachzuweisen. Existieren keine rechtlichen Anforderungen, liegen Nachweise vor wie z. B.: Konformitätserklärungen, technische Spezifikationen, Selbsterklärungen des Herstellers, um nachzuweisen, dass sie für die vorgesehene Verwendung geeignet sind.', 
    isKO: false 
  },
  { 
    id: '4.17.3', 
    chapter: 4, 
    subChapter: '4.17 Anlagen und Ausrüstungsgegenstände', 
    title: 'Reinigungsgerechte Gestaltung', 
    description: '4.17.3 Anlagen und Ausrüstungsgegenstände sind so angelegt, dass die Reinigungs-, Desinfektions- und Wartungsarbeiten wirksam durchgeführt werden können.', 
    isKO: false 
  },
  { 
    id: '4.17.4', 
    chapter: 4, 
    subChapter: '4.17 Anlagen und Ausrüstungsgegenstände', 
    title: 'Zustand der Ausrüstung', 
    description: '4.17.4 Alle Ausrüstungsgegenstände befinden sich in einem Zustand, der die Lebensmittelsicherheit und Produktqualität nicht beeinträchtigt.', 
    isKO: false 
  },
  { 
    id: '4.17.5', 
    chapter: 4, 
    subChapter: '4.17 Anlagen und Ausrüstungsgegenstände', 
    title: 'Prüfung bei Änderungen an Ausrüstung', 
    description: '4.17.5 Im Falle von Änderungen an Ausrüstungsgegenständen und Anlagen werden die Prozessmerkmale überprüft, um sicherzustellen, dass die Anforderungen an Lebensmittelsicherheit, Produktqualität, -legalität, -authentizität sowie Kundenanforderungen eingehalten werden.', 
    isKO: false 
  },
  { 
    id: '4.18.1', 
    chapter: 4, 
    subChapter: '4.18 Rückverfolgbarkeit', 
    title: 'KO Nr. 7: Rückverfolgbarkeitssystem', 
    description: '4.18.1* KO Nr. 7: Ein System zur Rückverfolgung ist dokumentiert, umgesetzt und aufrechtzuerhalten, das die Identifizierung von Produktlosen und deren Beziehung zu Chargen von Rohwaren, Verpackungsmaterialien mit Lebensmittelkontakt und/oder Materialien mit rechtlichen und/oder relevanten Informationen zur Lebensmittelsicherheit ermöglicht. Das System zur Rückverfolgung bezieht alle relevanten Aufzeichnungen mit ein: Wareneingang, Verarbeitung in allen Schritten, Nutzung von Nachbearbeitung (Rework), Vertrieb.', 
    isKO: true 
  },
  { 
    id: '4.18.2', 
    chapter: 4, 
    subChapter: '4.18 Rückverfolgbarkeit', 
    title: 'Sicherstellung der Rückverfolgbarkeit bis zum Kunden', 
    description: '4.18.2* Die Rückverfolgbarkeit ist bis zur Lieferung an den Kunden sichergestellt und dokumentiert.', 
    isKO: false 
  },
  { 
    id: '4.18.3', 
    chapter: 4, 
    subChapter: '4.18 Rückverfolgbarkeit', 
    title: 'Test des Rückverfolgbarkeitssystems', 
    description: '4.18.3 Das Rückverfolgbarkeitssystem, einschließlich Massenbilanz, ist mindestens einmal innerhalb eines 12-monatigen Zeitraums oder bei wesentlichen Änderungen zu testen. Die Muster repräsentieren die Komplexität der Produktpalette des Unternehmens. Aufzeichnungen der Tests zeigen die Rückverfolgbarkeit in beide Richtungen (vom gelieferten Produkt zu Rohwaren und umgekehrt). Die Rückverfolgbarkeit von den Endprodukten zu den Rohwaren und zu den Kunden erfolgt in maximal vier (4) Stunden. Die Testergebnisse, einschließlich des Zeitrahmens für die Beschaffung der Informationen, sind aufgezeichnet und gegebenenfalls erforderliche Maßnahmen umgesetzt. Die Ziele des Zeitrahmens entsprechen den Kundenanforderungen, wenn weniger als vier (4) Stunden gefordert sind.', 
    isKO: false 
  },
  { 
    id: '4.18.4', 
    chapter: 4, 
    subChapter: '4.18 Rückverfolgbarkeit', 
    title: 'Loskennzeichnung', 
    description: '4.18.4 Die Loskennzeichnung am End- und Zwischenprodukt, die eine eindeutige Rückverfolgung der Ware ermöglicht, erfolgt unmittelbar, wenn die Ware verpackt wird. Sofern erst zu einem späteren Zeitpunkt etikettiert wird, ist die zwischengelagerte Ware bereits mit der spezifischen Loskennzeichnung versehen. Die Mindesthaltbarkeitsdauer der etikettierten Ware wird auf Basis des ursprünglichen Herstellungszeitpunktes festgelegt.', 
    isKO: false 
  },
  { 
    id: '4.18.5', 
    chapter: 4, 
    subChapter: '4.18 Rückverfolgbarkeit', 
    title: 'Rückstellmuster', 
    description: '4.18.5 Wenn vom Kunden gefordert, werden Rückstellmuster, die repräsentativ for das Herstellungslos oder die Chargennummer sind, entsprechend gelagert und bis zum Ablauf des Verfallsdatums oder Mindesthaltbarkeitsdatums der Endprodukte aufbewahrt, wenn nötig auch noch für einen festgelegten Zeitraum nach Ablauf der Frist.', 
    isKO: false 
  },
  { 
    id: '4.19.1', 
    chapter: 4, 
    subChapter: '4.19 Allergen-Risikominderung', 
    title: 'Risikobewertung Rohwaren / Allergenaufstellung', 
    description: '4.19.1 Für alle Rohwaren wird eine Risikobewertung durchgeführt, um deklarationspflichtige Allergene, einschließlich zufälliger oder technisch unvermeidbarer Kreuzkontaminationen von gesetzlich zu deklarierenden Allergenen und Spuren, zu ermitteln. Diese Informationen sind verfügbar und für das Land/die Länder des Verkaufs der Endprodukte relevant. Sie sind für alle Rohwaren dokumentiert und gepflegt. Eine stets aktualisierte Aufstellung aller in der Betriebstätte verwendeten allergenhaltigen Rohwaren ist geführt. Darin sind auch alle Mischungen und Rezepturen anzugeben, denen solche allergenhaltigen Rohwaren zugesetzt werden.', 
    isKO: false 
  },
  { 
    id: '4.19.2', 
    chapter: 4, 
    subChapter: '4.19 Allergen-Risikominderung', 
    title: 'Maßnahmen zur Allergenkontrolle', 
    description: '4.19.2* Risikobasierte Maßnahmen sind von der Annahme bis zum Versand umgesetzt und aufrechterhalten, um eine mögliche Kreuzkontamination der Produkte mit Allergenen zu minimieren. Die potenziellen Risiken für Kreuzkontamination sind zu berücksichtigen, und zwar mindestens in Bezug auf Umgebung, Transport, Lagerung, Rohmaterialien, Personal (einschließlich Auftragnehmer und Besucher). Die durchgeführten Maßnahmen werden überwacht.', 
    isKO: false 
  },
  { 
    id: '4.19.3', 
    chapter: 4, 
    subChapter: '4.19 Allergen-Risikominderung', 
    title: 'Allergenkennzeichnung am Endprodukt', 
    description: '4.19.3 Endprodukte die deklarationspflichtige Allergene enthalten, sind entsprechend den rechtlichen Bestimmungen zu kennzeichnen. Unbeabsichtigte oder technisch nicht vermeidbare Kreuzkontaminationen mit gesetzlich zu deklarierenden Allergenen sowie Spuren sind zu kennzeichnen. Die Entscheidung ist risikobasiert. Die potenzielle Allergen-Kreuzkontamination durch Rohwaren, die im Unternehmen verarbeitet werden, ist ebenfalls in der Deklaration zu berücksichtigen.', 
    isKO: false 
  },
  { 
    id: '4.20.1', 
    chapter: 4, 
    subChapter: '4.20 Lebensmittelbetrug (Food Fraud)', 
    title: 'Verantwortlichkeiten Lebensmittelbetrug', 
    description: '4.20.1 Die Zuständigkeiten für die Verwundbarkeitsanalyse (Vulnerability Assessment) und den Plan zur Bekämpfung von Lebensmittelbetrug ist festgelegt. Die verantwortliche(n) Person(en) verfügt/verfügen über die entsprechenden spezifischen Kenntnisse.', 
    isKO: false 
  },
  { 
    id: '4.20.2', 
    chapter: 4, 
    subChapter: '4.20 Lebensmittelbetrug (Food Fraud)', 
    title: 'Verwundbarkeitsanalyse Lebensmittelbetrug', 
    description: '4.20.2* Eine Verwundbarkeitsanalyse für Lebensmittelbetrug, einschließlich Bewertungskriterien, ist dokumentiert, umgesetzt und aufrechtzuerhalten. Die Verwundbarkeitsanalyse umfasst alle Rohwaren, Zutaten, Verpackungsmaterialien und ausgelagerten Prozesse, um die Risiken von betrügerischen Aktivitäten in Bezug auf Austausch, Falschetikettierung, Verfälschung oder Imitation zu ermitteln.', 
    isKO: false 
  },
  { 
    id: '4.20.3', 
    chapter: 4, 
    subChapter: '4.20 Lebensmittelbetrug (Food Fraud)', 
    title: 'Plan zur Bekämpfung von Lebensmittelbetrug', 
    description: '4.20.3 Ein Plan zur Bekämpfung von Lebensmittelbetrug mit Bezug auf die Verwundbarkeitsanalyse ist dokumentiert, umgesetzt und aufrechtzuerhalten und beinhaltet die Test- und Überwachungsmethoden.', 
    isKO: false 
  },
  { 
    id: '4.20.4', 
    chapter: 4, 
    subChapter: '4.20 Lebensmittelbetrug (Food Fraud)', 
    title: 'Überprüfung Verwundbarkeitsanalyse', 
    description: '4.20.4* Die Verwundbarkeitsanalyse für Lebensmittelbetrug wird mindestens einmal innerhalb eines 12-monatigen Zeitraums oder bei wesentlichen Änderungen überprüft. Falls notwendig, wird der Plan zur Bekämpfung von Lebensmittelbetrug angepasst.', 
    isKO: false 
  },
  { 
    id: '4.21.1', 
    chapter: 4, 
    subChapter: '4.21 Produktschutz (Food Defence)', 
    title: 'Verantwortlichkeiten Produktschutz', 
    description: '4.21.1 Die Verantwortlichkeiten für den Produktschutz (Food Defence)-Plan sind definiert. Die verantwortliche(n) Person(en) verfügt/verfügen über die entsprechenden spezifischen Kenntnisse.', 
    isKO: false 
  },
  { 
    id: '4.21.2', 
    chapter: 4, 
    subChapter: '4.21 Produktschutz (Food Defence)', 
    title: 'Produktschutz-Verfahren und -Plan', 
    description: '4.21.2* Ein Produktschutz (Food Defence)-Verfahren und -Plan sind dokumentiert, umgesetzt und aufrechtzuerhalten, um mögliche Bedrohungen zu ermitteln und Produktschutzmaßnahmen festzulegen. Dies beinhaltet mindestens: rechtliche Anforderungen, Erkennen von kritischen Bereichen und / oder Handhabungen und die Zugangsrichtlinien für Mitarbeiter, Besucher und Auftragnehmer, Umgang mit externen Inspektionen und behördlichen Besuchen, alle anderen, angemessenen Kontrollmaßnahmen.', 
    isKO: false 
  },
  { 
    id: '4.21.3', 
    chapter: 4, 
    subChapter: '4.21 Produktschutz (Food Defence)', 
    title: 'Überprüfung des Produktschutzplans', 
    description: '4.21.3 Der Produktschutz (Food Defence)-Plan ist mindestens einmal innerhalb von 12 Monaten oder bei wesentlichen Änderungen zu prüfen und auf seine Wirksamkeit zu testen', 
    isKO: false 
  },

  // KAPITEL 5: Messungen, Analysen, Verbesserungen
  { 
    id: '5.1.1', 
    chapter: 5, 
    subChapter: '5.1 Interne Audits', 
    title: 'KO Nr. 8: Internes Auditprogramm', 
    description: '5.1.1* KO Nr. 8: Ein wirksames internes Auditprogramm ist dokumentiert, umgesetzt und aufrechtzuerhalten. Es stellt sicher, dass mindestens alle Anforderungen des IFS Standards auditiert werden. Diese Tätigkeit wird innerhalb eines Zeitraums von 12 Monaten geplant und ihre Durchführung darf 15 Monate nicht überschreiten. Das Unternehmen verfügt über eine Risikobewertung, auf deren Grundlage Tätigkeiten, die kritisch für Lebensmittelsicherheit und Produktqualität sind, häufiger auditiert werden. Das interne Auditprogramm beinhaltet ebenfalls firmeneigene oder gemietete Lagerräume, die sich nicht auf dem Firmengelände befinden.', 
    isKO: true 
  },
  { 
    id: '5.1.2', 
    chapter: 5, 
    subChapter: '5.1 Interne Audits', 
    title: 'Kompetenz und Unabhängigkeit der Auditoren', 
    description: '5.1.2 Die Auditoren sind sachkundig und stehen in keiner Abhängigkeitsbeziehung zum auditierten Bereich.', 
    isKO: false 
  },
  { 
    id: '5.1.3', 
    chapter: 5, 
    subChapter: '5.1 Interne Audits', 
    title: 'Kommunikation der Auditergebnisse', 
    description: '5.1.3 Die internen Audits sind dokumentiert und die Ergebnisse an die Unternehmensleitung und den für die betreffenden Tätigkeiten verantwortlichen Personen kommuniziert. Konformitäten, Abweichungen und Nichtkonformitäten sind zu dokumentieren und den relevanten Personen mitzuteilen.', 
    isKO: false 
  },

  { 
    id: '5.2.1', 
    chapter: 5, 
    subChapter: '5.2 Betriebsbegehungen', 
    title: 'Betriebsstätten- und Werksbegehungen', 
    description: '5.2.1* Betriebsstätten- und Werksbegehungen sind geplant und werden zu bestimmten Themen durchgeführt, wie z. B.: baulicher Zustand der Produktions- und Lagerräume, Außenbereiche, Produktkontrolle während der Verarbeitung, Hygiene während der Verarbeitung und in der Infrastruktur, Gefahren durch Fremdkörper/-materialien, Personalhygiene. Die Häufigkeit der Begehungen wird risikobasiert und auf Grundlage vorangegangener Ergebnisse festgelegt.', 
    isKO: false 
  },

  { 
    id: '5.3.1', 
    chapter: 5, 
    subChapter: '5.3 Validierung und Kontrolle von Prozessen', 
    title: 'Festlegung von Prozesskriterien', 
    description: '5.3.1 Es sind Kriterien für die Prozessvalidierung und -kontrolle festgelegt.', 
    isKO: false 
  },
  { 
    id: '5.3.2', 
    chapter: 5, 
    subChapter: '5.3 Validierung und Kontrolle von Prozessen', 
    title: 'Überwachung von Prozessparametern', 
    description: '5.3.2 Prozessparameter (Temperatur, Zeit, Druck, chemische Eigenschaften etc.), die für die Gewährleistung der Lebensmittelsicherheit und der Produktqualität von wesentlicher Bedeutung sind, sind zu überpachen, kontinuierlich und/oder in angemessenen Abständen aufzuzeichnen und gegen unbefugten Zugriff und/oder unbefugte Veränderung zu sichern.', 
    isKO: false 
  },
  { 
    id: '5.3.3', 
    chapter: 5, 
    subChapter: '5.3 Validierung und Kontrolle von Prozessen', 
    title: 'Überwachung von Nachbearbeitung (Rework)', 
    description: '5.3.3* Alle Nachbearbeitungen (Rework) werden validiert, überwacht und dokumentiert. Diese Arbeiten beeinträchtigen nicht die Lebensmittelsicherheits- und Produktqualitätsanforderungen.', 
    isKO: false 
  },
  { 
    id: '5.3.4', 
    chapter: 5, 
    subChapter: '5.3 Validierung und Kontrolle von Prozessen', 
    title: 'Meldung von Prozessabweichungen', 
    description: '5.3.4 Verfahren zur unverzüglichen Meldung, Aufzeichnung und Überwachung von Störungen und Prozessabweichungen sind dokumentiert, umgesetzt und aufrechtzuerhalten.', 
    isKO: false 
  },
  { 
    id: '5.3.5', 
    chapter: 5, 
    subChapter: '5.3 Validierung und Kontrolle von Prozessen', 
    title: 'Durchführung der Prozessvalidierung', 
    description: '5.3.5 Die Prozessvalidierung wird auf Grundlage der für die Lebensmittelsicherheit und Prozesse relevanten gesammelten Daten durchgeführt. Treten wesentliche Änderungen auf, wird eine erneute Validierung vorgenommen.', 
    isKO: false 
  },

  { 
    id: '5.4.1', 
    chapter: 5, 
    subChapter: '5.4 Kalibrierung, Justierung und Prüfung von Mess- und Überwachungsmitteln', 
    title: 'Identifizierung von Messmitteln', 
    description: '5.4.1* Mess- und Überwachungsmittel, die erforderlich sind, um die Einhaltung der Lebensmittelsicherheits- und Produktqualitätsanforderungen zu gewährleisten, sind zu identifizieren und zu erfassen. Ihr Kalibrierstatus ist aufgezeichnet. Mess- und Überwachungsmitttel sind behördlich zugelassen, wenn dies nach den geltenden Rechtsvorschriften erforderlich ist.', 
    isKO: false 
  },
  { 
    id: '5.4.2', 
    chapter: 5, 
    subChapter: '5.4 Kalibrierung, Justierung und Prüfung von Mess- und Überwachungsmitteln', 
    title: 'Prüf- und Kalibrierintervalle', 
    description: '5.4.2* Alle Messmittel sind in festgelegten Abständen nach festgelegten, anerkannten Normen/Methoden und innerhalb der relevanten Grenzen der Prozessparameterwerte zu prüfen, zu überwachen, einzustellen und zu kalibrieren. Die Ergebnisse sind zu dokumentieren.', 
    isKO: false 
  },
  { 
    id: '5.4.3', 
    chapter: 5, 
    subChapter: '5.4 Kalibrierung, Justierung und Prüfung von Mess- and Überwachungsmitteln', 
    title: 'Umgang mit Fehlfunktionen von Messmitteln', 
    description: '5.4.3 Alle Messmittel werden ausschließlich für ihren vorgesehenen Zweck eingesetzt. Weisen die Messergebnisse oder der Status des Geräts auf eine Funktionsstörung hin, ist das betreffende Gerät unverzüglich zu reparieren oder auszutauschen. Wurde eine Fehlfunktion festgestellt, so sind die Auswirkungen auf Prozesse und Produkte zu bewerten, um festzustellen, ob nichtkonforme Produkte verarbeitet wurden.', 
    isKO: false 
  },

  { 
    id: '5.5.1', 
    chapter: 5, 
    subChapter: '5.5 Überwachung der Mengenkontrolle (Quantitative Kontrolle)', 
    title: 'Kriterien für Mengenkontrolle', 
    description: '5.5.1* Es sind Konformitätskriterien für die Mengenkontrolle des Loses festgelegt. Ein System zur Häufigkeit und Methodik der Mengenkontrolle ist eingerichtet und aufrechtzuerhalten, um den gesetzlichen Anforderungen der Bestimmungsländer und den Kundenspezifikationen zu entsprechen.', 
    isKO: false 
  },
  { 
    id: '5.5.2', 
    chapter: 5, 
    subChapter: '5.5 Überwachung der Mengenkontrolle (Quantitative Kontrolle)', 
    title: 'Durchführung der Mengenkontrolle', 
    description: '5.5.2* Die Überwachung der Mengenkontrolle ist nach einem Prüfplan durchzuführen und aufzuzeichnen, der eine ordnungsgemäße Darstellung der hergestellten Charge gewährleistet. Die Ergebnisse dieser Überwachung erfüllen die definierten Anforderungen für alle lieferbereiten Produkte.', 
    isKO: false 
  },

  { 
    id: '5.6.1', 
    chapter: 5, 
    subChapter: '5.6 Produkttests und Umgebungsmonitoring', 
    title: 'Test- und Überwachungspläne', 
    description: '5.6.1* Test- und Überwachungspläne für interne und externe Analysen sind dokumentiert und umgesetzt und sind risikobasiert, um sicherzustellen, dass Produktsicherheit, -qualität, -legalität, -authentizität und spezifische Kundenanforderungen erfüllt werden. Die Pläne beinhalten mindestens Folgendes: Rohwaren, Zwischenprodukte (wenn anwendbar), Endprodukte, Verpackungsmaterialien, Kontaktflächen von Verarbeitungsausrüstungen/-anlagen, relevante Parameter für das Umgebungsmonitoring. Die Prüfergebnisse werden aufgezeichnet.', 
    isKO: false 
  },
  { 
    id: '5.6.2', 
    chapter: 5, 
    subChapter: '5.6 Produkttests und Umgebungsmonitoring', 
    title: 'Kriterien für Umgebungsmonitoring', 
    description: '5.6.2* Auf Grundlage der Risiken sind die Kriterien für das Umgebungsmonitoring dokumentiert, umgesetzt und aufrechtzuerhalten.', 
    isKO: false 
  },
  { 
    id: '5.6.3', 
    chapter: 5, 
    subChapter: '5.6 Produkttests und Umgebungsmonitoring', 
    title: 'Akkreditierung von Analysenlaboren', 
    description: '5.6.3* Analysen, die für die Lebensmittelsicherheit relevant sind, werden vorzugsweise in Laboren mit geeigneten akkreditierten Programmen / Methoden (ISO/IEC 17025) durchgeführt. Werden diese Analysen durch ein eigenes oder ein Labor ohne die entsprechenden akkreditierten Programme/ Methoden durchgeführt, werden die Ergebnisse mindestens ein Mal innerhalb von 12 Monaten oder bei wesentlichen Änderungen durch Labore abgeglichen, die diese Programme/Methoden (ISO/IEC 17025) verwenden.', 
    isKO: false 
  },
  { 
    id: '5.6.4', 
    chapter: 5, 
    subChapter: '5.6 Produkttests und Umgebungsmonitoring', 
    title: 'Zuverlässigkeit interner Analysen', 
    description: '5.6.4 Es sind Verfahren dokumentiert, umgesetzt und aufrechtzuerhalten, die die Zuverlässigkeit der Ergebnisse interner Analysen auf Basis offiziell anerkannter Untersuchungsmethoden sicherstellen. Diese sind anhand von Ringtests bzw. Befähigungstests nachgewiesen.', 
    isKO: false 
  },
  { 
    id: '5.6.5', 
    chapter: 5, 
    subChapter: '5.6 Produkttests und Umgebungsmonitoring', 
    title: 'Auswertung von Untersuchungsergebnissen', 
    description: '5.6.5 Untersuchungsergebnisse werden unverzüglich durch kompetentes Personal ausgewertet. Bei unbefriedigenden Ergebnissen werden unverzüglich Korrekturen durchgeführt. Auf der Grundlage von Risiken und rechtlichen Anforderungen ist festgelegt, wie häufig die Test- und Überwachungsergebnisse kontrolliert werden, um Trends zu ermitteln. Werden unbefriedigende Trends festgestellt, sind die Auswirkungen auf Prozesse und Produkte sowie die Notwendigkeit von Maßnahmen zu bewerten.', 
    isKO: false 
  },
  { 
    id: '5.6.6', 
    chapter: 5, 
    subChapter: '5.6 Produkttests und Umgebungsmonitoring', 
    title: 'Durchführung interner Analysen', 
    description: '5.6.6 Sofern interne Analysen oder Prüfungen durchgeführt werden, sind diese nach festgelegten Verfahren in festgelegten Bereichen oder Laboratorien von kompetentem und zugelassenem Personal unter Verwendung geeigneter Ausrüstung durchgeführt.', 
    isKO: false 
  },
  { 
    id: '5.6.7', 
    chapter: 5, 
    subChapter: '5.6 Produkttests und Umgebungsmonitoring', 
    title: 'Sensorische Prüfungen', 
    description: '5.6.7 Zur Überwachung der Endproduktqualität werden betriebsintern sensorische Prüfungen durchgeführt. Diese Prüfungen erfolgen in Übereinstimmung mit der Spezifikation und berücksichtigen den Einfluss entsprechender Parameter auf die Produktmerkmale. Die Ergebnisse dieser Untersuchungen werden dokumentiert.', 
    isKO: false 
  },
  { 
    id: '5.6.8', 
    chapter: 5, 
    subChapter: '5.6 Produkttests und Umgebungsmonitoring', 
    title: 'Überprüfung des Überwachungsplans', 
    description: '5.6.8 Der Test- und Überwachungsplan wird regelmäßig kontrolliert und auf Grundlage der Ergebnisse, Gesetzesänderungen oder Gegebenheiten, die sich negativ auf die Produktsicherheit, -qualität, -legalität und -authentizität auswirken können, aktualisiert.', 
    isKO: false 
  },

  { 
    id: '5.7.1', 
    chapter: 5, 
    subChapter: '5.7 Produktfreigabe', 
    title: 'Quarantäne- und Freigabeverfahren', 
    description: '5.7.1* Ein Quarantäneverfahren (Sperren/Zurückhalten) ist dokumentiert, umgesetzt und aufrechtzuerhalten, um sicherzustellen, dass ausschließlich Rohwaren, Zwischenprodukte und Endprodukte sowie Verpackungsmaterialien verarbeitet und geliefert werden, welche die Anforderungen an Lebensmittelsicherheit, Produktqualität, -legalität, -authentizität und Kundenanforderungen erfüllen.', 
    isKO: false 
  },

  { 
    id: '5.8.1', 
    chapter: 5, 
    subChapter: '5.8 Umgang mit Beanstandungen/Reklamationen von Behörden und Kunden', 
    title: 'Verfahren für Produktbeanstandungen', 
    description: '5.8.1* Ein Verfahren zum Umgang mit Produktbeanstandungen und schriftlichen behördlichen Beanstandungen – im Rahmen der amtlichen Kontrollen – und zu allen angeordneten Handlungen oder Maßnahmen im Falle einer Nichtkonformität, ist dokumentiert, umgesetzt und aufrechtzuerhalten.', 
    isKO: false 
  },
  { 
    id: '5.8.2', 
    chapter: 5, 
    subChapter: '5.8 Umgang mit Beanstandungen/Reklamationen von Behörden und Kunden', 
    title: 'Aufzeichnung und Bewertung von Reklamationen', 
    description: '5.8.2* Alle Beanstandungen / Reklamationen werden aufgezeichnet, sind jederzeit verfügbar und durch fachkundiges Personal bewertet. Falls nötig, werden unverzüglich Maßnahmen durchgeführt.', 
    isKO: false 
  },
  { 
    id: '5.8.3', 
    chapter: 5, 
    subChapter: '5.8 Umgang mit Beanstandungen/Reklamationen von Behörden und Kunden', 
    title: 'Vermeidung von Wiederholungsfehlern', 
    description: '5.8.3 Beanstandungen / Reklamationen werden ausgewertet, um Maßnahmen umzusetzen, die das Wiederauftreten der Abweichungen/Nichtkonformitäten verhindern.', 
    isKO: false 
  },
  { 
    id: '5.8.4', 
    chapter: 5, 
    subChapter: '5.8 Umgang mit Beanstandungen/Reklamationen von Behörden und Kunden', 
    title: 'Kommunikation der Reklamationsauswertung', 
    description: '5.8.4 Die Reklamationsauswertung wird den entsprechenden Verantwortlichen zur Verfügung gestellt.', 
    isKO: false 
  },

  { 
    id: '5.9.1', 
    chapter: 5, 
    subChapter: '5.9 Umgang mit Produktrückrufen, Produktrücknahmen und Vorfällen', 
    title: 'KO Nr. 9: Verfahren für Rückrufe und Notfälle', 
    description: '5.9.1* KO Nr. 9: Für den Umgang mit Rückrufen, Rücknahmen, Zwischenfällen und potenziellen Notfällen, die sich auf die Lebensmittelsicherheit, die Produktqualität, -legalität und -authentizität auswirken, ist ein wirksames Verfahren dokumentiert, umgesetzt und aufrechtzuerhalten. Dieses beinhaltet mindestens: die Zuweisung von Verantwortlichkeiten, die Schulung der verantwortlichen Personen, den Entscheidungsfindungsprozess, die Benennung einer Person durch das Unternehmen, die permanent erreichbar ist und die Befugnis hat, den erforderlichen Prozess zeitnah einzuleiten, eine aktuelle Notrufnummernliste, die Kundeninformationen, juristische Beratung und Erreichbarkeiten einschließt, einen Kommunikationsplan, der Kunden, Behörden und gegebenenfalls Verbraucher einbezieht.', 
    isKO: true 
  },
  { 
    id: '5.9.2', 
    chapter: 5, 
    subChapter: '5.9 Umgang mit Produktrückrufen, Produktrücknahmen und Vorfällen', 
    title: 'Test des Rückrufverfahrens', 
    description: '5.9.2* Das Verfahren für den Rückruf/Rücknahme ist intern zu testen, wobei der gesamte Prozess abgedeckt wird. Diese Maßnahme wird innerhalb eines Zeitraums von 12 Monaten geplant und ihre Ausführung darf 15 Monate nicht überschreiten. Das Ergebnis des Tests ist im Hinblick auf eine kontinuierliche Verbesserung zu überprüfen.', 
    isKO: false 
  },

  { 
    id: '5.10.1', 
    chapter: 5, 
    subChapter: '5.10 Umgang mit nichtkonformen Produkten', 
    title: 'Verfahren für nichtkonforme Produkte', 
    description: '5.10.1* Es ist ein Verfahren für die Handhabung aller nichtkonformer Rohwaren, Zwischen- und Endprodukte, Hilfsmittel und Verpackungsmaterialien dokumentiert, umgesetzt und aufrechtzuerhalten. Dies beinhaltet mindestens: definierte Verantwortlichkeiten, die Isolierung / das Sperrverfahren, Risikobewertung, die Identifikation inklusive Kennzeichnung, die Entscheidung über die weitere Verwendung, z. B.: Freigabe, Nachbearbeitung / Wiederaufbereitung, Sperrung, Quarantäne, Rückweisung / Entsorgung.', 
    isKO: false 
  },
  { 
    id: '5.10.2', 
    chapter: 5, 
    subChapter: '5.10 Umgang mit nichtkonformen Produkten', 
    title: 'Anwendung des Sperrverfahrens', 
    description: '5.10.2 Das Verfahren zum Umgang mit nichtkonformen Produkten ist von allen betroffenen Mitarbeitern verstanden und wird angewendet.', 
    isKO: false 
  },
  { 
    id: '5.10.3', 
    chapter: 5, 
    subChapter: '5.10 Umgang mit nichtkonformen Produkten', 
    title: 'Maßnahmen bei Nichtkonformität', 
    description: '5.10.3 Werden nichtkonforme Produkte erkannt, sind schnellstmöglich Maßnahmen durchzuführen, um die Einhaltung der Lebensmittelsicherheits- und Produktqualitätsanforderungen zu gewährleisten.', 
    isKO: false 
  },
  { 
    id: '5.10.4', 
    chapter: 5, 
    subChapter: '5.10 Umgang mit nichtkonformen Produkten', 
    title: 'Inverkehrbringen bei Label-Abweichungen', 
    description: '5.10.4 Entsprechen bereits verpackte Endprodukte nicht den Spezifikationen, dürfen diese nicht unter dem betreffenden Label in den Verkehr gebracht werden, es sei denn, es liegt eine schriftliche Genehmigung des Markeninhabers vor.', 
    isKO: false 
  },

  { 
    id: '5.11.1', 
    chapter: 5, 
    subChapter: '5.11 Umgang mit Abweichungen, Nichtkonformitäten, Korrekturen und Korrekturmaßnahmen', 
    title: 'Verfahren für Korrekturmaßnahmen', 
    description: '5.11.1* Ein Verfahren für den Umgang mit Korrekturen und Korrekturmaßnahmen ist dokumentiert, umgesetzt und aufrechtzuerhalten, um Abweichungen, Nichtkonformitäten und nichtkonforme Produkte zu erfassen, zu analysieren und den relevanten Personen mitzuteilen. Das Ziel ist es, die Abweichungen und/oder Nichtkonformitäten zu schließen und Wiederholungen durch Korrekturmaßnahmen zu vermeiden. Dies beinhaltet eine Ursachenanalyse, zumindest für Abweichungen und Nichtkonformitäten bezüglich Sicherheit, Legalität, Authentizität und/oder bei Wiederholung von Abweichungen und Nichtkonformitäten.', 
    isKO: false 
  },
  { 
    id: '5.11.2', 
    chapter: 5, 
    subChapter: '5.11 Umgang mit Abweichungen, Nichtkonformitäten, Korrekturen und Korrekturmaßnahmen', 
    title: 'Umsetzung von Korrekturen', 
    description: '5.11.2 Werden Abweichungen und Nichtkonformitäten festgestellt, sind Korrekturen umzusetzen.', 
    isKO: false 
  },
  { 
    id: '5.11.3', 
    chapter: 5, 
    subChapter: '5.11 Umgang mit Abweichungen, Nichtkonformitäten, Korrekturen und Korrekturmaßnahmen', 
    title: 'KO Nr. 10: Umsetzung von Korrekturmaßnahmen', 
    description: '5.11.3* KO Nr. 10: Korrekturmaßnahmen werden formuliert, dokumentiert und schnellstmöglich umgesetzt, um ein erneutes Auftreten der Abweichungen und Nichtkonformitäten zu vermeiden. Die Verantwortlichkeiten und die zeitnahen Fristen für die Korrekturmaßnahmen sind definiert.', 
    isKO: true 
  },
  { 
    id: '5.11.4', 
    chapter: 5, 
    subChapter: '5.11 Umgang mit Abweichungen, Nichtkonformitäten, Korrekturen und Korrekturmaßnahmen', 
    title: 'Bewertung der Wirksamkeit', 
    description: '5.11.4 Die Wirksamkeit der eingeleiteten Korrekturen und Korrekturmaßnahmen wird bewertet und die Ergebnisse der Bewertung dokumentiert.', 
    isKO: false 
  }
];
