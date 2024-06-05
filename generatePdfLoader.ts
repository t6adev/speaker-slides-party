import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const infoSchema = z.object({
  title: z.string(),
  speaker: z.object({
    name: z.string(),
    description: z.string(),
    imageUrl: z.union([z.string().url(), z.literal('')]),
    links: z.array(z.string().url()),
  }),
  appendixLinks: z.array(z.string().url()),
});

const pdfsDir = path.join(__dirname, 'pdfs');

const directories = fs
  .readdirSync(pdfsDir)
  .filter((file) => fs.statSync(path.join(pdfsDir, file)).isDirectory());

const imports: string[] = [];
const pdfEntries: string[] = [];

directories.forEach((dir, index) => {
  const infoPath = path.join(pdfsDir, dir, 'info.json');
  const pdfPath = path.join(pdfsDir, dir, 'presentation.pdf');

  if (!fs.existsSync(infoPath)) {
    throw new Error(`Missing info.json in directory ${dir}`);
  }

  if (!fs.existsSync(pdfPath)) {
    throw new Error(`Missing presentation.pdf in directory ${dir}`);
  }

  const infoData = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
  try {
    infoSchema.parse(infoData);
  } catch (e) {
    throw new Error(`Invalid info.json in directory ${dir}: ${e}`);
  }

  imports.push(`import f${index} from './${dir}/info.json';`);
  imports.push(`import p${index} from './${dir}/presentation.pdf';`);
  pdfEntries.push(`  { file: p${index}, info: f${index} }`);
});

const loaderContent = `
${imports.join('\n')}

export const pdfs = [
${pdfEntries.join(',\n')}
];
`;

fs.writeFileSync(path.join(pdfsDir, 'loader.ts'), loaderContent.trim());

console.log('loader.ts has been generated successfully.');
