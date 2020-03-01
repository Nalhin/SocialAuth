export const graphqlConfig = {
  autoSchemaFile: '../schema.graphql',
  context: ({ req }) => ({ req }),
};
