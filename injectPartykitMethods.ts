import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const inject = async () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const tsFilePath = path.resolve(__dirname, 'partykitMethods.ts');

  const methods = await import(tsFilePath);

  const filePath = path.resolve(__dirname, 'dist', 'serve.js');

  let code = fs.readFileSync(filePath, 'utf-8');

  const exportPattern = /};\s*export\s*\{\s*servePartykit\s*as\s*default\s*\}\s*;\s*$/;

  const codeWithoutExport = code.replace(exportPattern, '');

  function getMethodString(methodName: string): string {
    const method = methods[methodName].toString();
    const methodBody = method.slice(method.indexOf('{') + 1, method.lastIndexOf('}')).trim();
    return `
  ${methodName}(${method.substring(method.indexOf('(') + 1, method.indexOf(')'))}) {
    ${methodBody}
  }`;
  }

  function addMethods(code: string): string {
    const methodNames = Object.keys(methods);
    let methodStrings = '';
    methodNames.forEach((methodName) => {
      methodStrings += getMethodString(methodName) + ',';
    });

    return code.replace(/(const servePartykit = \{)([\s\S]*?)/, `$1$2${methodStrings}`);
  }

  let updatedCode = addMethods(codeWithoutExport);

  updatedCode += '};\nexport { servePartykit as default };';

  fs.writeFileSync(filePath, updatedCode, 'utf-8');
};

inject();
