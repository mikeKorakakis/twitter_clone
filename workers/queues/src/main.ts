import { config } from 'dotenv'
config()
import { NestFactory } from '@nestjs/core'
import { INestApplicationContext, Logger } from '@nestjs/common'

import { AppModule } from './app.module'
import { AppService } from './app.service'
import { ConfigService } from '@nestjs/config'

export async function bootstrap(): Promise<INestApplicationContext> {
    const app = await NestFactory.createApplicationContext(AppModule)
    const configService = app.get<ConfigService>(ConfigService);
    console.log(configService.get('SMTP_USER'))
    const logger = new Logger('WorkerMain')
    const appService = app.get(AppService)

    logger.log(appService.getMessage())

    return app
}

void bootstrap().catch(err => {
    console.error(err)
    process.exit(1)
})