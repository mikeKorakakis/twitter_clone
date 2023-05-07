import { GraphQLClient } from "graphql-request";
import { cookies } from "next/dist/client/components/headers";

export const gqlClient = async () => {
    "use server"
    const cookieStore = await  cookies();
    const token = cookieStore.get('access_token');
    console.log("tokedddn",token?.value);
    return new GraphQLClient("http://localhost:4000/graphql", {
	fetch,
	// credentials: "include",
    headers: {
         "Cookie": `access_token=${token?.value}`
        // ...(token && { Authorization: `Bearer ${token}` }),
    },
  
});
}
