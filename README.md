<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=rect&color=0:01696f,100:0a2929&height=90&section=header&text=SPEC-001%20%C2%B7%20Paulo%20Fabene&fontSize=28&fontColor=ffffff&fontAlign=50&fontAlignY=50" alt="SPEC-001 Paulo Fabene" />
</p>

| | |
|---|---|
| **Document** | SPEC-001 · Engineer Profile |
| **Status** | ![status](https://img.shields.io/badge/status-active-3fb950?style=flat-square) ![shipping](https://img.shields.io/badge/shipping-always-01696f?style=flat-square) |
| **Owner** | Paulo Fabene |
| **Role** | Back-End Engineer: Node.js, BFF, API orchestration |
| **Education** | Systems Analysis & Development · ML Engineering |
| **Contact** | [LinkedIn](https://www.linkedin.com/in/paulofabene) · [Email](mailto:fabenejunior@hotmail.com) · [Instagram](https://instagram.com/paulofabene) · [Twitch](https://www.twitch.tv/fabenejr) |

<p align="center"><img src="./assets/dashboard.svg" alt="System dashboard" width="100%" /></p>

## 1. Component matrix

| Layer | Technology | Notes |
|---|---|---|
| Languages | ![TS](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) ![JS](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![Py](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white) | TS first |
| Runtime / frameworks | ![Node](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Nest](https://img.shields.io/badge/-NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white) ![Next](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white) ![React](https://img.shields.io/badge/-React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Tailwind](https://img.shields.io/badge/-Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | BFF + web |
| Data | ![PG](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) ![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white) ![Mongo](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) ![Redis](https://img.shields.io/badge/-Redis-DC382D?style=flat-square&logo=redis&logoColor=white) ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) | |
| Edge / platform | ![Kong](https://img.shields.io/badge/-Kong-003459?style=flat-square&logo=kong&logoColor=white) ![Nginx](https://img.shields.io/badge/-Nginx-009639?style=flat-square&logo=nginx&logoColor=white) ![Grafana](https://img.shields.io/badge/-Grafana-F46800?style=flat-square&logo=grafana&logoColor=white) ![AWS](https://img.shields.io/badge/-AWS-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white) ![Lambda](https://img.shields.io/badge/-Lambda-FF9900?style=flat-square&logo=awslambda&logoColor=white) ![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white) ![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white) | gateway, observability |
| AI | ![OpenAI](https://img.shields.io/badge/-OpenAI-412991?style=flat-square&logo=openai&logoColor=white) ![LangChain](https://img.shields.io/badge/-LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white) | agents, automation |

## 2. Active project

**ChoppNow**: a sales booster for draft beer events. A public storefront generates the order, and a lean console supports the supplier payout.

| Decision | Choice | Why |
|---|---|---|
| Monorepo | npm workspaces + Turborepo | one place for apps and shared packages |
| Boundaries | Ports & adapters, enforced by lint | swap infra without touching the domain |
| Order model | 4 orthogonal axes: status · payment · validation · fulfillment | no impossible states |
| Testing | Jest + contract tests · Playwright · pgTAP | same suite against real and in-memory adapters |
| Delivery | merge = staging, Release = production | production changes are deliberate |

## 3. Telemetry

<p align="center">
  <img height="170" src="https://github-readme-stats.vercel.app/api?username=fabenejr&show_icons=true&hide_border=true&bg_color=0d1117&title_color=4f98a3&icon_color=4f98a3&text_color=c9d1d9" />
  <img height="170" src="https://github-readme-stats.vercel.app/api/top-langs/?username=fabenejr&layout=compact&hide_border=true&bg_color=0d1117&title_color=4f98a3&text_color=c9d1d9" />
</p>

<img src="https://github-readme-activity-graph.vercel.app/graph?username=fabenejr&bg_color=0d1117&color=4f98a3&line=4f98a3&point=ffffff&area=true&hide_border=true" width="100%" />

<p align="center">
  <img src="https://raw.githubusercontent.com/fabenejr/fabenejr/output/github-contribution-grid-snake-dark.svg" alt="contribution snake" />
</p>

<sub>Revision 1.0 · always learning, always shipping ✅</sub>
