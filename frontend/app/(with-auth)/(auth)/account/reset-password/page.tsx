"use client";

import { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { gqlClient } from "@/lib/client";
import {
	SetNewPasswordDocument,
	SetNewPasswordMutation,
	SetNewPasswordMutationVariables,
} from "@/gql/graphql";
import { toast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useRouter, useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";

// export const metadata: Metadata = {
// 	title: "New Password",
// 	description: "Set a new password for your account",
// };

type FormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const { push } = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(resetPasswordSchema),
	});
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	async function onSubmit(data: FormData) {
		if (!token)
			return toast({
				title: "Error",
				description: "Token not found",
				variant: "destructive",
			});
		const input = {
			token: token,
			newPassword: data.newPassword,
		};
		setIsLoading(true);
		try {
			const resetPasswordResult = await gqlClient().request<
				SetNewPasswordMutation,
				SetNewPasswordMutationVariables
			>(SetNewPasswordDocument, { input });

			if (resetPasswordResult.setNewPassword.success) {
				toast({
					title: "Success",
					description: resetPasswordResult.setNewPassword.message,
					variant: "default",
				});
				push(siteConfig.pages.login);
			} else {
				toast({
					title: "Error",
					description:
						resetPasswordResult?.setNewPassword?.error?.message,
					variant: "destructive",
				});
			}
		} catch (e) {
			toast({
				title: "Error",
				description: "Something went wrong",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

	if (!token) return <div>Token not found</div>;

	return (
		<div className="container flex  w-screen flex-col items-center justify-center">
			<Link
				href="/"
				className={cn(
					buttonVariants({ variant: "ghost" }),
					"absolute top-4 left-4 md:top-8 md:left-8"
				)}
			>
				<>
					<Icons.chevronLeft className="mr-2 h-4 w-4" />
					Back
				</>
			</Link>
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<div className="flex flex-col space-y-2 text-center">
					<Icons.logo className="mx-auto h-6 w-6" />
					<h1 className="text-2xl font-semibold tracking-tight">
						New Password
					</h1>
					<p className="text-sm text-slate-500 dark:text-slate-400">
						Set a new password for your account
					</p>
				</div>
				<div className={cn("grid gap-6")}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="grid gap-2">
							<div className="grid gap-1">
								<Label className="sr-only" htmlFor="newPassword">
									New Password
								</Label>
								<PasswordInput
									id="newPassword"
									placeholder="New Password"
									autoCapitalize="none"
									autoCorrect="off"
									disabled={isLoading}
									{...register("newPassword")}
								/>
								{errors?.newPassword && (
									<p className="px-1 text-xs text-red-600">
										{errors.newPassword.message}
									</p>
								)}
							</div>

							<button
								className={cn(buttonVariants())}
								disabled={isLoading}
							>
								{isLoading && (
									<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
								)}
								Set New Password
							</button>
						</div>
					</form>
				</div>
			</div>
            <p className="pt-2 px-8 text-center text-sm text-slate-500 dark:text-slate-400">
					<Link
						href={siteConfig.pages.forgotPassword}
						className="hover:text-brand underline underline-offset-4 cursor-pointer"
					>
						Resend Confirmation Link?
					</Link>
				</p>
		</div>
	);
}
