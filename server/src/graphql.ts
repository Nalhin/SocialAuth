
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export interface UserLoginInput {
    username: string;
    password: string;
}

export interface UserRegisterInput {
    username: string;
    password: string;
    email: string;
}

export interface IMutation {
    createUser(input: UserRegisterInput): User | Promise<User>;
    removeUser(username: string): User | Promise<User>;
}

export interface IQuery {
    users(): User[] | Promise<User[]>;
    user(username: string): User | Promise<User>;
}

export interface User {
    id: string;
    username: string;
    email: string;
}
