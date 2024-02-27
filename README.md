# Telegram Bot with Telegraf

This is a simple Telegram bot created using the Telegraf library in Node.js. The bot forwards incoming messages to a
specific user or chat.

## Prerequisites

Before running the bot, ensure you have the following installed on your machine:

- Node.js
- npm or Yarn
- TypeScript (if you're using TypeScript)

## Getting Started

1. Clone this repository to your local machine.

2. Install dependencies using npm or Yarn:

   ```bash
   npm install
   # or
   yarn install
    ```
3. Create a .env file in the root directory of the project and add the following environment variables:
   TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
   CHAT_ID=TARGET_CHAT_ID
4. Running the Bot
   To run the bot, execute the following command:

```bash
Copy code
npm run dev
# or
yarn dev
```
The bot should now be running and forwarding incoming messages to the specified chat.

