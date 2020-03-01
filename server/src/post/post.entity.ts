import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { User } from '../user/user.entity';

@ObjectType()
@Entity()
export class Post {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column('varchar')
  public content: string;

  @Field(type => User)
  @OneToOne(type => User)
  @JoinColumn()
  public author: User;

  @Field()
  @CreateDateColumn()
  public creationDate: Date;
}
