// Renders assets/steam.svg from the Steam summary endpoint.
// Falls back to the last committed data/steam.json when the API is unavailable.
import { readFile, writeFile } from "node:fs/promises"

const SOURCE = process.env.STEAM_SUMMARY_URL ?? "https://paulofabene.vercel.app/api/steam"
const CACHE = new URL("../data/steam.json", import.meta.url)
const OUT = new URL("../assets/steam.svg", import.meta.url)

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c])
const num = (n, d = 1) => n.toLocaleString("en-US", { maximumFractionDigits: d })
const compact = (n) => (n >= 1000 ? `${num(n / 1000)}k` : num(n, 0))
const wrap = (s, n) => {
  if (s.length <= n) return [s, ""]
  const cut = s.lastIndexOf(" ", n)
  return [s.slice(0, cut), s.slice(cut + 1)]
}
const trunc = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)

const STEAM_API = "https://api.steampowered.com"
const VANITY = process.env.STEAM_VANITY ?? "juninfb"
const hours = (minutes = 0) => Math.round((minutes / 60) * 10) / 10

async function steam(path, params) {
  const query = new URLSearchParams({ key: process.env.STEAM_API_KEY, format: "json", ...params })
  const res = await fetch(`${STEAM_API}${path}?${query}`, { signal: AbortSignal.timeout(20_000) })
  if (!res.ok) throw new Error(`Steam ${res.status} for ${path}`)
  return res.json()
}

// Same shape as the portfolio's /api/steam, built straight from the Steam Web API.
async function fromSteam() {
  const vanity = await steam("/ISteamUser/ResolveVanityURL/v1/", { vanityurl: VANITY })
  const steamId = process.env.STEAM_ID ?? vanity.response.steamid
  if (!steamId) throw new Error("vanity_not_found")
  const [summaries, level, owned, recent] = await Promise.all([
    steam("/ISteamUser/GetPlayerSummaries/v2/", { steamids: steamId }),
    steam("/IPlayerService/GetSteamLevel/v1/", { steamid: steamId }).catch(() => ({ response: {} })),
    steam("/IPlayerService/GetOwnedGames/v1/", { steamid: steamId, include_appinfo: "1", include_played_free_games: "1" }),
    steam("/IPlayerService/GetRecentlyPlayedGames/v1/", { steamid: steamId }),
  ])
  const player = summaries.response.players[0]
  if (!player) throw new Error("player_not_found")
  const games = owned.response.games ?? []
  const toGame = (g) => ({ name: g.name ?? `App ${g.appid}`, hours: hours(g.playtime_forever), recentHours: hours(g.playtime_2weeks) })
  const recentGames = (recent.response.games ?? []).map(toGame).sort((x, y) => y.recentHours - x.recentHours)
  return {
    generatedAt: new Date().toISOString(),
    profile: {
      name: player.personaname,
      avatar: player.avatarfull,
      url: player.profileurl,
      level: level.response.player_level ?? null,
      memberSince: player.timecreated ? new Date(player.timecreated * 1000).toISOString() : null,
      online: player.personastate > 0,
      currentGame: player.gameextrainfo ?? null,
    },
    library: {
      gameCount: owned.response.game_count ?? games.length,
      playedCount: games.filter((g) => g.playtime_forever > 0).length,
      totalHours: Math.round(games.reduce((sum, g) => sum + g.playtime_forever, 0) / 60),
      topGames: games.filter((g) => g.playtime_forever > 0).sort((x, y) => y.playtime_forever - x.playtime_forever).slice(0, 5).map(toGame),
    },
    recent: { totalHours: Math.round(recentGames.reduce((sum, g) => sum + g.recentHours, 0) * 10) / 10, games: recentGames.slice(0, 3) },
  }
}

