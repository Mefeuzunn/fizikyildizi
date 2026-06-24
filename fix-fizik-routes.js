const fs = require('fs');
const path = require('path');

const routes = [
  'src/app/fizik-yildizi/ogretmen/ogrenci/[id]',
  'src/app/fizik-yildizi/[...notfound]',
  'src/app/fizik-yildizi/ogrenci/test/[slug]',
  'src/app/fizik-yildizi/ogrenci/konu/[slug]'
];

routes.forEach(dir => {
  const pagePath = path.join(dir, 'page.tsx');
  const clientPath = path.join(dir, 'ClientPage.tsx');
  
  if (fs.existsSync(pagePath) && !fs.existsSync(clientPath)) {
    // Move page.tsx to ClientPage.tsx
    fs.renameSync(pagePath, clientPath);
    
    // Determine the param name
    const paramMatch = dir.match(/\[(\.\.\.)?([a-zA-Z]+)\]/);
    const paramName = paramMatch[2]; // id, notfound, or slug
    const isCatchAll = !!paramMatch[1];
    
    let genParams = '';
    if (paramName === 'id') {
      genParams = `export function generateStaticParams() { return [{ id: '1' }, { id: '2' }]; }`;
    } else if (paramName === 'slug') {
      genParams = `export function generateStaticParams() { return [{ slug: 'fizik-bilimi-9' }, { slug: 'madde-ozellikleri-9' }, { slug: 'kuvvet-hareket-9' }, { slug: 'enerji-9' }, { slug: 'isi-sicaklik-9' }, { slug: 'elektrostatik-9' }, { slug: 'basinc-10' }]; }`;
    } else if (paramName === 'notfound') {
      genParams = `export function generateStaticParams() { return [{ notfound: ['1'] }]; }`;
    }
    
    // Create new page.tsx Server Component
    const newPageContent = `
import ClientPage from './ClientPage';

${genParams}

export default function Page() {
  return <ClientPage />;
}
`;
    fs.writeFileSync(pagePath, newPageContent);
    console.log('Processed', dir);
  }
});
