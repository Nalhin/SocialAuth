import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { GraphqlConfigService } from './config/graphql.config';
import { join } from 'path';
import { TypeOrmConfigService } from './config/typeorm.config';
import { envSchema } from './config/env.schema';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GraphqlConfigService,
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: !!process.env.CI,
      envFilePath: join(__dirname, '..', '..', '.env'),
      validationSchema: envSchema,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UserModule,
    AuthModule,
    PostModule,
  ],
  providers: [],
})
export class AppModule {}
