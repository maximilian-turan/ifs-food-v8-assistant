
import { MOCK_REQUIREMENTS } from './src/mockData';
import { STATIC_INTERPRETATIONS } from './src/interpretations';

const requirementIds = MOCK_REQUIREMENTS.map(req => req.id);
const interpretationIds = Object.keys(STATIC_INTERPRETATIONS);

const missing = requirementIds.filter(id => !interpretationIds.includes(id));

console.log('Missing Interpretations:', missing.length);
if (missing.length > 0) {
  console.log(missing.join(', '));
} else {
  console.log('No missing interpretations found!');
}
