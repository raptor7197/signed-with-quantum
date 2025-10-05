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

## Prebuild

Run prebuild before native builds:

```bash
npx expo prebuild
```

## Android Development

### Building with EAS

#### Development build (APK):

```bash
eas build --platform android --profile development
```

Start the Expo development server for local development:

```bash
npx expo start
```

#### Preview build (APK):

```bash
eas build --platform android --profile preview
```

The generated APK can be downloaded and installed for testing.

**Note:** You must have an [Expo account](https://expo.dev/signup) and be logged in before running any EAS build commands.  
- Create an account here: [Signup](https://expo.dev/signup).
- For more details on using Expo accounts and EAS, check the official docs: [Expo EAS](https://docs.expo.dev/eas/).