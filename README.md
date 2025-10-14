# [socialbio.io](https://www.socialbio.io/)

This project generates social media bios for multiple platforms using Together AI.

[![Social Media Bio Generator](./public/screenshot.png)](https://www.socialbio.io)

## How it works

This project uses both [Mixtral 8x7B](https://api.together.xyz/playground/chat/mistralai/Mixtral-8x7B-Instruct-v0.1) and [Llama 3.1 8B](https://api.together.xyz/playground/chat/meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo) with streaming to generate social media bios for various platforms including Twitter/X, Instagram, LinkedIn, Facebook, TikTok, Threads, and Bluesky. It constructs platform-specific prompts based on the form and user input, sends it either to the [Together.ai](https://togetherai.link/) API, then streams the response back to the application.

## Supported Platforms

- **Twitter/X**: 160 characters, supports hashtags and emojis
- **Instagram**: 150 characters, supports hashtags and emojis
- **LinkedIn**: 220 characters, professional tone, no hashtags or emojis
- **Facebook**: 101 characters, supports emojis but not hashtags
- **TikTok**: 80 characters, supports hashtags and emojis, trendy tone
- **Threads**: 150 characters, supports hashtags and emojis
- **Bluesky**: 256 characters, supports hashtags and emojis

If you'd like to see how the original Twitter-only version was built with GPT 3.5, check out the [video](https://youtu.be/JcE-1xzQTE0) or [blog post](https://vercel.com/blog/gpt-3-app-next-js-vercel-edge-functions).

## Running Locally

1. Create a `.env` file, make an account at [Together.ai](https://togetherai.link/), and add your API key under `TOGETHER_API_KEY`
2. Run the application with `npm run dev` and it will be available at `http://localhost:3000`.

## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/socialbio-generator/socialbio&env=TOGETHER_API_KEY&project-name=social-bio-generator&repo-name=socialbio)
