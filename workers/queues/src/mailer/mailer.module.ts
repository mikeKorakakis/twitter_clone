import * as path from 'path';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailProcessor } from './mail-queue.processor';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [
                ConfigModule
            ],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    host: configService.get('SMTP_USER'),
                    port: configService.get('SMTP_PORT'),
                    auth: {
                        user: configService.get('SMTP_USER'),
                        pass: configService.get('SMTP_PASSWORD')
                    }
                },
                defaults: {
                    from: '"Mike Korakakis" <no-reply@mike.korakakis@gmail.com>', // outgoing email ID
                },
                template: {
                    dir: path.join(__dirname, 'templates/pages'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                },
                options: {
                    partials: {
                        dir: path.join(__dirname, 'templates/partials'),
                        options: {
                            strict: true
                        }
                    }
                }
            })
        })
    ],
    providers: [
        MailProcessor
    ]
})
export class MailModule {}