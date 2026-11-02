import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.ravenpbx.phone",
  appName: "Raven Phone",
  webDir: "www",
  server: {
    url: "https://ravenpbx.com/app",
    androidScheme: "https",
    allowNavigation: ["ravenpbx.com", "*.ravenpbx.com"],
  },
  android: {
    backgroundColor: "#050505",
    allowMixedContent: false,
  },
  ios: {
    backgroundColor: "#050505",
    contentInset: "automatic",
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#050505",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#050505",
    },
  },
};

export default config;
