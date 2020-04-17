import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { graphqlConfig } from './graphql.config';
import { PostResolver } from './post/post.resolver';
import { PostService } from './post/post.service';
import { PostModule } from './post/post.module';
import { TagResolver } from './tag/tag.resolver';
import { TagService } from './tag/tag.service';
import { TagModule } from './tag/tag.module';

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
    GraphQLModule.forRoot(graphqlConfig),
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    PostModule,
    TagModule,
  ],
  providers: [PostResolver, PostService, TagResolver, TagService],
})
export class AppModule {}
