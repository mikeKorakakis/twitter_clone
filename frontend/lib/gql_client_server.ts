"use server";
import { RefreshTokenDocument } from "@/gql/graphql";
import { GraphQLClient, Variables } from "graphql-request";
import { VariablesAndRequestHeadersArgs } from "graphql-request/build/esm/types";
import { cookies } from "next/dist/client/components/headers";
function isUnauthorizedError(error: any) {
	return error.response.errors[0].message === "Unauthorized";
}


export const gqlClient = async () => {
	const cookieStore = await cookies();
	const token = cookieStore.get("access_token");
    const refreshToken = cookieStore.get("refresh_token");
	const client = new GraphQLClient("http://localhost:4000/graphql", {
		fetch,
		// credentials: "include",
		headers: {
			Cookie: `access_token=${token?.value}`,
			// ...(token && { Authorization: `Bearer ${token}` }),
		},
	});
	const withTokenRefresh = async  <T = any, Y extends Variables = any>(query: any, variables?: Y):Promise<T> => {
		try {
			return await client.request(query, variables);
		} catch (error) {
            console.log("error", error)
            if (isUnauthorizedError(error) && refreshToken) {
                console.log("Unauthorized");
                // You'll need to implement isUnauthorizedError
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
