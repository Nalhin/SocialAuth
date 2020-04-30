import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { join } from 'path';

@Injectable()
export class GraphqlConfigService implements GqlOptionsFactory {
  createGqlOptions(): GqlModuleOptions {
    return {
      autoSchemaFile: join(process.cwd(), '..', 'schema.graphql'),
      context: ({ req, res }) => ({ req, res }),
      debug: process.env.NODE_ENV === 'development',
      playground: process.env.NODE_ENV === 'development',
    };
  }
}
