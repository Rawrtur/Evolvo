import {
  APIException,
  AppStoreServerAPIClient,
  Environment,
  Status,
} from "@apple/app-store-server-library";

import User from "../../models/user.model.js";
import Subscription from "../../models/subscription.model.js";
import AppleNotification from "../../models/apple-notification.model.js";

import PRODUCTS from "../../config/products.js";
import appleConfig from "../../config/apple.js";

import {
  verifyTransaction,
  verifyRenewalInfo,
  verifyNotification,
} from "./apple-jws.service.js";

import { upsertSubscription } from "./subscription.service.js";

const productionClient = new AppStoreServerAPIClient(
  appleConfig.privateKey,
  appleConfig.keyId,
  appleConfig.issuerId,
  appleConfig.bundleId,
  Environment.PRODUCTION,
);

const sandboxClient = new AppStoreServerAPIClient(
  appleConfig.privateKey,
  appleConfig.keyId,
  appleConfig.issuerId,
  appleConfig.bundleId,
  Environment.SANDBOX,
);

const getAppleClient = (environment) => {
  if (environment === "production") {
    return productionClient;
  }

  if (environment === "sandbox") {
    return sandboxClient;
  }

  throw new Error("Invalid Apple environment");
};

const getProductById = (productId) => {
  return Object.values(PRODUCTS).find((product) => product.id === productId);
};

const validateProduct = (productId) => {
  const product = getProductById(productId);

  if (!product) {
    throw new Error("Unsupported Apple product");
  }

  return product;
};

const normalizeEnvironment = (environment) => {
  if (environment === "Production" || environment === "production") {
    return "production";
  }

  if (environment === "Sandbox" || environment === "sandbox") {
    return "sandbox";
  }

  throw new Error("Invalid Apple environment");
};

const mapAppleStatus = (status) => {
  switch (status) {
    case Status.ACTIVE:
      return "active";

    case Status.BILLING_RETRY:
      return "billing_retry";

    case Status.BILLING_GRACE_PERIOD:
      return "grace_period";

    case Status.EXPIRED:
      return "expired";

    case Status.REVOKED:
      return "revoked";

    default:
      throw new Error(`Unsupported Apple subscription status: ${status}`);
  }
};

const getAutoRenew = (renewalInfo) => {
  return renewalInfo?.autoRenewStatus === 1;
};

const validateAccountToken = (user, transaction) => {
  if (!transaction.appAccountToken) {
    throw new Error("Apple transaction is missing app account token");
  }

  if (
    !user.appleAccountToken ||
    transaction.appAccountToken !== user.appleAccountToken
  ) {
    throw new Error("Apple transaction does not belong to this user");
  }
};

const validateTransaction = ({ transaction, product }) => {
  if (transaction.productType !== "AUTO_RENEWABLE") {
    throw new Error("Apple transaction is not an auto-renewable subscription");
  }

  if (!transaction.transactionId) {
    throw new Error("Apple transaction is missing transactionId");
  }

  if (!transaction.originalTransactionId) {
    throw new Error("Apple transaction is missing originalTransactionId");
  }

  if (!transaction.purchaseDate) {
    throw new Error("Apple transaction is missing purchaseDate");
  }

  if (!transaction.expiresDate) {
    throw new Error("Apple transaction is missing expiresDate");
  }

  if (transaction.productId !== product.id) {
    throw new Error("Apple product mismatch");
  }
};

const validateCurrentOwnership = ({ user, transaction, renewalInfo }) => {
  if (
    transaction.appAccountToken &&
    transaction.appAccountToken !== user.appleAccountToken
  ) {
    throw new Error("Apple subscription ownership mismatch");
  }

  if (
    renewalInfo?.appAccountToken &&
    renewalInfo.appAccountToken !== user.appleAccountToken
  ) {
    throw new Error("Apple renewal ownership mismatch");
  }
};

const findMatchingSubscription = (
  subscriptionStatuses,
  originalTransactionId,
  productId,
) => {
  for (const group of subscriptionStatuses?.data ?? []) {
    for (const lastTransaction of group.lastTransactions ?? []) {
      if (
        lastTransaction.originalTransactionId === originalTransactionId &&
        lastTransaction.signedTransactionInfo
      ) {
        return lastTransaction;
      }
    }
  }

  throw new Error("Could not find matching Apple subscription status");
};

/**
 * Verify a purchase initiated by the Evolvo app.
 */
