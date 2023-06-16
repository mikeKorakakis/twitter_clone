import { GraphQLWebSocketClient } from "graphql-request"
import WebSocketImpl, { WebSocketServer } from 'ws'
import { GRAPHQL_TRANSPORT_WS_PROTOCOL } from 'graphql-ws'
import { boolean } from "zod"


export const ws_client = async () => {
    return new Promise<GraphQLWebSocketClient>((resolve) => {
      const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL as string, GRAPHQL_TRANSPORT_WS_PROTOCOL) as unknown as WebSocket
      const client: GraphQLWebSocketClient = new GraphQLWebSocketClient(socket, {
        onAcknowledged: (_p) => Promise.resolve(resolve(client))
      })
    })
  }
  