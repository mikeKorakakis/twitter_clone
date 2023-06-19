import { GraphQLWebSocketClient } from "graphql-request"
import WebSocketImpl, { WebSocketServer } from 'ws'
import { GRAPHQL_TRANSPORT_WS_PROTOCOL, createClient } from 'graphql-ws'
import { boolean } from "zod"

import Cookies from 'js-cookie'

// export const ws_client = async () => {
//     return new Promise<GraphQLWebSocketClient>((resolve) => {
//       const socket = new WebSocket(process.env.NEXT_PUBLIC_WS_URL as string, GRAPHQL_TRANSPORT_WS_PROTOCOL ) as unknown as WebSocket
//       const client: GraphQLWebSocketClient = new GraphQLWebSocketClient(socket, {
//         onAcknowledged: (_p) => Promise.resolve(resolve(client)),
//         // set auth token        
        
//       })
    
//     })
//   }
  

export   const ws_client = createClient({
    url: process.env.NEXT_PUBLIC_WS_URL as string,
        
    // headers: {
    //     Authorization: `Bearer ${token}`,
    // },
    // wsClient: ws_client,
    // wsEndpoint: process.env.NEXT_PUBLIC_WS_URL as string,
    // webSocketImpl: WebSocketImpl,
    // webSocketProtocols: GRAPHQL_TRANSPORT_WS_PROTOCOL,
    // webSocketServer: WebSocketServer,
    // webSocketServerOptions: {
    //     path: '/graphql',
    //     port: 3000,  
    // },
    // webSocketImpl: WebSocketImpl,
    connectionParams: () => {
        // get your token from a cookie, localStorage or any other means
        const token = Cookies.get('ws_token');
        return { token };
      },
    });