# Raven Phone

Native shells for the Raven phone. The apps load https://ravenpbx.com/app.

Package `com.ravenpbx.phone`, version 1.4.0 (version code 140).

## Android

```
cd mobile
npm install
npx cap sync android
cd android
./gradlew bundleRelease
```

Sign the release bundle with the existing Play upload key. Do not create a new keystore. Put that keystore and `signing.properties` in `mobile/release/` locally. `android/app/build.gradle` uses them only when that file is present. Neither the keystore nor the passwords are in this repo.

## iOS

Open `mobile/ios/App/App.xcodeproj` in Xcode on a Mac. Select the Apple team, then archive. This repository does not contain a signed iOS build.
