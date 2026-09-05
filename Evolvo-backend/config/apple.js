import {
  APPLE_APP_ID,
  APPLE_BUNDLE_ID,
  APPLE_ISSUER_ID,
  APPLE_KEY_ID,
  APPLE_PRIVATE_KEY,
} from "./env.js";

const appleConfig = {
  issuerId: APPLE_ISSUER_ID,
  keyId: APPLE_KEY_ID,
  privateKey: APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  bundleId: APPLE_BUNDLE_ID,
  appAppleId: APPLE_APP_ID ? Number(APPLE_APP_ID) : undefined,

  productionUrl: "https://api.storekit.apple.com",
  sandboxUrl: "https://api.storekit-sandbox.apple.com",
};

export default appleConfig;