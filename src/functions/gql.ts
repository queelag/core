/**
 * Hack to trigger code formatting on GraphQL queries.
 */
export function gql(query: TemplateStringsArray): string {
  return query[0]
}
