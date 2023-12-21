import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { FetchError, GraphQlAPI, GraphQlApiResponse, gql, tie } from '../../src'
import { closeServer, openServer } from '../server'

const QUERY_GET_TEXT: string = gql`
  query getText {
    text
  }
`

const MUTATION_SET_TEXT: string = gql`
  mutation setText($text: String!) {
    setText(text: $text) {
      text
    }
  }
`
// jest.setTimeout(900719925)

describe('GraphQlAPI', () => {
  let address: string, api: GraphQlAPI, response: GraphQlApiResponse<any> | FetchError<any>

  beforeAll(async () => {
    address = await openServer(3002)
  })

  beforeEach(() => {
    api = new GraphQlAPI(address + '/graphql')
  })

  afterAll(async () => {
    await closeServer()
  })

  it('queries', async () => {
    response = await api.query(QUERY_GET_TEXT)
    expect(tie<GraphQlApiResponse>(response).data.data).toMatchObject({ text: 'hello' })
  })

  it('mutates', async () => {
    response = await api.mutation(MUTATION_SET_TEXT, { text: 'hello' })
    expect(tie<GraphQlApiResponse>(response).data.data).toMatchObject({ setText: { text: 'hello' } })
  })
})
