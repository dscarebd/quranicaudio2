# Why this error appeared

Capacitor's `webDir` in `capacitor.config.ts` is set to `dist`, but that folder doesn't exist yet on your local machine. `npx cap sync android` only copies an already-built web bundle into the native Android project — it does not build the web app itself. Since you never ran the build step locally, there is no `dist/index.html` for Capacitor to copy, so it stops with the error you saw.

(The `dist/` folder is generated output and is gitignored, so it won't appear after cloning or downloading the project — every machine has to build it once.)

# How to fix it

Run these commands in your project folder (`C:\Users\USER\quranicaudio-eff43ab5`), in order:

1. `npm install` — install dependencies (only needed the first time, or after dependency changes).
2. `npm run build` — produces the `dist/` folder with `index.html` and all assets.
3. `npx cap sync android` — now succeeds and copies `dist/` into the Android project.
4. `npx cap open android` — opens Android Studio to run/build the APK.

# Repeat workflow

Every time you change web code and want it on the device, repeat:

```
npm run build
npx cap sync android
```

# Notes / gotchas

- Node.js 18+ must be installed (check with `node -v`).
- If `npm run build` fails, fix those errors first — `cap sync` cannot proceed without a successful build.
- The current `capacitor.config.ts` already has `webDir: 'dist'`, `appId: 'com.annur.listenquran'`, and `appName: 'Listen Quran'`, so no config change is needed.
- No code changes are required for this issue — it is purely a missing local build step.

Approve this plan and I'll confirm there's nothing to change in the repo, or add an npm script alias (e.g. `"android": "npm run build && cap sync android"`) if you want a one-command shortcut.
