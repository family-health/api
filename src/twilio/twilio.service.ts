import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class TwilioService {
    private readonly twilioClient: Twilio.Twilio;

    constructor() {
        this.twilioClient = Twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN,
        );

    }

    async sendSMS(to: string, body: string) {
        try {
            const message = await this.twilioClient.messages.create({
                body: 'test desde web',
                from: '+12707166551',
                to: '+593967433809'
            });

            return message;
        } catch (error) {
            console.error('Error sending SMS via Twilio:', error);
            throw error;
        }
    }

    async sendWhatsAppMessage(to: string, body: string) {
        try {
            const message = await this.twilioClient.messages.create({
                body,
                to: `whatsapp:${to}`,
                from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            });

            return message;
        } catch (error) {
            console.error('Error sending WhatsApp message via Twilio:', error);
            throw error;
        }
    }
}