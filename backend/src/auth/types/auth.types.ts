import { SocialAuthProviders } from '../auth.entity';

export const AuthTypes = {
  ...SocialAuthProviders,
  JWT: 'JWT',
};
