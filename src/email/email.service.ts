import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {

    async sendEmail(to: string, subject: string, text: string, html: string) {

        const transporter = nodemailer.createTransport({
            host: 'mail.ebit-software.com',
            port: 587,
            secure: false,
            auth: {
                user: 'no-reply@ebit-software.com',
                pass: '^Im~CwP8Hp7Q',
            },
            tls: {
                rejectUnauthorized: false,
            },
        });


        const mailOptions = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: to,
            subject,
            text,
            html,
        };

        await transporter.sendMail(mailOptions);
    }

}
