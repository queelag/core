/**
 * The `gql` function is a dirty hack to get editor features for GraphQL queries without using the real GraphQL parser.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/functions/gql)
 */
export function gql(query: TemplateStringsArray): string {
  return query[0]
}
