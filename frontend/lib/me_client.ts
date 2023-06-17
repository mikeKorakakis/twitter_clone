import { MeDocument, MeQuery, MeQueryVariables } from "@/gql/graphql";
import { gqlClient } from "./client";
export default async function me() {
		const client = await gqlClient();
		// return res;
        try {
			const res = await client.request<MeQuery, MeQueryVariables>(
				MeDocument,
				{}
			);
			return {
                id: res?.me?.id,
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
