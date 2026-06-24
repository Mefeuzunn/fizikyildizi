const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/**/\\[*\\*/*.tsx');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('generateStaticParams')) {
    let toAppend = '';
    if (file.includes('[id]')) {
      toAppend = `\nexport function generateStaticParams() { return [{ id: '1' }]; }\n`;
    } else if (file.includes('[slug]')) {
      toAppend = `\nexport function generateStaticParams() { return [{ slug: '1' }]; }\n`;
    } else if (file.includes('[...notfound]')) {
      toAppend = `\nexport function generateStaticParams() { return [{ notfound: ['1'] }]; }\n`;
    }
    
    if (toAppend) {
      fs.appendFileSync(file, toAppend);
      console.log('Appended to', file);
    }
  }
});
