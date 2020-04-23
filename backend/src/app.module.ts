import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostResolver } from './post/post.resolver';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';
import { TagResolver } from './tag/tag.resolver';
import { TagService } from './tag/tag.service';
import { TagModule } from './tag/tag.module';
import { GraphqlConfigService } from './config/graphql.config';
import { join } from 'path';
import { TypeOrmConfigService } from './config/typeorm.config';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GraphqlConfigService,
    }),
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', '..', '.env'),
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UserModule,
    AuthModule,
    PostModule,
    TagModule,
  ],
  providers: [PostResolver, PostService, TagResolver, TagService],
})
export class AppModule {}
