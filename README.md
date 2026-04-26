# Family Talk

Conversation game that turns family time into real connection — built on peer-reviewed psychology research, not on vibes.

<p align="center">
  <img src="demo.gif" alt="Family Talk demo" width="320" height="320">
</p>

<p align="center">
  <a href="https://family-talk-jr-home.web.app">
    <img src="https://img.shields.io/badge/Live-family--talk--jr--home.web.app-brightgreen?style=flat-square" alt="Live demo">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License">
  </a>
  <img src="https://img.shields.io/badge/Angular-14-DD0031?style=flat-square&logo=angular&logoColor=white" alt="Angular">
  <img src="https://img.shields.io/badge/PWA-ready-5A0FC8?style=flat-square" alt="PWA">
</p>

## What it does

Family Talk picks a random family member and asks them a question. The whole table answers, the next round picks someone else. Ten minutes a week of structured conversation rebuilds connection that small talk never could.

The catch: the **questions matter more than the game**. Bad questions ("How was your day?") get bad answers. Good questions, asked in the right order, generate real closeness — Arthur Aron proved it in 1997.

## Research-backed by design

Every gameplay decision traces back to a paper:

| Mechanic | Research | Why |
|---|---|---|
| **Depth escalation** (round 1-3 light → 4-6 moderate → 7+ deep) | [Aron et al. (1997)](https://journals.sagepub.com/doi/10.1177/0146167297234003) | Strangers fall in love after 36 escalating questions. Families re-bond on the same protocol. |
| **Appreciation rounds** (every 5th question) | [Gottman Love Maps](https://www.gottman.com/blog/the-sound-relationship-house-build-love-maps/) | Expressing fondness is the #1 predictor of relationship stability across 40 years of marital research. |
| **Family stories category** | [Duke & Fivush (2008)](https://www.psychologytoday.com/us/blog/the-stories-of-our-lives/201611/the-do-you-know-20-questions-about-family-stories) | The "Do You Know?" scale — children who know family history score higher on self-esteem, resilience, lower anxiety. |
| **160 questions, all open-ended** | Aron + Gottman | Yes/no questions never reveal anything. Specific memories do. |

## Features

- **160 curated questions** across 16 categories — light memories, values, vulnerability, family history
- **Progressive depth** — the game escalates intimacy automatically; nobody gets "who do you need to forgive?" on question one
- **Appreciation prompts** — Gottman-style fondness mechanics built into the loop
- **AI question generation** — bring your own OpenAI key, generate fresh questions in any category
- **i18n** — Spanish + English, language detection from browser
- **PWA** — installable, offline-capable via service worker
- **Responsive** — mobile-first, works flawlessly down to 360×640
- **No backend** — runs entirely client-side, state in localStorage
- **Privacy-first** — your data never leaves your device

## Tech stack

- **Angular 14** with standalone components and `OnPush` everywhere
- **Custom design system** (`ft-ui`) — buttons, cards, toasts, avatar pickers, color pickers, all built from scratch
- **RxJS BehaviorSubjects** for reactive state (no NgRx — kept it lean)
- **ngx-translate** for i18n
- **Firebase Hosting** for deployment
- **Service Worker** for PWA + offline support

## Architecture

Module-less, standalone-first, organized by feature with a shared design system layer:

```
            ┌─────────────────────────────────────────┐
            │       Pages (smart components)          │
            │  countdown · edit-player · questions    │
            │   ai · language · config · settings     │
            └──────┬──────────────────────────┬───────┘
                   │ inject                   │ use
            ┌──────▼──────────────┐    ┌──────▼─────────┐
            │  Services (state)   │    │  ft-ui (dumb)  │
            │  Player, Questions, │    │ button, input, │
            │  Ai, Language,      │    │ card, toast,   │
            │  LocalStorage,      │    │ avatar-picker… │
            │  Toast              │    │  pure inputs / │
            │  BehaviorSubject<T> │    │  outputs only  │
            └──────┬──────────────┘    └────────────────┘
                   │ delegate to
            ┌──────▼──────────────────┐
            │  Pure utils             │
            │  question.utils,        │
            │  player.utils,          │
            │  id.utils               │
            │  (zero side effects)    │
            └─────────────────────────┘
```

### Patterns we use

- **Smart vs presentational** — pages own state and orchestration; `ft-ui` primitives accept inputs and emit outputs, nothing else. Easy to drop into Storybook.
- **Reactive state via `BehaviorSubject`** — every service exposes a `state$` observable plus a synchronous getter for imperative reads. The component subscribes once and calls `markForCheck()` on emissions; `OnPush` does the rest.
- **Pure utility layer** — `question.utils.ts`, `player.utils.ts` are pure functions taking immutable input and returning new state. Trivially unit-testable, no service mocking.
- **Generic typed storage** — `LocalStorageService.get<T>(key)` and `set<T>(key, value)`. Single boundary for serialization, type-safe at every call site.
- **Atomic design system** — `ft-ui/` holds primitives, composed into composites (`ft-player-card`, `ft-question-card`), then assembled into pages. Tokens (`_tokens.scss`) as the single source of color/spacing/radius truth.
- **Versioned cache invalidation** — `QUESTIONS_VERSION` constant drives a localStorage migration on load. Bump the number, all clients rehydrate on next visit.
- **Module-less / standalone everything** — `bootstrapApplication()` + `provideRouter()`. No `NgModule` ceremony. Lazy routes use `loadComponent`.

### Patterns we deliberately did *not* use

- **NgRx / Redux** — overkill for a single-user client-side app. Three `BehaviorSubject`s do the job.
- **Facade pattern** — services are already small and single-purpose; a facade would just be an extra hop.
- **Repository pattern** — there is one persistence target (localStorage); `LocalStorageService` is the only data adapter we need.
- **NgModules** — Angular 14 standalone makes them unnecessary. Skipping them removes a whole category of boilerplate.
- **Backend / API layer** — by design. State stays on the device; nothing leaves except the optional OpenAI call the user opts into.

### Laws of UX applied

The 2026 visual overhaul was driven by a checklist of UX laws, not aesthetic taste:

| Law | Where it shows up |
|---|---|
| **Hick's Law** | Config menu trimmed to a 2-column grid of icons; no nested menus |
| **Fitts's Law** | Primary CTAs are large, bottom-anchored, in the thumb zone |
| **Doherty Threshold** | All interactions return feedback under 400 ms; toasts confirm state changes |
| **Jakob's Law** | Bottom-nav patterns match what users already know from mobile apps |
| **Miller's Law** | 16 categories chunked into a scrollable grid, never a long list |
| **Aesthetic-Usability Effect** | Polished `ft-ui` components, custom illustrations, motion on hover/select |
| **Goal-Gradient Effect** | Round counter + depth dots show progress toward deeper questions |

## What's interesting under the hood

- **Custom toast system** (`ft-toast`) — replaced Angular Material entirely after diagnosing 18px phantom-scroll bugs caused by unstyled CDK overlays
- **Cached question invalidation** with versioning — bumping a constant migrates all users to a new question pool on next load
- **Depth-aware random selection** — questions are tagged `depth: 1|2|3` and the selector escalates with `roundCounter`
- **Layout chain via percentage flex** — no `100vh` (broken on mobile browsers), just `html(100%) → body(100%) → app-root(flex column) → page(flex:1)`
- **Type-safe localStorage** with generic `LocalStorageService<T>`

## Run locally

```bash
npm install
npm start
# open http://localhost:4300
```

Build for production:

```bash
npm run build -- --configuration production
# output in dist/family-talk
```

## Deploy

```bash
firebase deploy --only hosting
```

## Testing

Unit tests with Jasmine + Karma:

```bash
npm test
```

## Project structure

```
src/app/
  ft-ui/                  Design system primitives (button, input, toast, ...)
    toast/                Custom toast service + container
    question-card/        Question card with depth indicator + appreciation style
  models/
    questions.ts          160 questions + 8 appreciation prompts, depth-tagged
  services/
    questions.service.ts  Round counter, depth escalation, version invalidation
    player.service.ts     Reactive player state via BehaviorSubject
    ai.service.ts         OpenAI integration
  utils/
    question.utils.ts     Pure functions: filter by depth, depth-for-round, ...
  countdown/              Main game loop
  edit-player/            Add/edit/delete players
  questions/              Per-category configuration
  ai/                     OpenAI key + toggle
  language/               i18n switcher
  general-settings/       Reset state
  config/                 Settings hub
```

## Acknowledgments

- Arthur Aron, Edward Melinat, Elaine N. Aron, Robert Darrin Vallone, Renee J. Bator — *The Experimental Generation of Interpersonal Closeness* (1997)
- John Gottman — *The Seven Principles for Making Marriage Work* (1999)
- Marshall P. Duke, Robyn Fivush — *"Do You Know?" scale* (2008)
- William Doherty — *The Intentional Family* (1997)

## License

[MIT](LICENSE) — Copyright (c) 2026 Luis Reinoso
