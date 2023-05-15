import { MeDocument, MeQuery, MeQueryVariables } from "@/gql/graphql";
import { gqlClient } from "./client";
import { gqlClient as gqlClientServer } from "./gql_client_server";
import { type } from "os";

export default async function me() {
	let res: MeQuery;
	if (typeof window === "undefined") {
        console.log("server")
		const client = await gqlClientServer();

		try {
			res = await client.request<MeQuery, MeQueryVariables>(
				MeDocument,
				{}
			);
			return {
				email: res?.me?.email,
				firstName: res?.me?.firstName,
				lastName: res?.me?.lastName,
				role: res?.me?.role,
				displayName: res?.me?.displayName,
				image: res?.me?.image,
			};
		} catch (e: any) {
			return null;
		}
	} else {
        console.log("client")

		const client = await gqlClient();
		// return res;
        try {
			const res = await client.request<MeQuery, MeQueryVariables>(
				MeDocument,
				{}
			);
			return {
				email: res?.me?.email,
				firstName: res?.me?.firstName,
				lastName: res?.me?.lastName,
				role: res?.me?.role,
				displayName: res?.me?.displayName,
				image: res?.me?.image,
			};
		} catch (e: any) {
			return null;
		}
	}
}
