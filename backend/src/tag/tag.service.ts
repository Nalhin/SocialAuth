import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { User } from '../user/user.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  findAll(): Promise<Tag[]> {
    return this.tagsRepository.find();
  }

  async addFollower(user: User, tagId: number): Promise<Tag> {
    const tag = await this.tagsRepository.findOne(tagId);
    if (!tag) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Tag not found.',
        },
        404,
      );
    }
    tag.followers.push(user);
    return this.tagsRepository.save(tag);
  }
}
