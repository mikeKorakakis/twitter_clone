"use client";

import { Metadata } from "next";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "@/components/ui/use-toast";
import { siteConfig } from "@/config/site";
import {
	ChangePasswordDocument,
	ChangePasswordMutation,
	ChangePasswordMutationVariables,
	SetNewPasswordDocument,
	SetNewPasswordMutation,
	SetNewPasswordMutationVariables,
} from "@/gql/graphql";
import { gqlClient } from "@/lib/client";
import { cn } from "@/lib/utils";
import {
	changePasswordSchema,
	resetPasswordSchema,
} from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const metadata: Metadata = {
	title: "Change Password",
	description: "Change password for your account",
};

type FormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
	const { push } = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(changePasswordSchema),
	});
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	async function onSubmit(data: FormData) {
		const input = {
			oldPassword: data.oldPassword,
			newPassword: data.newPassword,
		};
		setIsLoading(true);
		try {
			const changePasswordResult = await gqlClient().request<
				ChangePasswordMutation,
				ChangePasswordMutationVariables
			>(ChangePasswordDocument, { input });

			if (changePasswordResult.changePassword.success) {
				toast({
					title: "Success",
					description: changePasswordResult.changePassword.message,
					variant: "default",
				});
			} else {
				toast({
					title: "Error",
					description:
						changePasswordResult?.changePassword?.error?.message,
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
						Change Password
					</h1>
					<p className="text-sm text-slate-500 dark:text-slate-400">
						Set a new password for your account
					</p>
				</div>
				<div className={cn("grid gap-6")}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="grid gap-2">
							<div className="grid gap-1">
								<Label
									className="sr-only"
									htmlFor="oldPassword"
								>
									Old Password
								</Label>
								<PasswordInput
									id="oldPassword"
									placeholder="Old Password"
									autoCapitalize="none"
									autoCorrect="off"
									disabled={isLoading}
									{...register("oldPassword")}
								/>
								{errors?.oldPassword && (
									<p className="px-1 text-xs text-red-600">
										{errors.oldPassword.message}
									</p>
								)}
							</div>
							<div className="grid gap-1">
								<Label
									className="sr-only"
									htmlFor="newPassword"
								>
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
								Change Password
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
