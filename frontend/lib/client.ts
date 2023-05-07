import { GraphQLClient } from "graphql-request";
import { cookies } from 'next/dist/client/components/headers';

export const gqlClient = (token?: string) => {
    return new GraphQLClient("http://localhost:4000/graphql", {
	fetch,
	credentials: "include",
    headers: {
         "Cookie": `access_token=${token}`
        // ...(token && { Authorization: `Bearer ${token}` }),
    },
  
});
}
