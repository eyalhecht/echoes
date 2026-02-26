# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Echoes** is a social media platform for discovering and sharing history through photos, stories, and places. Users upload historical photos or memories, and AI enriches each post with metadata and insights (time period, location, cultural context). It combines a social feed, AI analysis, and geolocation map exploration.

## Commands

```bash
npm run dev          # Start Vite dev server (localhost:5173)
npm run build        # Production build → dist/
npm run lint         # ESLint
npm run preview      # Preview production build

npm run test         # Playwright E2E tests (headless, auto-starts dev server)
npm run test:headed  # Run tests with browser UI
npm run test:debug   # Run tests with Playwright inspector
npm run test:report  # Open last HTML test report
```

To run a single test file:
```bash
npx playwright test tests/login-page.spec.js
```

Tests run against `http://localhost:5173`. The Playwright config auto-starts `npm run dev` if no server is running.

## Architecture

### Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS v3, shadcn/ui (Radix UI primitives), MUI icons
- **State**: Zustand (two stores — see below)
- **Backend**: Firebase Cloud Functions (all API calls go through a single `apiGateway` callable)
- **Services**: Firebase Auth, Firestore, Storage, Hosting
- **Routing**: React Router v7
- **Validation**: Yup schemas
- **Testing**: Playwright E2E

### Path Alias
`@` resolves to `./src` (configured in `vite.config.js`).

### Backend Communication Pattern
All server-side operations use a single Firebase callable function:

```js
import { callApiGateway } from '@/firebaseConfig';

const response = await callApiGateway({ action: 'actionName', payload: { ... } });
```

`callApiGateway` is defined in `src/firebaseConfig.js` and wraps `httpsCallable(functions, 'apiGateway')`. In development (localhost), it automatically connects to the Firebase Functions emulator on port 5001.

### Zustand Stores (`src/stores/`)

**`useAuthStore`** — authentication state and actions:
- `user`, `isAuthenticated`, `loading`, `error`
- Actions: `signUpWithEmail`, `loginWithEmail`, `signInWithGoogle`, `signInWithGitHub`, `logout`, `startListeningForAuthChanges`
- Auth listener is started once in `App.jsx` via `useAuthStore.getState().startListeningForAuthChanges()`

**`useUiStore`** (default export) — posts, bookmarks, and UI state:
- Holds the global posts array and bookmarks array (paginated)
- Optimistic updates for likes and bookmarks (with rollback on error)
- Key actions: `togglePostLike`, `togglePostBookmark`, `deletePost`, `fetchPost`, `updatePost`, `getPost`

### Routing (`src/routes/AppRouter.jsx`)
- **Public**: `/` (LandingPage or redirect), `/login`, `/signup`, `/privacy`, `/terms`
- **Protected** (wrapped in `ProtectedRoute` + `Layout`): `/home`, `/explore`, `/profile/:userId?`, `/map`, `/upload`, `/bookmarks`

### Layout & Post Detail Modal
`Layout.jsx` renders the `AppSidebar` + `MainContent`. Post detail modals are driven by the URL query param `?post=<postId>` — `Layout` listens for this param, fetches the post if not already in the store, and renders `PostDetailView` as an overlay.

### UI Components
- `src/components/ui/` — shadcn/ui components (button, card, dialog, sidebar, etc.) plus custom `Polaroid.jsx`
- `src/lib/utils.js` — exports `cn()` (clsx + tailwind-merge helper)

### Data Schemas (`src/validation/schemas/schema.js`)
Yup schemas for `postSchema`, `userSchema`, `commentSchema`, `likeDocSchema`. Post types: `photo`, `video`, `document`, `item`, `youtube` (only `photo` is currently active in the upload UI).

### Firebase Config (`src/firebaseConfig.js`)
Firebase credentials come from `VITE_FIREBASE_*` environment variables. See `.env.development` and `.env.production` (not committed). Exports: `auth`, `functions`, `db`, `storage`, `callApiGateway`.

### Deployment
`npm run build` produces `dist/`. Deploy to Firebase Hosting with `firebase deploy`.
