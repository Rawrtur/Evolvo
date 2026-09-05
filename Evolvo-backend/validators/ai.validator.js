import AIUsage from "../models/ai-usage.model.js";

async function getUsedTokens(userId, periodStart) {
  const result = await AIUsage.aggregate([
    {
      $match: {
        user: userId,
        createdAt: { $gte: periodStart }, // z. B. Monatsanfang
      },
    },
    {
      $group: {
        _id: null,
        totalTokens: { $sum: "$totalTokens" },
      },
    },
  ]);

  return result[0]?.totalTokens || 0;
}

async function checkTokenLimit(userId, limit) {
  const monatsanfang = new Date();
  monatsanfang.setDate(1);
  monatsanfang.setHours(0, 0, 0, 0);

  const usedTokens = await getUsedTokens(userId, monatsanfang);

  return {
    used: usedTokens,
    limit,
    remaining: Math.max(0, limit - usedTokens),
    exceeded: usedTokens >= limit,
  };
}

export const validatePrompt = async (req, res, next) => {
  const { topic } = req.body;

  if (typeof topic !== "string" || topic.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Topic is required.",
    });
  }

  if (topic.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Input is to large.",
    });
  }

  const userLimit = 3000;
  const { exceeded, remaining } = await checkTokenLimit(
    req.user._id,
    userLimit,
  );

  if (exceeded) {
    return res.status(429).json({
      error: "No Tokens available",
      remaining: 0,
    });
  }

  req.tokenInfo = { remaining };
  next();
};
