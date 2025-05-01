import type { NextConfig } from "next";

const nextConfig: NextConfig = {
env: {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB: process.env.MONGODB_DB,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  AWS_SES_FROM_EMAIL: process.env.AWS_SES_FROM_EMAIL,
  WOOVI_API_KEY: process.env.WOOVI_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  EMAIL_TEMPLATE_DIR: process.env.EMAIL_TEMPLATE_DIR,
  ENABLE_PAYMENTS: process.env.ENABLE_PAYMENTS,
  ENABLE_EMAIL_NOTIFICATIONS: process.env.ENABLE_EMAIL_NOTIFICATIONS,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_MODEL: process.env.OPENAI_MODEL,
  OPENAI_MAX_TOKENS: process.env.OPENAI_MAX_TOKENS,
  OPENAI_TEMPERATURE: process.env.OPENAI_TEMPERATURE,
  OPENAI_CONTENT_VALIDATION_PROMPT: process.env.OPENAI_CONTENT_VALIDATION_PROMPT,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
},
  output: 'standalone',
  /* config options here */
};

export default nextConfig;
