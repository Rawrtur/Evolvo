import rateLimit from "express-rate-limit"

export const limiter = rateLimit({
    windowMs: 15*60*1000, // 15 Minuten
    max: 100,
    message: "You reached the limit of requests"
})

export const authLimiter = rateLimit({
    windowMs: 10*60*1000, // 10 Minuten
    max: 5,
    message: "You reached the limit of requests"
})

