import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { registerEnumType } from '@nestjs/graphql';

export enum SocialAuthProviderTypes {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

registerEnumType(SocialAuthProviderTypes, {
  name: 'SocialAuthProviders',
});

@Entity()
export class SocialAuthProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: SocialAuthProviderTypes })
  provider: SocialAuthProviderTypes;

  @Column({ unique: true })
  socialId: string;

  @ManyToOne((_type) => User)
  user: User;

  @CreateDateColumn()
  created: Date;
}
