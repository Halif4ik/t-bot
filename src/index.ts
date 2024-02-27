import {Markup, session, Telegraf} from 'telegraf';
import {ConfigService} from "./config/config.service";
import {ICtxInterface, SessionData} from "./ctx.interface.js";

const configService: ConfigService = new ConfigService();
const bot: Telegraf<ICtxInterface> = new Telegraf(configService.get('MY_TOKEN'), {});

bot.use(session())
// Middleware to forward incoming messages to a specific user or chat
bot.use(async (ctx: ICtxInterface, next): Promise<void> => {
   try {
      if (ctx.from && ctx.message && ctx.chat) {

         const botForwardedMassage = await ctx.telegram.forwardMessage(configService.get('CHAT_ID'), ctx.from.id,
             ctx.message.message_id);

         const origUserText = (botForwardedMassage as any)['text'];

         if (!ctx.session) ctx.session = {
            CTAButton: {other: false},
            messageFromUserInfo: {
               chatId: ctx.chat.id,
               messageId: 0,
               messageText: origUserText ?? ''
            },
            buttonMessageId: 0,
            botForwardedMessageId: botForwardedMassage.message_id,
         };
         ctx.session.botForwardedMessageId = botForwardedMassage.message_id;

      } else {
         console.log('ctx.from and ctx.message is undefined');
      }
   } catch (error) {
      console.error('Error forwarding message:', error);
   }
   await next();
});

// Attach buttons to messages and store messages information in session
bot.on('text', async (ctx: ICtxInterface): Promise<void> => {
   if (!ctx.session || !ctx.chat || !ctx.message || !ctx.chat.id || !ctx.message.message_id) {
      console.error('Chat id or message id is undefined');
      return;
   }
   const currentSession: SessionData = ctx.session;

   currentSession.messageFromUserInfo.messageId = ctx.message.message_id;

   const keyboardMarkup = Markup.inlineKeyboard([
      Markup.button.callback('Other', 'other'),
      Markup.button.callback('Add', 'add')
   ]);

   const message = await ctx.reply(currentSession.messageFromUserInfo.messageText,
       keyboardMarkup);
   currentSession.buttonMessageId = message.message_id;
});

// Handle button actions Clear all messages in the chat
bot.action('other', async (ctx: ICtxInterface): Promise<void> => {
   try {
      if (ctx.session && ctx.session.messageFromUserInfo && ctx.session.messageFromUserInfo.chatId && ctx.session.messageFromUserInfo.messageId) {
         await ctx.telegram.deleteMessage(ctx.session.messageFromUserInfo.chatId, ctx.session.messageFromUserInfo.messageId);
         await ctx.telegram.deleteMessage(ctx.session.messageFromUserInfo.chatId, ctx.session.buttonMessageId);
         await ctx.telegram.deleteMessage(ctx.session.messageFromUserInfo.chatId, ctx.session.botForwardedMessageId);
         console.log('All messages cleared successfully');
      }
   } catch (error) {
      console.error('Error clearing messages:', error);
   }
});

bot.action('add', async (ctx: ICtxInterface) => {
   // Do nothing for the 'add' button
});
bot.launch().then(() => {
});
