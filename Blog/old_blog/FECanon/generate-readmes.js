const fs = require('fs');
const path = require('path');
const cp = require('child_process');

// 参数解析：支持 --lint 开关；其余为根目录
const argv = process.argv.slice(2);
const LINT = argv.includes('--lint');
const ROOTS = argv.filter(a => a !== '--lint');
if (ROOTS.length === 0) ROOTS.push('笔记');
// 仅收录的文件后缀
const INCLUDE_EXTS = new Set(['.ts']);

function readDirSafe(dir) {
  try { return fs.readdirSync(dir, { withFileTypes: true }); } catch { return []; }
}

function writeFile(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, 'utf8');
}

function buildReadme(dir) {
  const items = readDirSafe(dir);
  const subDirs = items.filter(d => d.isDirectory()).map(d => d.name).sort();
  const files = items.filter(f => f.isFile()).map(f => f.name).sort();

  // 仅纳入 .ts 文件；忽略本 README
  const filesFiltered = files.filter(n => n !== 'README.md' && INCLUDE_EXTS.has(path.extname(n)));

  const title = `# 索引 - ${path.basename(dir)}`;
  const lines = [title, ''];

  if (subDirs.length) {
    lines.push('## 子目录');
    for (const d of subDirs) {
      // 子目录直接链接到该子目录下的 README.md（不做 URI 编码，保留中文）
      lines.push(`- [${d}](./${d}/README.md)`);
    }
    lines.push('');
  }
  if (filesFiltered.length) {
    lines.push('## 文件');
    for (const f of filesFiltered) {
      // 文件保持为相对路径，直接使用原文件名（不做 URI 编码）
      const base = path.basename(f, path.extname(f));
      lines.push(`- [${base}](./${f})`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function updateReadme(dir) {
  const readmePath = path.join(dir, 'README.md');
  const content = buildReadme(dir);
  let finalContent = content;
  if (fs.existsSync(readmePath)) {
    const prev = fs.readFileSync(readmePath, 'utf8');
    const marker = '<!-- AUTO-GENERATED START -->';
    if (prev.includes(marker)) finalContent = prev.split(marker)[0] + marker + '\n' + content;
  }
  writeFile(readmePath, finalContent);
}

function walkAndGenerate(root) {
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    updateReadme(current);
    for (const e of readDirSafe(current)) if (e.isDirectory()) stack.push(path.join(current, e.name));
  }
}

for (const r of ROOTS) walkAndGenerate(path.resolve(r));

if (LINT) {
  try {
    // 使用 markdownlint-cli 对目标根目录下的所有 README.md 进行修复
    const targets = ROOTS.map(r => path.resolve(r)).join(' ');
    const cmd = `npx --yes markdownlint "${targets.replace(/"/g, '"')}\\**\\README.md" --fix`;
    cp.execSync(cmd, { stdio: 'inherit', shell: true });
  } catch (err) {
    console.warn('[WARN] markdownlint 执行失败：', err.message);
    console.warn('请先安装: npm i -D markdownlint markdownlint-cli');
  }
}

console.log('README 生成完成');
