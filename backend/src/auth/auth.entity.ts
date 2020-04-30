import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { registerEnumType } from '@nestjs/graphql';

export enum SocialAuthProviders {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

registerEnumType(SocialAuthProviders, {
  name: 'SocialAuthProviders',
});

@Entity()
export class AuthProviders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: SocialAuthProviders })
  provider: SocialAuthProviders;

  @Column()
  socialId: string;

  @ManyToOne((type) => User)
  user: User;
}
