import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';
import { AddPostInput } from './input/add-post.input';
import { User } from '../user/user.entity';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postsRepository: PostRepository) {
  }

  async save(post: AddPostInput, user: User): Promise<Post> {
    return this.postsRepository.save({ ...post, author: user });
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find({ relations: ['author'] });
  }
}