export const verifyAndSavePurchase = async ({
  userId,
  transactionId,
  environment = "production",
}) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  if (typeof transactionId !== "string" || !transactionId.trim()) {
    throw new Error("Invalid Apple transaction ID");
  }

  const normalizedEnvironment = normalizeEnvironment(environment);

  const user = await User.findById(userId).select(
    "_id email appleAccountToken",
  );

  if (!user) {
    throw new Error("User not found");
  }

  const appleClient = getAppleClient(normalizedEnvironment);

  /*
   * 1. Get transaction from Apple.
   */
  let transactionResponse;

  try {
    transactionResponse = await appleClient.getTransactionInfo(
      transactionId.trim(),
    );
  } catch (error) {
    if (error instanceof APIException) {
      console.error("Apple getTransactionInfo failed:", {
        status: error.httpStatusCode,
        apiError: error.apiError,
      });
    }

    throw new Error("Could not retrieve Apple transaction", { cause: error });
  }

  if (!transactionResponse?.signedTransactionInfo) {
    throw new Error("Apple response contains no transaction information");
  }

  /*
   * 2. Verify Apple's JWS.
   */
  const transaction = await verifyTransaction(
    transactionResponse.signedTransactionInfo,
    normalizedEnvironment,
  );

  if (transaction.transactionId !== transactionId.trim()) {
    throw new Error(
      "Apple transaction ID mismatch",
    );
  }

  /*
   * 3. Product validation.
   */
  const product = validateProduct(transaction.productId);

  /*
   * 4. Transaction validation.
   */
  validateTransaction({
    transaction,
    product,
  });

  /*
   * 5. Verify account ownership.
   */
  validateAccountToken(user, transaction);

  /*
   * 6. Get current subscription state.
   */
  let subscriptionStatuses;

  try {
    subscriptionStatuses = await appleClient.getAllSubscriptionStatuses(
      transaction.originalTransactionId,
    );
  } catch (error) {
    if (error instanceof APIException) {
      console.error("Apple getAllSubscriptionStatuses failed:", {
        status: error.httpStatusCode,
        apiError: error.apiError,
      });
    }

    throw new Error("Could not retrieve Apple subscription status", {
      cause: error,
    });
  }

  /*
   * 7. Find Apple's current transaction.
   */
  const matchingSubscription = findMatchingSubscription(
    subscriptionStatuses,
    transaction.originalTransactionId,
    transaction.productId,
  );

  /*
   * 8. Verify the current transaction again.
   */
  const currentTransaction = await verifyTransaction(
    matchingSubscription.signedTransactionInfo,
    normalizedEnvironment,
  );

  /*
   * 9. Verify renewal information.
   */
  let renewalInfo = null;

  if (matchingSubscription.signedRenewalInfo) {
    renewalInfo = await verifyRenewalInfo(
      matchingSubscription.signedRenewalInfo,
      normalizedEnvironment,
    );
  }

  /*
   * 10. Validate the current Apple subscription.
   */
  const currentProduct = validateProduct(currentTransaction.productId);

  validateTransaction({
    transaction: currentTransaction,
    product: currentProduct,
  });

  validateCurrentOwnership({
    user,
    transaction: currentTransaction,
    renewalInfo,
  });

  if (
    currentTransaction.originalTransactionId !==
    transaction.originalTransactionId
  ) {
    throw new Error("Apple subscription transaction mismatch");
  }

  /*
   * 11. Save subscription.
   */
  const subscription = await upsertSubscription({
    // ...existing code...
  });

  return subscription;
};

