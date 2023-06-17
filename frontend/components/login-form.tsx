"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { loginSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { useAuth } from "@/contexts/AuthContext";
import { siteConfig } from "@/config/site";
import { gqlClient } from "@/lib/client";
import { AuthenticationErrorType, MeDocument } from "@/gql/graphql";
import { GoogleButton } from "@/components/google-button"
import { PasswordInput } from "@/components/ui/password-input";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: LoginFormProps) {
	const { logIn } = useAuth();
	const { push } = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(loginSchema),
	});
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [isGitHubLoading, setIsGitHubLoading] =
		React.useState<boolean>(false);
	const searchParams = useSearchParams();

	async function onSubmit(data: FormData) {
		setIsLoading(true);

		// const signInResult = await signIn("email", {
		//   email: data.email.toLowerCase(),
		//   redirect: false,
		//   callbackUrl: searchParams?.get("from") || "/dashboard",
		// })
		try {
			const signInResult = await logIn(data);
			

			if (
				signInResult?.login?.error?.type ==
				AuthenticationErrorType.InvalidCredentials
			) {
				return toast({
					title: "Invalid Credentials",
					description:
						"Your email or password is incorrect. Please try again.",
					variant: "destructive",
				});
			}

			push(siteConfig.pages.home);
		} catch (e) {
			toast({
				title: "Something went wrong.",
				description: "Your sign in request failed. Please try again.",
				variant: "destructive",
			});
		}
        finally{
            setIsLoading(false);
        }
		// window.location.href = (siteConfig.pages.home);
	}

	return (
		<div className={cn("grid gap-6", className)} {...props}>
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
							disabled={isLoading || isGitHubLoading}
							{...register("email")}
						/>
						{errors?.email && (
							<p className="px-1 text-xs text-red-600">
								{errors.email.message}
							</p>
						)}
					</div>
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="password">
							Password
						</Label>
						<PasswordInput
							id="password"
							placeholder="Password"
							autoCapitalize="none"
							autoComplete="password"
							autoCorrect="off"
							disabled={isLoading || isGitHubLoading}
							{...register("password")}
						/>
						{errors?.password && (
							<p className="px-1 text-xs text-red-600">
								{errors.password.message}
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
						Sign In with Email
					</button>
				</div>
			</form>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				<div className="relative flex justify-center text-xs uppercase">
					<span className="bg-background px-2 text-muted-foreground">
						Or continue with
					</span>
				</div>
			</div>
			<GoogleButton/>
		</div>
	);
}
