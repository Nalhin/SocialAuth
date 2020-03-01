export const graphqlTestConfig = {
  typePaths: ['./**/*.graphql'],
  context: ({ req }) => ({ req }),
};
