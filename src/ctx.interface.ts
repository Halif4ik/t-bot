import {Context} from "telegraf";

export interface SessionData {
   messageFromUserInfo: {
      chatId: number,
      id: number
      mText: string
   }
   buttonMessageId: number
   botForwardedMessageId: number
}

export interface ICtxInterface extends Context {
   session: SessionData[]
}
