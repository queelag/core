import { FetchError, gql, GraphQLAPI, GraphQLAPIResponse, tie } from '../../src'
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
jest.setTimeout(900719925)

describe('GraphQLAPI', () => {
  let address: string, api: GraphQLAPI, response: GraphQLAPIResponse<any> | FetchError<any>

  beforeAll(async () => {
    address = await openServer(3002)
  })

  beforeEach(() => {
    api = new GraphQLAPI(address + '/graphql')
  })

  afterAll(async () => {
    await closeServer()
  })

  it('queries', async () => {
    response = await api.query(QUERY_GET_TEXT)
    expect(tie<GraphQLAPIResponse>(response).data.data).toMatchObject({ text: 'hello' })
  })

  it('mutates', async () => {
    response = await api.mutation(MUTATION_SET_TEXT, { text: 'hello' })
    expect(tie<GraphQLAPIResponse>(response).data.data).toMatchObject({ setText: { text: 'hello' } })
  })
})
