import { toast } from "@/components/ui/use-toast";
import { GraphQLClient, Variables } from "graphql-request";
import { cookies } from "next/dist/client/components/headers";

export const gqlClient = (token?: string) => {
	const client: GraphQLClient = new GraphQLClient(
		"http://localhost:4000/graphql",
		{
			fetch,
			credentials: "include",
			headers: {
				Cookie: `access_token=${token}`,
				// ...(token && { Authorization: `Bearer ${token}` }),
			},
		}
	);
	const withTokenRefresh = async <T = any, Y extends Variables = any>(
		query: any,
		variables?: Y
	): Promise<T> => {
		try {
			return await client.request(query, variables);
		} catch (error) {
			// if (isUnauthorizedError(error)) {
			// 	// You'll need to implement isUnauthorizedError
			// 	const newToken = await refreshToken(); // refreshToken is a function that gets a new access token
			// 	client.setHeader("Cookie", `access_token=${newToken}`);
			// 	return client.request(query, variables);
			// }
			// console.log(error);
            throw error;
            // toast(
            //     {
            //         title: "Error",
            //         description: "Something went wrong. Please try again later.",
            //         variant: "destructive",
            //     }
            // )
            // return { error };
            
		}
	};

	return {
		request: withTokenRefresh,
	};
};
