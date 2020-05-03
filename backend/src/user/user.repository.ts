import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async existsByEmailOrUsername(
    email: string,
    username: string,
  ): Promise<boolean> {
    const count = await this.createQueryBuilder()
      .where('email = :email', { email })
      .orWhere('username = :username', { username })
      .getCount();

    return count > 0;
  }

  findOneBySocialId(socialId: string): Promise<User | undefined> {
    return this.createQueryBuilder('user')
      .leftJoinAndSelect('user.socialProviders', 'providers')
      .where('providers.socialId = :socialId', { socialId })
      .getOne();
  }
}
