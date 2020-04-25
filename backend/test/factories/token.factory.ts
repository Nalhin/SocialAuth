import { User } from '../../src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../src/config/jwt.config';

const jwtService = new JwtService(jwtConfig());

export function tokenFactory(user: Partial<User>) {
  return jwtService.sign({ ...user });
}

export function authHeaderFactory(user: Partial<User>) {
  const token = tokenFactory(user);
  return `Bearer ${token}`;
}
