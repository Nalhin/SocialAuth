import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: 500, unique: true })
  public username: string;

  @Column('varchar', { select: false })
  public password: string;

  @Column('varchar')
  public email: string;
}
