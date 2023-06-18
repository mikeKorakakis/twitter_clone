// "use client";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Spinner from "@/components/ui/spinner";
import { gqlClient } from "@/lib/gql_client_server";
import { MeDocument } from "@/gql/graphql";
import { use, useEffect, useState } from "react";
import { cookies, headers } from "next/dist/client/components/headers";

// async function me(token?: string) {
//     const res =  gqlClient(token).request(MeDocument, {});
// 	return res;
// }

async function me() {
	const client = await gqlClient();
	const res = client.request(MeDocument, {});
	return res;
}

export default async function ConfirmAccountPage() {
	let res = await me();
	return (
		<>
			<section className="space-y-6 pb-8 -mt-32 md:pb-12 ">
				<div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center ">
					<p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
						{res?.me?.email}
					</p>
				</div>
			</section>
		</>
	);
}
