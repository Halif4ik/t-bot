import {Telegraf} from 'telegraf';


// Initialize your bot with your Telegram Bot API token
const bot = new Telegraf(myToken,{});

// Middleware to forward incoming messages to a specific user or chat
bot.use(async (ctx, next) => {
   try {
      // Forward the incoming message to a specific user or chat
      await ctx.telegram.forwardMessage(chatId, ctx.from.id, ctx.message.message_id);
      console.log('Message forwarded successfully');
   } catch (error) {
      console.error('Error forwarding message:', error);
   }
   // Continue handling other middleware or actions
   next();
});

// Start listening for incoming messages
bot.launch().then(() => {
   console.log('Bot started');
});
