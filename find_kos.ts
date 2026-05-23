
import { MOCK_REQUIREMENTS } from './src/mockData';

const officialTitles = MOCK_REQUIREMENTS.filter(req => req.title.includes('KO'));
officialTitles.forEach(req => {
  if (!req.isKO) {
    console.log(`MISSING KO FLAG: ${req.id} - ${req.title}`);
  } else {
    console.log(`OFFICIAL KO OK: ${req.id} - ${req.title}`);
  }
});

const nonOfficialKOs = MOCK_REQUIREMENTS.filter(req => req.isKO && !req.title.includes('KO'));
console.log(`\nTo be removed from KO list (${nonOfficialKOs.length}):`);
nonOfficialKOs.forEach(req => console.log(req.id));
