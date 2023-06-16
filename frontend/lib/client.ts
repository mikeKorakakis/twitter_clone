import { toast } from "@/components/ui/use-toast";
import { GraphQLClient, Variables } from "graphql-request";
import { cookies } from "next/dist/client/components/headers";
import { RefreshTokenDocument } from "@/gql/graphql";

 function isUnauthorizedError(error: any) {
	return error.response.errors[0].message === "Unauthorized";
}

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
            console.log("error", error);
			// if (isUnauthorizedError(error)) {
            //     console.log("Unauthorized");
            //     // You'll need to implement isUnauthorizedError
			// 	const newToken = await client.request(RefreshTokenDocument, {
            //        refreshToken: refreshToken?.value
            //     }); // refreshToken is a function that gets a new access token
			// 	const accessToken = newToken.refreshToken.accessToken;
            //     if(accessToken) client.setHeader("Cookie", `access_token=${accessToken}`);
			// 	return client.request(query, variables);
			// }
            throw error;
            
		}
	};

	return {
		request: withTokenRefresh,
	};
};
