import { Connection, Repository } from 'typeorm';
import { User } from './user.entity';
import {DATABASE_CONNECTION} from "../database/database.constants";

export const photoProviders = [
    {
        provide: 'USER_REPOSITORY',
        useFactory: (connection: Connection) => connection.getRepository(User),
        inject: [DATABASE_CONNECTION],
    },
];