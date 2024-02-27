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
         const botForwardedMassage = await ctx.telegram.forwardMessage(configService.get('CHAT_ID'),
             ctx.from.id, ctx.message.message_id);

         const origUserText = (ctx.message as any)['text'] ?? '';
         if (!ctx.session) ctx.session = [];

         ctx.session.push({
            messageFromUserInfo: {
               chatId: ctx.chat.id,
               id: ctx.message.message_id,
               mText: origUserText,
            },
            buttonMessageId: 0,
            botForwardedMessageId: botForwardedMassage.message_id,
         });

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
   const curentMsgId = (ctx.message && ctx.message.message_id) ?? -1;
   const currentSession: SessionData | undefined = ctx.session.find((session: SessionData) =>
       session.messageFromUserInfo.id === curentMsgId);

   if (!currentSession) {
      console.error('currentSession is Undefined');
      return
   }

   const keyboardMarkup = Markup.inlineKeyboard([
      Markup.button.callback('Other', 'other'),
      Markup.button.callback('Add', 'add')
   ]);

   const message = await ctx.reply(currentSession.messageFromUserInfo.mText,
       keyboardMarkup);
   currentSession.buttonMessageId = message.message_id;
});

// Handle button actions Clear all messages in the chat
bot.action('other', async (ctx: ICtxInterface): Promise<void> => {
   const buttonRetaledMsgId = ctx?.callbackQuery?.message?.message_id ?? -1;

   const currentSession: SessionData | undefined = ctx.session.find((session: SessionData) =>
       session.buttonMessageId === buttonRetaledMsgId);

   if (!currentSession) {
      console.error('currentSession is Undefined when delete');
      return
   }
   try {
         await ctx.telegram.deleteMessage(currentSession.messageFromUserInfo.chatId, currentSession.messageFromUserInfo.id);
         await ctx.telegram.deleteMessage(currentSession.messageFromUserInfo.chatId, currentSession.botForwardedMessageId);
         await ctx.telegram.deleteMessage(currentSession.messageFromUserInfo.chatId, currentSession.buttonMessageId);
         console.log('All messages cleared successfully');
   } catch (error) {
      console.error('Error clearing messages:', error);
   }
});

bot.action('add', ctx => {
   // Do nothing for the 'add' button
   return;
});
bot.launch().then(() => {
});
