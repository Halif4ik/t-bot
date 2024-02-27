import {Context} from "telegraf";

export interface SessionData {
   CTAButton: {
      other: boolean,
      add?: boolean,
   }
   messageFromUserInfo: {
      chatId: number,
      messageId: number
      messageText: string
   }
   buttonMessageId: number
   botForwardedMessageId: number
}

export interface ICtxInterface extends Context {
   session: SessionData
}