export const processAppleNotification = async (signedPayload) => {
  if (typeof signedPayload !== "string" || !signedPayload.trim()) {
    throw new Error("Missing Apple signed payload");
  }

  /*
   * The environment is contained inside the
   * signed notification itself.
   *
   * We therefore need to determine it after
   * verification.
   *
   * Apple sends the same V2 structure for
   * sandbox and production.
   */

  let notification;

  try {
    notification = await verifyNotification(signedPayload, "production");
  } catch {
    notification = await verifyNotification(signedPayload, "sandbox");
  }

  if (!notification.notificationUUID) {
    throw new Error("Apple notification is missing notificationUUID");
  }

  if (notification.version !== "2.0") {
    throw new Error("Unsupported Apple notification version");
  }

  const environment = normalizeEnvironment(
    notification.data?.environment ?? notification.environment,
  );

  /*
   * Idempotency.
   */
  let notificationRecord = await AppleNotification.findOne({
    notificationUUID: notification.notificationUUID,
  });

  if (notificationRecord?.processed === true) {
    return {
      duplicate: true,
      notificationType: notification.notificationType,
    };
  }

  /*
   * Create notification record if necessary.
   */
  if (!notificationRecord) {
    try {
      notificationRecord = await AppleNotification.create({
        notificationUUID: notification.notificationUUID,

        notificationType: notification.notificationType,

        subtype: notification.subtype ?? null,

        environment,

        signedDate: new Date(notification.signedDate),

        processed: false,
      });
    } catch (error) {
      /*
       * Another request may have created the
       * same notification simultaneously.
       */
      if (error.code === 11000) {
        notificationRecord = await AppleNotification.findOne({
          notificationUUID: notification.notificationUUID,
        });
      } else {
        throw error;
      }
    }
  }

  /*
   * TEST notifications have no subscription data.
   */
  if (notification.notificationType === "TEST") {
    notificationRecord.processed = true;
    notificationRecord.processedAt = new Date();
    notificationRecord.processingError = null;

    await notificationRecord.save();

    return {
      duplicate: false,
      test: true,
    };
  }

  /*
   * Some notification types don't contain
   * subscription transaction data.
   */
  if (!notification.data) {
    notificationRecord.processed = true;
    notificationRecord.processedAt = new Date();

    await notificationRecord.save();

    return {
      duplicate: false,
      ignored: true,
    };
  }

  const { signedTransactionInfo, signedRenewalInfo, status } =
    notification.data;

  if (!signedTransactionInfo) {
    notificationRecord.processed = true;
    notificationRecord.processedAt = new Date();

    await notificationRecord.save();

    return {
      duplicate: false,
      ignored: true,
    };
  }

  /*
   * Verify transaction.
   */
  const transaction = await verifyTransaction(
    signedTransactionInfo,
    environment,
  );

  const product = validateProduct(transaction.productId);

  validateTransaction({
    transaction,
    product,
  });

  /*
   * Verify renewal information if present.
   */
  let renewalInfo = null;

  if (signedRenewalInfo) {
    renewalInfo = await verifyRenewalInfo(signedRenewalInfo, environment);
  }

  const originalTransactionId = transaction.originalTransactionId;

  /*
   * Find existing Evolvo subscription.
   */
  const existingSubscription = await Subscription.findOne({
    provider: "apple",
    providerOriginalTransactionId: originalTransactionId,
  });

  let userId = existingSubscription?.userId;

  /*
   * If this is the first notification and we
   * don't know the subscription yet, use the
   * Apple appAccountToken.
   */
  if (!userId) {
    if (!transaction.appAccountToken) {
      throw new Error("Cannot associate Apple subscription with Evolvo user");
    }

    const user = await User.findOne({
      appleAccountToken: transaction.appAccountToken,
    }).select("_id");

    if (!user) {
      throw new Error("No Evolvo user found for Apple account token");
    }

    userId = user._id;
  }

  /*
   * Do not let old notifications overwrite
   * newer subscription state.
   */
  const signedDate = notification.signedDate
    ? new Date(notification.signedDate)
    : null;

  if (
    existingSubscription?.providerSignedDate &&
    signedDate &&
    signedDate <= existingSubscription.providerSignedDate
  ) {
    notificationRecord.processed = true;
    notificationRecord.processedAt = new Date();

    notificationRecord.originalTransactionId = originalTransactionId;

    await notificationRecord.save();

    return {
      duplicate: false,
      stale: true,
    };
  }

  /*
   * Persist subscription state.
   */
  const subscription = await upsertSubscription({
    userId,

    provider: "apple",

    productId: transaction.productId,

    status: mapAppleStatus(status),

    startedAt: new Date(transaction.purchaseDate),

    expiresAt: new Date(transaction.expiresDate),

    autoRenew: getAutoRenew(renewalInfo),

    providerTransactionId: transaction.transactionId,

    providerOriginalTransactionId: originalTransactionId,

    environment,

    providerSignedDate: signedDate,

    rawProviderData: null,
  });

  notificationRecord.processed = true;
  notificationRecord.processedAt = new Date();
  notificationRecord.processingError = null;
  notificationRecord.originalTransactionId = originalTransactionId;

  await notificationRecord.save();

  return {
    duplicate: false,
    subscription,
  };
};
