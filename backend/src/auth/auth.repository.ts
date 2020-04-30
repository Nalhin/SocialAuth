import { EntityRepository, Repository } from 'typeorm';
import { AuthProviders } from './auth.entity';
import { User } from '../user/user.entity';

@EntityRepository(AuthProviders)
export class AuthProvidersRepository extends Repository<AuthProviders> {
  findUserBySocialId(socialId: string): Promise<User> {
    return this.createQueryBuilder('provider')
      .select('provider.user')
      .where('provider.socialId = :socialId', { socialId })
      .getRawOne();
  }
}
