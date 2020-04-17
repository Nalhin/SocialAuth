import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { Tag } from '../tag/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag])],
  providers: [PostResolver, PostService],
  exports: [TypeOrmModule, PostService],
})
export class PostModule {}
