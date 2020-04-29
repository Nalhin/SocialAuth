import { EntityRepository, Repository } from 'typeorm';
import { AuthProviders } from './auth.entity';

@EntityRepository(AuthProviders)
export class AuthProvidersRepository extends Repository<AuthProviders> {}
