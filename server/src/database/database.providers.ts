import { createConnection } from 'typeorm';
import {DATABASE_CONNECTION} from "./database.constants";

export const databaseProviders = [
    {
        provide: DATABASE_CONNECTION,
        useFactory: async () => await createConnection({
            type: 'postgres',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'test',
            entities: [
                __dirname + '/../**/*.entity{.ts,.js}',
            ],
            synchronize: true,
        }),
    },
];