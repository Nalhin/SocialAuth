import { EntityRepository, Repository } from 'typeorm';
import { SocialAuthProvider } from './auth.entity';
import { User } from '../user/user.entity';

@EntityRepository(SocialAuthProvider)
export class SocialAuthProviderRepository extends Repository<
  SocialAuthProvider
> {
  findUserBySocialId(socialId: string): Promise<User> {
    return this.createQueryBuilder('provider')
      .select('provider.user')
      .where('provider.socialId = :socialId', { socialId })
      .getRawOne();
  }

  async existsBySocialId(socialId: string): Promise<boolean> {
    const count = await this.createQueryBuilder('provider')
      .where('provider.socialId = :socialId', { socialId })
      .getCount();
    return count > 0;
  }

  saveProviderAndUser(
    user: Partial<User>,
    provider: Partial<SocialAuthProvider>,
  ) {
    return this.manager.transaction(async (transactionalManager) => {
      const createdUser = await transactionalManager.create(User, user);
      const savedUser = await transactionalManager.save(createdUser);
      await transactionalManager.save(SocialAuthProvider, {
        user: savedUser,
        ...provider,
      });
      return savedUser;
    });
  }
}
