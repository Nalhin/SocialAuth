import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { registerEnumType } from '@nestjs/graphql';

export enum SocialProviderTypes {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

registerEnumType(SocialProviderTypes, {
  name: 'SocialAuthProviders',
});

@Entity()
export class SocialProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: SocialProviderTypes })
  provider: SocialProviderTypes;

  @Column({ unique: true })
  socialId: string;

  @ManyToOne((_type) => User, (user) => user.socialProviders)
  user: User;

  @CreateDateColumn()
  created: Date;
}
