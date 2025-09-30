# Frontend README

## Prerequisites

Ensure you have the following installed before setting up the project:

- Node.js 20 (or LTS 20.x)
- npm or yarn installed
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)

## Installing Dependencies

Install dependencies using either:

```bash
npm install
```

or

```bash
yarn install
```

## Backend Server Setup

In `PreviewScreen.tsx` and `MediaScreen.tsx`, replace API endpoints:

- For local development:

  - `"<DOMAIN>/save"` → `http://<localip>:<port>/save`
  - `"<DOMAIN>/verify"` → `http://<localip>:<port>/verify`

- For deployment:
  - Use the deployed backend URL in place of `"<DOMAIN>"`.

Refer to the [Backend README](../backend/README.md) for backend setup.

## Prebuild

Run prebuild before native builds:

```bash
npx expo prebuild
```

## Android Development

### Building with EAS

Development build (APK):

```bash
eas build --platform android --profile development
```

Start the Expo development server for local development:

```bash
npx expo start
```

Preview build (APK):

```bash
eas build --platform android --profile preview
```

The generated APK can be downloaded and installed for testing.
