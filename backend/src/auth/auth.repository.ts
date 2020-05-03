import { EntityRepository, Repository } from 'typeorm';
import { SocialProvider } from './auth.entity';
import { User } from '../user/user.entity';

@EntityRepository(SocialProvider)
export class SocialProviderRepository extends Repository<SocialProvider> {
  async existsBySocialId(socialId: string): Promise<boolean> {
    const count = await this.createQueryBuilder('provider')
      .where('provider.socialId = :socialId', { socialId })
      .getCount();
    return count > 0;
  }

  saveProviderAndUser(user: Partial<User>, provider: Partial<SocialProvider>) {
    return this.manager.transaction(async (transactionalManager) => {
      const createdUser = await transactionalManager.create(User, user);
      const savedUser = await transactionalManager.save(createdUser);
      await transactionalManager.save(SocialProvider, {
        user: savedUser,
        ...provider,
      });
      return savedUser;
    });
  }
}
