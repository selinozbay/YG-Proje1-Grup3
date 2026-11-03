// Ekip üyelerinin katkı tablosunu (hocanın P1-19 maddesi, #65) GitHub'dan üretir.
// Kullanım (gh CLI ile GitHub'a giriş yapmış olmak gerekir):
//   node scripts/katki-tablosu.mjs > docs/katki-tablosu.md && npx prettier --write docs/katki-tablosu.md
// Teslimden önce, bütün PR'lar birleştikten sonra yeniden çalıştırın.

import { execFileSync } from 'node:child_process'

const REPO = 'selinozbay/YG-Proje1-Grup3'
const URL = `https://github.com/${REPO}`
const MILESTONE = 'Teslim (11 Kasım 2026)'

const MEMBERS = [
  { login: 'selinozbay', name: 'Selin Özbay', role: 'Lider + Geliştirici' },
  { login: 'C1H4N', name: 'Cihan Bayram', role: 'Analist + Geliştirici' },
  { login: 'rumeyus', name: 'Tahir Taş', role: 'Test / Kalite + Geliştirici' },
  { login: 'alitekce2005', name: 'Ali Tekçe', role: 'Dokümantasyon / Sunum + Geliştirici' },
]

const gh = (...args) =>
  JSON.parse(execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }))

const issues = gh(
  'issue',
  'list',
  '--repo',
  REPO,
  '--state',
  'all',
  '--limit',
  '500',
  '--json',
  'number,title,state,assignees,milestone',
)
const prs = gh(
  'pr',
  'list',
  '--repo',
  REPO,
  '--state',
  'all',
  '--limit',
  '500',
  '--json',
  'number,title,state,author,closingIssuesReferences',
)
// main'deki birleştirme dışı commitler; e-postası GitHub hesabına bağlı olanlar hesaba yazılır.
const commits = gh('api', `repos/${REPO}/commits?sha=main&per_page=100`, '--paginate', '--slurp')
  .flat()
  .filter((commit) => commit.parents.length === 1)

const issueLink = (n) => `[#${n}](${URL}/issues/${n})`
const prLink = (n) => `[#${n}](${URL}/pull/${n})`
const escape = (text) => text.replaceAll('|', '\\|')
const byNumber = (a, b) => a.number - b.number

const stats = MEMBERS.map((member) => {
  const assigned = issues.filter((i) => i.assignees.some((a) => a.login === member.login))
  const own = prs.filter((p) => p.author.login === member.login)
  return {
    ...member,
    assigned: assigned.sort(byNumber),
    closed: assigned.filter((i) => i.state === 'CLOSED'),
    merged: own.filter((p) => p.state === 'MERGED').sort(byNumber),
    open: own.filter((p) => p.state === 'OPEN').sort(byNumber),
    commits: commits.filter((c) => c.author?.login === member.login).length,
  }
})

const today = new Date().toLocaleDateString('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const out = []
const line = (text = '') => out.push(text)

line('# Ekip Katkı Tablosu')
line()
line(
  `Hocanın takip listesindeki **P1-19** maddesi ("Her üyenin kod katkısını ve issue kayıtlarını kontrol etme", [#65](${URL}/issues/65)). ` +
    `Tablo GitHub'dan \`scripts/katki-tablosu.mjs\` ile üretildi; elle düzenlenmez. Oluşturulma tarihi: **${today}**.`,
)
line()
line('## Özet')
line()
line(
  "| Üye | GitHub | Rol | Atanan issue (kapanan / toplam) | Birleşen PR | Açık PR | `main`'deki commit |",
)
line('| --- | --- | --- | --- | --- | --- | --- |')
for (const s of stats) {
  line(
    `| ${s.name} | [@${s.login}](https://github.com/${s.login}) | ${s.role} | ${s.closed.length} / ${s.assigned.length} | ${s.merged.length} | ${s.open.length} | [${s.commits}](${URL}/commits/main?author=${s.login}) |`,
  )
}
line()
line(
  "Commit sayısı birleştirme (merge) commitlerini saymaz. Bir PR'ı birleştiren kişi değil, PR'ı açan kişi yazılır.",
)

for (const s of stats) {
  line()
  line(`## ${s.name} (@${s.login})`)
  line()
  line("**Birleşen PR'lar**")
  line()
  if (!s.merged.length) line('- Henüz yok')
  for (const p of s.merged) {
    const closes = p.closingIssuesReferences.map((i) => issueLink(i.number)).join(', ')
    line(`- ${prLink(p.number)} ${escape(p.title)}${closes ? ` → kapattığı issue: ${closes}` : ''}`)
  }
  if (s.open.length) {
    line()
    line(`**Açık PR'lar:** ${s.open.map((p) => prLink(p.number)).join(', ')}`)
  }
  line()
  line(
    `**Atanan issue'lar:** ${s.assigned.map((i) => `${issueLink(i.number)}${i.state === 'CLOSED' ? ' ✅' : ''}`).join(', ') || 'yok'}`,
  )
}

// Hocanın kontrol ettiği maddeler (#65 kabul kriterleri).
const milestoneIssues = issues.filter((i) => i.milestone?.title === MILESTONE)
const unassigned = milestoneIssues.filter((i) => i.assignees.length === 0)
const unlinked = prs.filter((p) => p.state === 'MERGED' && p.closingIssuesReferences.length === 0)
const noMergedPr = stats.filter((s) => s.merged.length === 0)

line()
line('## Kontroller')
line()
line(
  `- Milestone'daki sorumlusu olmayan issue: ${unassigned.length ? unassigned.map((i) => issueLink(i.number)).join(', ') : 'yok ✅'}`,
)
line(
  `- Kendi hesabından birleşmiş PR'ı olmayan üye: ${noMergedPr.length ? noMergedPr.map((s) => s.name).join(', ') : 'yok ✅'}`,
)
line(
  `- Bir issue'yu kapatmayan (\`Closes #N\` içermeyen) birleşmiş PR: ${unlinked.length ? unlinked.map((p) => `${prLink(p.number)} ${escape(p.title)}`).join('; ') : 'yok ✅'}`,
)

process.stdout.write(out.join('\n') + '\n')
