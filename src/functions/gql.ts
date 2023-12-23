/**
 * The `gql` function is a dirty hack to get editor features for GraphQL queries without using the real GraphQL parser.
 */
export function gql(query: TemplateStringsArray): string {
  return query[0]
}
