
import fs from 'fs';

const idsToRemove = [
  '4.10.1', '4.10.4', '4.10.5', '4.11.1', '4.13.2', '4.14.1', '4.14.2', '4.14.5',
  '4.15.1', '4.16.1', '4.17.1', '4.18.2', '4.19.2', '4.20.2', '4.20.4', '4.21.2',
  '5.2.1', '5.3.3', '5.4.1', '5.4.2', '5.5.1', '5.5.2', '5.6.1', '5.6.2', '5.6.3',
  '5.7.1', '5.8.1', '5.8.2', '5.9.2', '5.10.1', '5.11.1'
];

let content = fs.readFileSync('./src/mockData.ts', 'utf8');

for (const id of idsToRemove) {
  // Use a more specific regex to avoid over-matching
  // Matches the id, some properties, and then isKO: true
  // Note: We need to handle the structure correctly.
  
  // Find the block starting with id: 'ID' and ending with isKO: true
  // This is tricky with regex across multiple lines.
  
  // Let's try splitting by '{' and '}' if they are top-level objects in the array.
  // Actually, the blocks look like:
  /*
  { 
    id: '4.10.1', 
    ...
    isKO: true 
  },
  */
  
  const regex = new RegExp(`(id:\\s*'${id.replace(/\./g, '\\.')}',[\\s\\S]*?isKO:)\\s*true`, 'g');
  if (regex.test(content)) {
    console.log(`Found and updating ID: ${id}`);
    content = content.replace(regex, '$1 false');
  } else {
    console.log(`COULD NOT FIND ID: ${id}`);
  }
}

fs.writeFileSync('./src/mockData.ts', content);
console.log('Update complete.');
