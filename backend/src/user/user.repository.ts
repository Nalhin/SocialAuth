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
}
