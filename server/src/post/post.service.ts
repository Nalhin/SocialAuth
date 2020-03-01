import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { AddPostInput } from './input/add-post.input';
import { User } from '../user/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  save(post: AddPostInput, user: User): Promise<Post> {
    return this.postsRepository.save({ ...post, author: user });
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }
}