async function fromPortfolio() {
  const res = await fetch(SOURCE, { signal: AbortSignal.timeout(20_000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// Order: Steam directly (needs STEAM_API_KEY) → portfolio endpoint → last committed data.
async function load() {
  const sources = [
    ...(process.env.STEAM_API_KEY ? [["Steam API", fromSteam]] : []),
    ["portfolio endpoint", fromPortfolio],
  ]
  for (const [name, fetcher] of sources) {
    try {
      const data = await fetcher()
      if (!data.library?.topGames?.length) throw new Error("empty library (is game details public?)")
      await writeFile(CACHE, `${JSON.stringify(data, null, 2)}\n`)
      console.log(`Data from ${name}`)
      return data
    } catch (error) {
      console.warn(`${name} failed: ${error.message}`)
    }
  }
  console.warn("Using cached data/steam.json")
  return JSON.parse(await readFile(CACHE, "utf8"))
}

// GitHub renders SVGs in <img>, which blocks external images, so the avatar is embedded as a data URI.
async function avatarDataUri(url) {
  if (!url) return null
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20_000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const type = res.headers.get("content-type") ?? "image/jpeg"
    return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString("base64")}`
  } catch (error) {
    console.warn(`avatar skipped: ${error.message}`)
    return null
  }
}

function render({ profile, library, recent }, avatar) {
  const since = profile.memberSince ? new Date(profile.memberSince).getUTCFullYear() : null
  const top = library.topGames
  const max = top[0].hours
  const share = Math.round((top[0].hours / library.totalHours) * 100)
  const playedPct = Math.round((library.playedCount / library.gameCount) * 100)
  const status = profile.currentGame ? `Playing ${profile.currentGame}` : profile.online ? "Online" : "Offline"
  const dot = profile.online || profile.currentGame ? "#3fb950" : "#6e7681"

  const tiles = [
    ["Games", num(library.gameCount, 0)],
    ["Hours played", compact(library.totalHours)],
    ["Games played", num(library.playedCount, 0)],
    ["Hours, last 2 weeks", num(recent.totalHours)],
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
    `${top[0].name} accounts for ${share}% of all my Steam hours.`,
    `${library.playedCount} of ${library.gameCount} games in the library have been played (${playedPct}%).`,
    recent.games[0] ? `Most played in the last two weeks: ${recent.games[0].name} (${num(recent.games[0].recentHours)} h).` : null,
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
  <defs><clipPath id="avatar"><circle cx="44" cy="40" r="20"/></clipPath></defs>
  ${avatar
    ? `<image href="${avatar}" x="24" y="20" width="40" height="40" clip-path="url(#avatar)" preserveAspectRatio="xMidYMid slice"/>`
    : `<text x="44" y="46" font-size="16" text-anchor="middle" fill="#4f98a3">♟</text>`}
  <circle cx="44" cy="40" r="20" fill="none" stroke="#2b7a80"/>
  <text x="76" y="38" font-size="17" font-weight="700" fill="#e6edf3">${esc(profile.name)}</text>
  <rect x="${76 + profile.name.length * 9.6 + 12}" y="24" width="64" height="20" rx="10" fill="none" stroke="#2b7a80"/>
  <text x="${76 + profile.name.length * 9.6 + 44}" y="38" font-size="11" text-anchor="middle" fill="#8b949e">Level ${profile.level ?? "?"}</text>
  <circle cx="82" cy="58" r="4" fill="${dot}"/>
  <text x="92" y="62" font-size="12" fill="#8b949e">${esc(status)}${since ? ` · member since ${since}` : ""}</text>
  ${tiles}
  <text x="24" y="190" font-size="13" font-weight="700" fill="#e6edf3">Most played</text>
  ${bars}
  <text x="500" y="190" font-size="13" font-weight="700" fill="#e6edf3">Insights</text>
  ${insights}
  <text x="856" y="366" font-size="10" fill="#586069" text-anchor="end">updated ${stamp}</text>
</svg>
`
}

const data = await load()
await writeFile(OUT, render(data, await avatarDataUri(data.profile.avatar)))
console.log("assets/steam.svg written")
