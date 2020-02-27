import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column('text')
    public login: string;

    @Column('text')
    public name: string;

    @Column({select: false, type: 'text'})
    public password: string;
}