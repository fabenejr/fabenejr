// Renders assets/steam.svg from the portfolio's own /api/steam endpoint.
// Falls back to the last committed data/steam.json when the API is unavailable.
import { readFile, writeFile } from "node:fs/promises"

const SOURCE = process.env.STEAM_SUMMARY_URL ?? "https://paulofabene.vercel.app/api/steam"
const CACHE = new URL("../data/steam.json", import.meta.url)
const OUT = new URL("../assets/steam.svg", import.meta.url)

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c])
const num = (n, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d })
const compact = (n) => (n >= 1000 ? `${num(n / 1000)} mil` : num(n, 0))
const wrap = (s, n) => {
  if (s.length <= n) return [s, ""]
  const cut = s.lastIndexOf(" ", n)
  return [s.slice(0, cut), s.slice(cut + 1)]
}
const trunc = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)

async function load() {
  try {
    const res = await fetch(SOURCE, { signal: AbortSignal.timeout(20_000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (!data.library?.topGames?.length) throw new Error("empty library")
    await writeFile(CACHE, `${JSON.stringify(data, null, 2)}\n`)
    return data
  } catch (error) {
    console.warn(`Using cached data/steam.json (${error.message})`)
    return JSON.parse(await readFile(CACHE, "utf8"))
  }
}

function render({ profile, library, recent }) {
  const since = profile.memberSince ? new Date(profile.memberSince).getUTCFullYear() : null
  const top = library.topGames
  const max = top[0].hours
  const share = Math.round((top[0].hours / library.totalHours) * 100)
  const playedPct = Math.round((library.playedCount / library.gameCount) * 100)
  const status = profile.currentGame ? `Jogando ${profile.currentGame}` : profile.online ? "Online" : "Offline"
  const dot = profile.online || profile.currentGame ? "#3fb950" : "#6e7681"

  const tiles = [
    ["Jogos", num(library.gameCount, 0)],
    ["Horas jogadas", compact(library.totalHours)],
    ["Jogos jogados", num(library.playedCount, 0)],
    ["Horas, últimas 2 semanas", num(recent.totalHours)],
  ]
    .map(([label, value], i) => {
      const x = 24 + i * 211
      return `<rect x="${x}" y="84" width="199" height="72" rx="10" fill="#0d1117" stroke="#1f3a3d"/>
  <text x="${x + 16}" y="108" font-size="12" fill="#8b949e">${esc(label)}</text>
  <text x="${x + 16}" y="140" font-size="28" font-weight="700" fill="#e6edf3">${esc(value)}</text>`
    })
    .join("\n  ")

  const bars = top
    .map((g, i) => {
      const y = 214 + i * 30
      const w = Math.max(6, Math.round((g.hours / max) * 190))
      return `<text x="24" y="${y + 10}" font-size="12" fill="#c9d1d9">${esc(trunc(g.name, 24))}</text>
  <rect x="200" y="${y}" width="${w}" height="12" rx="6" fill="${i === 0 ? "#4f98a3" : "#2b7a80"}"/>
  <text x="${200 + w + 8}" y="${y + 10}" font-size="12" fill="#8b949e">${num(g.hours)} h</text>`
    })
    .join("\n  ")

  const insights = [
    `${top[0].name} representa ${share}% de todas as minhas horas na Steam.`,
    `${library.playedCount} de ${library.gameCount} jogos da biblioteca já foram jogados (${playedPct}%).`,
    recent.games[0] ? `Mais jogado nas últimas duas semanas: ${recent.games[0].name} (${num(recent.games[0].recentHours)} h).` : null,
  ]
    .filter(Boolean)
    .map((t, i) => {
      const [a, b] = wrap(t, 46)
      const y = 220 + i * 46
      return `<text x="500" y="${y}" font-size="12" fill="#c9d1d9">▸ ${esc(a)}</text>${b ? `\n  <text x="514" y="${y + 17}" font-size="12" fill="#c9d1d9">${esc(b)}</text>` : ""}`
    })
    .join("\n  ")

  const stamp = new Date().toISOString().slice(0, 10)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="880" height="380" viewBox="0 0 880 380" font-family="-apple-system,'Segoe UI',Inter,Helvetica,Arial,sans-serif">
  <rect width="880" height="380" rx="14" fill="#0b1315" stroke="#1f3a3d"/>
  <circle cx="44" cy="40" r="20" fill="#16282a" stroke="#2b7a80"/>
  <text x="44" y="46" font-size="16" text-anchor="middle" fill="#4f98a3">♟</text>
  <text x="76" y="38" font-size="17" font-weight="700" fill="#e6edf3">${esc(profile.name)}</text>
  <rect x="${76 + profile.name.length * 9.6 + 12}" y="24" width="64" height="20" rx="10" fill="none" stroke="#2b7a80"/>
  <text x="${76 + profile.name.length * 9.6 + 44}" y="38" font-size="11" text-anchor="middle" fill="#8b949e">Nível ${profile.level ?? "?"}</text>
  <circle cx="82" cy="58" r="4" fill="${dot}"/>
  <text x="92" y="62" font-size="12" fill="#8b949e">${esc(status)}${since ? ` · membro desde ${since}` : ""}</text>
  ${tiles}
  <text x="24" y="190" font-size="13" font-weight="700" fill="#e6edf3">Mais jogados</text>
  ${bars}
  <text x="500" y="190" font-size="13" font-weight="700" fill="#e6edf3">Insights</text>
  ${insights}
  <text x="856" y="366" font-size="10" fill="#586069" text-anchor="end">atualizado em ${stamp} · dados de paulofabene.vercel.app</text>
</svg>
`
}

await writeFile(OUT, render(await load()))
console.log("assets/steam.svg written")
