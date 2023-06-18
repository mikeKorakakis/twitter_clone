"use client";

import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { buttonVariants } from "@/components/ui/button";
import { forgetPasswordSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { gqlClient } from "@/lib/client";
import {
	ResetPasswordDocument,
	ResetPasswordMutation,
	ResetPasswordMutationVariables,
} from "@/gql/graphql";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// export const metadata: Metadata = {
// 	title: "Forgot Password",
// 	description: "Did you forget your password",
// };

type FormData = z.infer<typeof forgetPasswordSchema>;

export default function ForgotPasswordPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(forgetPasswordSchema),
	});
	const [isLoading, setIsLoading] = React.useState<boolean>(false);

	async function onSubmit(data: FormData) {
		setIsLoading(true);
		try {
			const resetPasswordResult = await gqlClient().request<
				ResetPasswordMutation,
				ResetPasswordMutationVariables
			>(ResetPasswordDocument, data);

			setIsLoading(false);
			if (resetPasswordResult.resetPassword.success) {
				return toast({
					title: "Success",
					description: resetPasswordResult.resetPassword.message,
					variant: "default",
				});
			}
		} catch (e) {
			return toast({
				title: "Success",
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
						Did you forget your password?
					</h1>
					<p className="text-sm text-slate-500 dark:text-slate-400">
						Enter your email to reset your password
					</p>
				</div>
				<div className={cn("grid gap-6")}>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="grid gap-2">
							<div className="grid gap-1">
								<Label className="sr-only" htmlFor="email">
									Email
								</Label>
								<Input
									id="email"
									placeholder="Email"
									type="email"
									autoCapitalize="none"
									autoComplete="email"
									autoCorrect="off"
									disabled={isLoading}
									{...register("email")}
								/>
								{errors?.email && (
									<p className="px-1 text-xs text-red-600">
										{errors.email.message}
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
								Send Reset Link
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
