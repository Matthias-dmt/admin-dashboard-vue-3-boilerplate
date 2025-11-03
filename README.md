# Admin Dashboard (Vue 3 + Vite + Tailwind v4)

A minimal, production-ready admin dashboard built with **Vue 3**, **TypeScript**, **Vite**, **Pinia**, **Tailwind CSS v4**, and **Headless UI**. It ships with:

- Auth (login/logout + token persistence)
- Role-based access (super_admin, admin, customer)
- Users CRUD
- Responsive layout (top navbar, collapsible sidebar)
- Light/Dark theme (CSS variables)
- Clean component system (buttons/inputs/badges/pagination)

> Backend API (AdonisJS): `https://github.com/Matthias-dmt/boilerplate_adonis`

---

## Stack

| Layer         | Tech                                   |
| ------------- | -------------------------------------- |
| Framework     | Vue 3 + TypeScript                     |
| Build         | Vite                                   |
| State         | Pinia                                  |
| Router        | Vue Router 4                           |
| Styling       | Tailwind CSS v4 + custom CSS variables |
| UI Primitives | Headless UI + Heroicons                |
| HTTP          | Axios                                  |
| Lint/Format   | ESLint + Prettier                      |

---

## Project Structure

```
src/
  assets/
    tailwind.css          # Tailwind v4 entry + CSS variables + component classes
  components/
    ThemeToggle.vue
    NavBar.vue
    Sidebar.vue
    ...                   # Reusable UI pieces
  composables/
    useTheme.ts
  layouts/
    AppLayout.vue
    AuthLayout.vue
  lib/
    api/                  # Small API wrappers
    http.ts               # Axios instance + interceptors
  router/
    index.ts
  stores/
    auth.ts               # Auth store (user + tokens)
    ...                   # Other stores
  views/
    Login.vue
    Dashboard.vue
    users/
      UsersList.vue
      UserEdit.vue
  main.ts
```

---

## Prerequisites

- Node.js `^20.19.0 || >=22.12.0`
- pnpm (recommended)

---

## Environment

Create a `.env` file at the project root:

```env
VITE_APP_NAME=Admin Dashboard
VITE_API_BASE_URL=http://localhost:3333
VITE_API_VERSION=v1
VITE_HOST=127.0.0.1
VITE_PORT=5173
```

> The API must expose endpoints like `/v1/auth/login`, `/v1/auth/refresh`, `/v1/auth/me`, and `/v1/admin/users`.

---

## Install & Run

```bash
pnpm install
pnpm dev
```

- App: `http://127.0.0.1:5173` (or your `VITE_HOST`/`VITE_PORT`)
- API: make sure your AdonisJS server is running with matching CORS + base URL

### Build & Preview

```bash
pnpm build
pnpm preview
```

---

## Styling & Theme

- Tailwind v4 is configured via PostCSS:
  - `postcss.config.cjs` → `{'@tailwindcss/postcss': {}}`
  - `src/assets/tailwind.css` → `@import "tailwindcss";`
- Global CSS variables (light/dark) live in `tailwind.css` under `@layer base`.
- Reusable classes (buttons, inputs, badges, pagination) live under `@layer components`.

To change global colors, edit these variables once:

```css
@layer base {
  :root {
    --bg: 249 250 251;
    --card: 255 255 255;
    --border: 0 0 0 / 0.08;
    --text: 26 26 26;
    --muted: 100 116 139;

    --primary: 99 102 241; /* indigo */
    --primary-fg: 255 255 255;

    --success: 34 197 94;
    --danger: 239 68 68;
    --info: 59 130 246;
    --warning: 245 158 11;

    --control-h: 2.5rem; /* consistent input/button height */
  }
  .dark {
    --bg: 24 24 27;
    --card: 39 39 42;
    --border: 255 255 255 / 0.1;
    --text: 243 244 246;
    --muted: 161 161 170;

    --primary: 129 140 248;
    --primary-fg: 24 24 27;
  }
}
```

---

## Auth

- Tokens are stored in the Pinia `auth` store.
- `http.ts` attaches the access token via interceptor and can refresh on 401 if implemented.
- Protected routes are guarded in `router/index.ts` (redirect to `/login` when not authenticated).

---

## Scripts

```bash
pnpm dev        # start Vite
pnpm build      # build for production
pnpm preview    # preview build
pnpm lint       # eslint fix + cache
pnpm format     # prettier (src/)
```

---

## Testing

We use **Vitest** + **Vue Test Utils** + **jsdom**.

### Install

```bash
pnpm add -D vitest @vitest/coverage-v8 @vue/test-utils jsdom @testing-library/vue
```

### Config

Create `vitest.config.ts` at the project root and `tests/setup.ts` in a new `tests` folder (see files included in this bundle).

Add scripts:

```jsonc
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:cov": "vitest run --coverage",
  },
}
```

### What to test first

1. **Auth store**
   - `login` sets `user`, `accessToken`, `refreshToken`
   - `logout` clears state
   - `me` populates user when token present

2. **HTTP interceptors**
   - Attaches `Authorization: Bearer <token>`
   - On 401, attempts refresh once (if you enable this), then retries

3. **Theme composable (`useTheme`)**
   - `setDark`, `setLight`, `setSystem` toggle `.dark` class and persist to `localStorage`

4. **UI components**
   - `ThemeToggle.vue` switches modes (assert `documentElement.classList`)
   - `Sidebar.vue` emits `close` on outside click and on link click

5. **Users list**
   - Pagination buttons enable/disable correctly
   - Filtering calls API with `search/sort` params (mock HTTP and assert calls)

---

## API Link

Backend (AdonisJS) repo: `https://github.com/<you>/<api-repo>`

---

## Contributing

- Use feature branches and PRs
- Keep coverage green for touched areas
- Match ESLint/Prettier rules

---

## License

MIT
