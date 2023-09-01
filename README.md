This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Generate/fetch PokeData Required
```bash
# using npm
npm run datagen
npm run imagegen
```

Ensure the datagen runs without errors before running the imagegen!
The datagen may fail sometimes as it has to fetch a lot of data from different pages. It will cache the previous ones.
So if it fails just run multiple times until it finishes successfully.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start
```

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android
```

## Outputs

To install production apk directly to device:

```sh
npm run android_production_install
```

To compile production apk:

```sh
npm run build:android
```
