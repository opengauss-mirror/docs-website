import { createWriteStream, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { VITEPRESS_VERSIONS_CONFIG } from './config/version.js';

const packageConfig = JSON.parse(readFileSync(join(import.meta.dirname, '../package.json'), 'utf-8'));
if (!packageConfig.scripts.build.includes('common')) {
  process.exit(0);
}

const versions = Object.values(VITEPRESS_VERSIONS_CONFIG).filter((ver) => ver !== 'common');

// ============ write llms.txt
async function writeLLMsTxt() {
  const llmstxtPath = join(import.meta.dirname, '../app/.vitepress/dist/llms.txt');
  if (!existsSync(llmstxtPath)) {
    console.log(`❌ llms.txt不存在`);
    return;
  }
  const llmsWriteStream = createWriteStream(llmstxtPath, { flags: 'a' });
  for (const ver of versions) {
    try {
      const resp = await fetch(`https://docs.opengauss.org/docs/${ver}/llms.txt`);
      if (!resp.ok || !resp.body) {
        console.log(`❌ ${ver} llms.txt无法访问！！`);
        continue;
      }
      console.log(`开始拼接 ${ver} llms.txt`);
      llmsWriteStream.write('\n');
  
      let isFirstChunk = true;
      for await (let chunk of resp.body.pipeThrough(new TextDecoderStream())) {
        if (isFirstChunk) {
          isFirstChunk = false;
          if (chunk.startsWith('<!DOCTYPE html>')) {
            break;
          }
          const index = chunk.indexOf('## Table of Contents');
          if (index >= 0) {
            chunk = chunk.slice(index).replace('Table of Contents', `${ver} documents`);
          }
        }
        const ok = llmsWriteStream.write(chunk);
        if (!ok) {
          await new Promise((resolve) => llmsWriteStream.once('drain', () => resolve()));
        }
      }
      console.log(`✅ ${ver} llms.txt 拼接完成`);
    } catch {
      console.log(`❌ ${ver} llms.txt 拼接失败`);
    }
  }
  llmsWriteStream.end(() => console.log('llms.txt拼接完成'));
}

async function writeLLMsFullTxt() {
  // ============ write llms-full.txt
  const llmsfulltxtPath = join(import.meta.dirname, '../app/.vitepress/dist/llms-full.txt');
  if (!existsSync(llmsfulltxtPath)) {
    console.log(`❌ llms-full.txt不存在`);
    return;
  }
  const llmsFullWriteStream = createWriteStream(llmsfulltxtPath, { flags: 'a' });
  for (const ver of versions) {
    try {
      const resp = await fetch(`https://docs.opengauss.org/docs/${ver}/llms-full.txt`);
      if (!resp.ok || !resp.body) {
        console.log(`❌ ${ver} llms-full.txt无法访问！！`);
        continue;
      }
      console.log(`开始拼接 ${ver} llms-full.txt`);
      llmsFullWriteStream.write('\n');

      let isFirstChunk = true;
      for await (const chunk of resp.body.pipeThrough(new TextDecoderStream())) {
        if (isFirstChunk) {
          isFirstChunk = false;
          if (chunk.startsWith('<!DOCTYPE html>')) {
            break;
          }
        }
        const ok = llmsFullWriteStream.write(chunk);
        if (!ok) {
          await new Promise(resolve => llmsFullWriteStream.once('drain', resolve()));
        }
      }
      console.log(`✅ ${ver} llms-full.txt 拼接完成`);
    } catch {
      console.log(`❌ ${ver} llms-full.txt 拼接失败`);
    }
  }
  llmsFullWriteStream.end(() => console.log('llms-full.txt拼接完成'));
}

writeLLMsTxt();
writeLLMsFullTxt();
