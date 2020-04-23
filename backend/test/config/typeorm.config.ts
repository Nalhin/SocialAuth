import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmTestConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'pwd',
      database: 'SocialMediaTest',
      synchronize: true,
      autoLoadEntities: true,
      keepConnectionAlive: true,
    };
  }
}
