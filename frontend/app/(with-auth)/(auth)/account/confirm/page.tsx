// "use client";

import PrivatePage from "@/components/private-page";
import Spinner from "@/components/ui/spinner";
import {
    ConfirmEmailDocument,
    ConfirmEmailMutation,
    ConfirmEmailMutationVariables,
} from "@/gql/graphql";
import { gqlClient as gqlClient_server } from "@/lib/gql_client_server";
import ResendConfirmationLink from "./resend";

interface ConfirmAccountResponse {
	success: boolean;
	message: string;
}

async function confirmEmail(
	token: string
): Promise<ConfirmEmailMutation | null> {
	try {
		const client = await gqlClient_server();
		const res = client.request<
			ConfirmEmailMutation,
			ConfirmEmailMutationVariables
		>(ConfirmEmailDocument, { token: token });
		return res;
		// const response = await fetch(
		// 	`${process.env.NEXT_PUBLIC_BACKEND_URL}/account/confirm?token=${token}`,
		// 	{
		// 		credentials: "include",
		// 	}
		// );
		// return response.json();
	} catch (error) {
		console.error(error);
		return null;
	}
}

// const successMessage = "Your account has been confirmed. You can now log in.";
// const errorMessage =
// 	"There was an error confirming your account. Please try again.";
export default async function ConfirmAccountPage({
	searchParams,
}: {
	searchParams: { token: string };
}) {
	const token = searchParams.token;
	// // if (!searchParams.token) return <div>No token specified</div>;
	const res = await confirmEmail(searchParams.token).catch((err) => {
		console.log("err", err);
	});

	return (
		<>
			{/* @ts-expect-error Server Component */}
			<PrivatePage>
				<section className="space-y-6 mt-32">
					<div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center ">
						{!res ? (
							<p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
								<Spinner />
							</p>
						) : (
							<p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
								{res?.confirmEmail.message}
							</p>
						)}
					</div>
					<ResendConfirmationLink />
				</section>
			</PrivatePage>
		</>
	);
}
