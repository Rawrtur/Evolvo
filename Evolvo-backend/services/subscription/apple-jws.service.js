import {
  Environment,
  SignedDataVerifier,
} from "@apple/app-store-server-library";

import appleConfig from "../../config/apple.js";
import appleRootCertificates from "../../config/apple-root-certificates.js";


const createVerifier = (environment) => {
  const isProduction =
    environment === Environment.PRODUCTION;

  return new SignedDataVerifier(
    appleRootCertificates,
    true,
    environment,
    appleConfig.bundleId,
    isProduction
      ? appleConfig.appAppleId
      : undefined,
  );
};


const productionVerifier = createVerifier(
  Environment.PRODUCTION,
);

const sandboxVerifier = createVerifier(
  Environment.SANDBOX,
);


const getVerifier = (environment) => {
  if (environment === "production") {
    return productionVerifier;
  }

  if (environment === "sandbox") {
    return sandboxVerifier;
  }

  throw new Error("Invalid Apple environment");
};


export const verifyTransaction = async (
  signedTransactionInfo,
  environment,
) => {
  if (
    typeof signedTransactionInfo !== "string" ||
    !signedTransactionInfo.trim()
  ) {
    throw new Error(
      "Missing Apple signed transaction information",
    );
  }

  return getVerifier(environment).verifyAndDecodeTransaction(
    signedTransactionInfo,
  );
};


export const verifyRenewalInfo = async (
  signedRenewalInfo,
  environment,
) => {
  if (
    typeof signedRenewalInfo !== "string" ||
    !signedRenewalInfo.trim()
  ) {
    throw new Error(
      "Missing Apple signed renewal information",
    );
  }

  return getVerifier(environment).verifyAndDecodeRenewalInfo(
    signedRenewalInfo,
  );
};


export const verifyNotification = async (
  signedPayload,
  environment,
) => {
  if (
    typeof signedPayload !== "string" ||
    !signedPayload.trim()
  ) {
    throw new Error(
      "Missing Apple signed notification payload",
    );
  }

  return getVerifier(environment).verifyAndDecodeNotification(
    signedPayload,
  );
};


export const verifyAppTransaction = async (
  signedAppTransaction,
  environment,
) => {
  if (
    typeof signedAppTransaction !== "string" ||
    !signedAppTransaction.trim()
  ) {
    throw new Error(
      "Missing Apple signed app transaction",
    );
  }

  return getVerifier(environment).verifyAndDecodeAppTransaction(
    signedAppTransaction,
  );
};


export default {
  verifyTransaction,
  verifyRenewalInfo,
  verifyNotification,
  verifyAppTransaction,
};