import { MeDocument } from "@/gql/graphql";
import { gqlClient } from "./gql_client_server";

export default async function me() {
	const client = await gqlClient();
	try {
		const res = await client.request(MeDocument, {});
		return {
			email: res?.me?.email,
			firstName: res?.me?.firstName,
			lastName: res?.me?.lastName,
		};
	} catch (e) {
		return null;
	}
	// return res;
}
