"use client";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Spinner from "@/components/ui/spinner";

interface ConfirmAccountResponse {
    success: boolean;
    message: string;
}

async function confirmAccount(token: string): Promise<ConfirmAccountResponse | null> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BACKEND_URL}/account/confirm?token=${token}`,
			{
                credentials: 'include',
                
            }
		);
		return response.json();
	} catch (error) {
		return null;
	}
}

const successMessage = "Your account has been confirmed. You can now log in.";
const errorMessage = "There was an error confirming your account. Please try again.";
export default async function ConfirmAccountPage({
	searchParams,
}: {
	searchParams: { token: string };
}) {
	const res = await confirmAccount(searchParams.token);

	return (
		<>
			<section className="space-y-6 pb-8 -mt-32 md:pb-12 ">
				<div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center ">
					<p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                        {res?.success ? successMessage : errorMessage}
					</p>
				</div>
			</section>
		</>
	);
}
