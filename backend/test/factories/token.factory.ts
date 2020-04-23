import { User } from '../../src/user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { jwtOptions } from '../../src/auth/jwt.constants';

export function tokenFactory(user:Partial<User>){
  const jwtService = new JwtService(jwtOptions);
  return jwtService.sign({ ...user })
}

export function authHeaderFactory(user:Partial<User>){
  const token = tokenFactory(user)
  return `Bearer ${token}`
}
