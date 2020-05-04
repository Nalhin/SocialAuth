import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsEmail, MinLength } from 'class-validator';
import { SocialProvider } from '../auth/auth.entity';

@ObjectType()
@Entity()
export class User {
  @Field((_type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @MinLength(3)
  @Field()
  @Column({ unique: true })
  username: string;

  @IsEmail()
  @Field()
  @Column({ unique: true })
  email: string;

  @MinLength(6)
  @Column()
  password: string;

  @OneToMany((_type) => SocialProvider, (socialProvider) => socialProvider.user)
  socialProviders: SocialProvider;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
