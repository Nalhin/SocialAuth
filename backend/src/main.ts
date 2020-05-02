import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT', ''));

  if (module.hot) {
    module.hot.accept();
    await module.hot.dispose(() => app.close());
  }
}

bootstrap();
