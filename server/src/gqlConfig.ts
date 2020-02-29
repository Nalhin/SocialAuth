import { join } from 'path';

export const GraphQLConfig = {
  typePaths: ['./**/*.graphql'],
  definitions: {
    path: join(process.cwd(), 'src/graphql.ts'),
  },
};
