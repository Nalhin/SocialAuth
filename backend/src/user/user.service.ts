import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  save(user: Partial<User>): Promise<User> {
    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ username });
  }

  async remove(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ id });
    return this.usersRepository.remove(user);
  }

  existsByCredentials(user: Partial<User>): Promise<boolean> {
    return this.usersRepository.existsByEmailOrUsername(
      user.email,
      user.password,
    );
  }
}
