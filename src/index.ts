/*
    AWS lambda function: Saba Webhook Gateway for Google Chat
    Copyright 2023 Kenshi Muto <kmuto@kmuto.jp>
*/
import { SabaWebhookGatewayGoogleChat } from "./SabaWebhookGatewayGoogleChat.js";

export const handler = async(event :any) => {
    const swg = new SabaWebhookGatewayGoogleChat();
    const h = swg.parse(event.body);
    if (h) {
        swg.run(h);
        return 204;
    }
    return 500;
};