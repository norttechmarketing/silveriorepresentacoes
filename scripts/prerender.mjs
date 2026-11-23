import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

// Substitui o conteúdo da raiz, mesmo se o HTML já tiver sido pré-renderizado.
// O contador preserva as divs aninhadas e os scripts fora da raiz.
export function injectRoot(template, markup) {
  const opening = /<div\b[^>]*\bid\s*=\s*(["'])root\1[^>]*>/i.exec(template);
  if (!opening) throw new Error('Elemento #root ausente em dist/index.html.');
  const contentStart = opening.index + opening[0].length;
  const tags = /<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script\s*>|<style\b[^>]*>[\s\S]*?<\/style\s*>|<\/?div\b[^>]*>/gi;
  tags.lastIndex = contentStart;
  let depth = 1;
  let token;
  while ((token = tags.exec(template))) {
    if (!/^<\/?div\b/i.test(token[0])) continue;
    depth += /^<\/div\b/i.test(token[0]) ? -1 : 1;
    if (depth === 0) {
      return template.slice(0, contentStart) + markup + template.slice(token.index);
    }
  }
  throw new Error('Elemento #root sem fechamento em dist/index.html.');
}

async function main() {
  const [{ createElement }, { renderToString }, { App }] = await Promise.all([
    import('react'), import('react-dom/server'), import('../.router-ssr/src.js'),
  ]);
  const path = new URL('../dist/index.html', import.meta.url);
  const template = await readFile(path, 'utf8');
  await writeFile(path, injectRoot(template, renderToString(createElement(App))), 'utf8');
  console.log('Pré-renderização concluída.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
