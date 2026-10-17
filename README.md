<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:01696f,100:0a2929&height=160&section=header&text=Paulo%20Fabene&fontSize=40&fontColor=ffffff&animation=fadeIn" alt="Paulo Fabene" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&pause=1200&color=4f98a3&center=true&vCenter=true&width=560&lines=%24+whoami;paulo-fabene+%E2%86%92+back-end+engineer;%24+cat+focus.txt;Node.js+%C2%B7+BFF+%C2%B7+API+Gateway+%C2%B7+Kong+%C2%B7+Nginx;%24+ls+building%2F;choppnow+%C2%B7+saas+%C2%B7+ai+%C2%B7+automation;%24+git+push+origin+main+%E2%9C%85" alt="Typing SVG" />
</p>

<p align="center">
  <a href="https://www.linkedin.com/in/paulofabene"><img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" /></a>
  <a href="mailto:fabenejunior@hotmail.com"><img src="https://img.shields.io/badge/Email-0078D4?style=for-the-badge&logo=microsoft-outlook&logoColor=white" /></a>
  <a href="https://instagram.com/paulofabene"><img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" /></a>
  <a href="https://www.twitch.tv/fabenejr"><img src="https://img.shields.io/badge/Twitch-9146FF?style=for-the-badge&logo=twitch&logoColor=white" /></a>
</p>

---

### `~/paulo/profile.ts`

```ts
const paulo = {
  role: "Back-End Engineer",
  education: ["Systems Analysis & Development", "ML Engineering"],
  core: ["Node.js", "BFF architecture", "API orchestration"],
  edge: ["Kong", "Nginx", "AWS Lambda"],
  currently: {
    building: "ChoppNow — a sales booster for draft beer events",
    exploring: ["LLM agents", "LangChain", "workflow automation"],
  },
  philosophy: "ship small, observe everything, keep the domain clean",
  status: "always learning, always shipping ✅",
} as const;
```

---

### 🧭 How I like to build: request flow

```mermaid
%%{init: {'theme':'base','themeVariables':{'primaryColor':'#0a2929','primaryTextColor':'#ffffff','primaryBorderColor':'#4f98a3','lineColor':'#4f98a3','secondaryColor':'#01696f','tertiaryColor':'#0d1117'}}}%%
flowchart LR
    C([Client]) --> N[Nginx]
    N --> K{{Kong<br/>API Gateway}}
    K -->|auth · rate-limit| B[BFF<br/>Node.js / NestJS]
    B --> S1[(PostgreSQL<br/>Supabase)]
    B --> S2[(Redis<br/>cache)]
    B --> L[AWS Lambda<br/>jobs & cron]
    B --> AI[LLM / LangChain]
    B -. metrics .-> G[Grafana]
```

> Edge handles traffic, the gateway handles policy, the BFF handles orchestration, and the domain stays free of framework code.

---

### 🚀 Featured: ChoppNow

A sales booster for draft beer events: a public storefront that generates the order, plus a lean console that supports the supplier payout.

| | |
|---|---|
| **Architecture** | Monorepo (npm workspaces + Turborepo), ports & adapters, domain with zero framework imports |
| **Stack** | Next.js 16 · TypeScript strict (zero `any`) · Supabase · Tailwind v4 |
| **Money** | Integer cents + `Money` value object, never floats |
| **Orders** | 4 orthogonal state axes: status · payment · validation · fulfillment |
| **Quality** | Jest + contract tests (real adapter vs in-memory fake) · Playwright E2E · pgTAP |
| **Delivery** | Merge to `main` = staging, Release = production |

---

### ⚙️ Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=ts,js,py,nodejs,nestjs,nextjs,react,tailwind&theme=dark" /><br/>
  <img src="https://skillicons.dev/icons?i=postgres,supabase,mongodb,redis,prisma&theme=dark" /><br/>
  <img src="https://skillicons.dev/icons?i=nginx,grafana,aws,docker,vercel&theme=dark" /><br/>
  <img src="https://img.shields.io/badge/Kong-003459?style=for-the-badge&logo=kong&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS%20Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white" />
</p>

---

### 📊 Telemetry

<p align="center">
  <img height="170" src="https://github-readme-stats.vercel.app/api?username=fabenejr&show_icons=true&hide_border=true&bg_color=0d1117&title_color=4f98a3&icon_color=4f98a3&text_color=c9d1d9" />
  <img height="170" src="https://github-readme-stats.vercel.app/api/top-langs/?username=fabenejr&layout=compact&hide_border=true&bg_color=0d1117&title_color=4f98a3&text_color=c9d1d9" />
</p>

<div align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=fabenejr&bg_color=0d1117&color=4f98a3&line=4f98a3&point=ffffff&area=true&hide_border=true" width="100%" />
</div>

<p align="center">
  <img src="https://raw.githubusercontent.com/fabenejr/fabenejr/output/github-contribution-grid-snake-dark.svg" alt="contribution snake" />
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0a2929,100:01696f&height=100&section=footer" />
</p>
