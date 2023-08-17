import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import mercurius from 'mercurius'

const server: FastifyInstance = fastify({ logger: false })

/**
 * GRAPHQL
 */
server.register(mercurius, {
  graphiql: true,
  schema: `
    type Mutation {
      setText(text: String!): SetTextResult!
    }
    type Query {
      text: String!
    }
    type SetTextResult {
      text: String!
    }
  `,
  resolvers: {
    Mutation: {
      setText: (root, text: string) => text
    },
    Query: {
      text: () => 'hello'
    }
  }
})

/**
 * REST
 */
server.delete('/any', (req: FastifyRequest, rep: FastifyReply) => rep.send())

server.get('/blob', (req: FastifyRequest, rep: FastifyReply) => {
  rep.header('content-type', 'application/octet-stream')
  rep.send(Buffer.from([0]))
})

server.get('/buffer', (req: FastifyRequest, rep: FastifyReply) => {
  rep.header('content-type', '')
  rep.send(Buffer.from([0]))
})

server.get('/json', (req: FastifyRequest, rep: FastifyReply) => {
  rep.send({ a: 0 })
})

server.get('/query', (req: FastifyRequest, rep: FastifyReply) => {
  rep.send(req.query)
})

server.get('/text', (req: FastifyRequest, rep: FastifyReply) => {
  rep.send('hello')
})

server.get('/any', (req: FastifyRequest, rep: FastifyReply) => rep.send())
// server.head('/any', (req: FastifyRequest, rep: FastifyReply) => rep.send())
server.options('/any', (req: FastifyRequest, rep: FastifyReply) => rep.send())

server.patch('/any', (req: FastifyRequest, rep: FastifyReply) => {
  rep.header('method', 'PATCH')
  rep.send(req.body)
})

server.post('/any', (req: FastifyRequest, rep: FastifyReply) => {
  rep.header('method', 'POST')
  rep.send(req.body)
})

server.put('/any', (req: FastifyRequest, rep: FastifyReply) => {
  rep.header('method', 'PUT')
  rep.send(req.body)
})

/**
 * Functions
 */
export async function openServer(port: number): Promise<string> {
  return server.listen({ port })
}

export async function closeServer(): Promise<void> {
  return server.close()
}
