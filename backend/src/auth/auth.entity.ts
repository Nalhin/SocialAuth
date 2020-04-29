import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum SocialAuthTypes {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

@Entity()
export class AuthProviders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: SocialAuthTypes })
  type: SocialAuthTypes;

  @Column()
  providerId: string;
}
