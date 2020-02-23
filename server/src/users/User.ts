import {BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import bcrypt from 'bcrypt'

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public login: string;

  @Column()
  public name: string;

  @Column({ select: false })
  public password: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
  }

}
