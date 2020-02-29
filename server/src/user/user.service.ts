import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserRegisterInput } from '../graphql';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  save(user: UserRegisterInput): Promise<User> {
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne(username);
  }

  async remove(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    return this.usersRepository.remove(user);
  }
}
