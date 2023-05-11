import { MeDocument } from "@/gql/graphql";
import { gqlClient } from "./gql_client_server";


export default async function me() {
	const client = await gqlClient();
	try {
		const res = await client.request(MeDocument, {});
		console.log("fetching user");
		return {
			email: res?.me?.email,
			firstName: res?.me?.firstName,
			lastName: res?.me?.lastName,
		};
	} catch (e:any) {
		return null;
	}
	// return res;
}
