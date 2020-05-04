import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  save(user: Partial<User>): Promise<User> {
    const preparedUser = this.usersRepository.create(user);
    return this.usersRepository.save(preparedUser);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneOrFail({ username });
  }

  findOneBySocialId(socialId: string): Promise<User | undefined> {
    return this.usersRepository.findOneBySocialId(socialId);
  }

  async remove(id: number): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({ id });
    return this.usersRepository.remove(user);
  }

  existsByCredentials(
    user: Pick<User, 'email' | 'username'>,
  ): Promise<boolean> {
    return this.usersRepository.existsByEmailOrUsername(
      user.email,
      user.username,
    );
  }
}
