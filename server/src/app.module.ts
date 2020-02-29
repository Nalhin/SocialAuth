import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { GraphQLConfig } from './gqlConfig';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'SocialMedia',
      synchronize: true,
      autoLoadEntities: true,
    }),
    GraphQLModule.forRoot(GraphQLConfig),
    UserModule,
  ],
})
export class AppModule {}
