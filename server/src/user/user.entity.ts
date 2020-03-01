import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id: number;

  @Field()
  @Column('varchar', { unique: true })
  public username: string;

  @Field()
  @Column('varchar')
  public email: string;

  @Column('varchar')
  public password: string;
}
