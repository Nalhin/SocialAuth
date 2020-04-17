import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { AddPostInput } from './input/add-post.input';
import { User } from '../user/user.entity';
import { parseTags } from './post.utils';
import { Tag } from '../tag/tag.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async save(post: AddPostInput, user: User): Promise<Post> {
    const parsedTags = parseTags(post.content);
    const tags = await Promise.all(
      parsedTags.map(async tag => {
        const foundTag = await this.tagsRepository.findOne({ name: tag.name });
        if (foundTag) {
          return foundTag;
        }
        const newTag = new Tag();
        newTag.name = tag.name;
        return newTag;
      }),
    );
    return this.postsRepository.save({ ...post, author: user, tags });
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async upvote(postId: number, user: User): Promise<Post> {
    const post = await this.postsRepository.findOne(postId);
    if (!post) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Post not found.',
        },
        404,
      );
    }
    post.upvotedBy.push(user);
    return this.postsRepository.save(post);
  }
}
