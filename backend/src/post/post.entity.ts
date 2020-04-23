import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Tag } from '../tag/tag.entity';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Post {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  content: string;

  @Field(type => User)
  @ManyToOne(type => User)
  @JoinColumn()
  author: User;

  @Field()
  @CreateDateColumn()
  created: Date;

  @Field(type => [Tag])
  @ManyToMany(
    type => Tag,
    tag => tag.posts,
    {
      cascade: ['insert', 'update'],
    },
  )
  tags: Tag[];

  @Field(type => [User], { nullable: false })
  @ManyToMany(type => User)
  upvotedBy: User[];
}
