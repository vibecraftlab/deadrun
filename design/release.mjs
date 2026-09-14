// DEADRUN 디자인 캔버스 릴리스 파이프라인
//   node release.mjs            빌드 → 조립 → 검증
//   node release.mjs --check    검증만
//
// 게시(Artifact 도구)는 이 스크립트가 하지 않는다. 마지막에 출력되는
// 파일 경로와 URL을 그대로 Artifact 도구에 넘기면 된다.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = 'deadrun-screens-and-characters.html';
const TITLE = 'DEADRUN 화면과 캐릭터';
const ARTIFACT_URL = 'https://claude.ai/code/artifact/e1f4e359-886b-4836-8fac-55eb4cc7746f';

/** design 스킬 번들에서 seed-canvas.mjs와 payload를 찾는다. 버전 폴더명은 매번 바뀐다. */
function findSkill() {
  const roots = [
    join(process.env.LOCALAPPDATA || '', 'Temp', 'claude', 'bundled-skills'),
    join(process.env.TEMP || '', 'claude', 'bundled-skills'),
  ].filter(p => p && existsSync(p));

  const hits = [];
  const walk = (dir, depth) => {
    if (depth > 3) return;
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const p = join(dir, e.name);
      if (e.name === 'design' && existsSync(join(p, 'seed-canvas.mjs'))) hits.push(p);
      else walk(p, depth + 1);
    }
  };
  for (const r of roots) walk(r, 0);

  if (hits.length === 0) {
    throw new Error(
      'design 스킬 번들을 찾지 못했습니다. 세션에서 /design 을 한 번 실행해 번들을 다시 풀어주세요.');
  }
  hits.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return hits[0];
}

const run = (args) => {
  const out = execFileSync(process.execPath, args, { cwd: HERE, encoding: 'utf8', stdio: 'pipe' });
  process.stdout.write(out);
  return out;
};

const skill = findSkill();
const seed = join(skill, 'seed-canvas.mjs');
const payload = join(skill, 'payload.template.html');
const checkOnly = process.argv.includes('--check');

if (!checkOnly) {
  console.log('── 1/3 아트보드 빌드 (픽셀맵은 zombieSprites.ts에서 직접 읽음)');
  run([join(HERE, 'build.mjs')]);

  const canvas = JSON.parse(readFileSync(join(HERE, 'canvas.json'), 'utf8'));
  const files = canvas.artboards.map(a => a.file);
  if (!files.includes('Main.dc.html')) {
    throw new Error('canvas.json에 Main.dc.html이 없습니다 — 진입 아트보드는 반드시 Main이어야 합니다.');
  }
  for (const f of files) {
    if (!existsSync(join(HERE, f))) throw new Error(`canvas.json이 가리키는 ${f} 가 빌드되지 않았습니다.`);
  }

  console.log('\n── 2/3 캔버스 조립');
  // Main을 맨 앞에 둬야 진입 아트보드가 된다.
  const ordered = ['Main.dc.html', ...files.filter(f => f !== 'Main.dc.html')];
  run([seed, '--template', payload, '--out', OUT, '--title', TITLE,
    ...ordered.flatMap(f => ['--artboard', f]), '--canvas', 'canvas.json']);
}

console.log('\n── 3/3 검증');
run([seed, '--check', OUT]);

console.log(`
── 다음 단계: Artifact 도구로 게시
   file_path : ${join(HERE, OUT)}
   url       : ${ARTIFACT_URL}
   contract  : 0.1.31
   favicon   : 🧟
   capabilities 는 넘기지 않는다 (기존 선언을 그대로 이어받는다)`);
