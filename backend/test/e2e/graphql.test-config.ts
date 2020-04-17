export const graphqlTestConfig = {
  autoSchemaFile: '../../schema.graphql',
  context: ({ req }) => ({ req }),
};
