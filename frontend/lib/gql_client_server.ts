import { RefreshTokenDocument } from "@/gql/graphql";
import { GraphQLClient } from "graphql-request";
import { cookies } from "next/dist/client/components/headers";
function isUnauthorizedError(error: any) {
	return error.response.errors[0].message === "Unauthorized";
}


export const gqlClient = async () => {
	"use server";
	const cookieStore = await cookies();
	const token = cookieStore.get("access_token");
    const refreshToken = cookieStore.get("refresh_token");
	console.log("tokedddn", token?.value);
	const client = new GraphQLClient("http://localhost:4000/graphql", {
		fetch,
		// credentials: "include",
		headers: {
			Cookie: `access_token=${token?.value}`,
			// ...(token && { Authorization: `Bearer ${token}` }),
		},
	});
	const withTokenRefresh = async <T = any>(query: any, variables: any):Promise<T> => {
		try {
			return await client.request(query, variables);
		} catch (error) {
            if (isUnauthorizedError(error) && refreshToken) {
                // You'll need to implement isUnauthorizedError
                console.log('haha',error);
				const newToken = await client.request(RefreshTokenDocument, {
                   refreshToken: refreshToken?.value
                }); // refreshToken is a function that gets a new access token
				const accessToken = newToken.refreshToken.accessToken;
                if(accessToken) client.setHeader("Cookie", `access_token=${accessToken}`);
				return client.request(query, variables);
			}
			throw error;
		}
	};

	return {
		request: withTokenRefresh,
	};
};
