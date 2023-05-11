import { GraphQLClient } from "graphql-request";
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
	const withTokenRefresh = async <T = any>(
		query: any,
		variables?: any
	): Promise<T> => {
		try {
			return await client.request(query, variables);
		} catch (error) {
			console.log(error);
			// if (isUnauthorizedError(error)) {
			// 	// You'll need to implement isUnauthorizedError
			// 	const newToken = await refreshToken(); // refreshToken is a function that gets a new access token
			// 	client.setHeader("Cookie", `access_token=${newToken}`);
			// 	return client.request(query, variables);
			// }
			throw error;
		}
	};

	return {
		request: withTokenRefresh,
	};
};
