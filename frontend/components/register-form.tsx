"use client";

import * as React from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { registerSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { gqlClient } from "@/lib/client";
import {
	AuthenticationErrorType,
	RegisterDocument,
	RegisterMutation,
} from "@/gql/graphql";
import { siteConfig } from "@/config/site";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/contexts/AuthContext";

interface RegisterFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof registerSchema>;

export function RegisterForm({ className, ...props }: RegisterFormProps) {
	const { register: registerUser } = useAuth();
	const { push } = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(registerSchema),
	});
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [isGitHubLoading, setIsGitHubLoading] =
		React.useState<boolean>(false);

	async function onSubmit(data: FormData) {
		setIsLoading(true);

		// const signInResult = await signIn("email", {
		//   email: data.email.toLowerCase(),
		//   redirect: false,
		//   callbackUrl: searchParams?.get("from") || "/dashboard",
		// })
		try {
			const registerResult = await registerUser(data);

			if (
				registerResult?.register?.error?.type ==
				AuthenticationErrorType.EmailExists
			) {
				return toast({
					title: "Email Already Exists",
					description: "Your email already exists. Please try again.",
					variant: "destructive",
				});
			}

			if (
				registerResult?.register?.error?.type ===
				AuthenticationErrorType.NicknameExists
			) {
				return toast({
					title: "Nickname Already Exists",
					description:
						"Your nickname already exists. Please try again.",
					variant: "destructive",
				});
			}

			if (registerResult?.register?.user?.email) {
				toast({
					title: "Success!",
					description:
						"Your account has been created. Please check your email to activate you account.",
				});
				push(siteConfig.pages.home);
			} else {
				setTimeout(() => {
					push(siteConfig.pages.home);
				}, 2000);
			}
		} catch (e) {
			return toast({
				title: "Something went wrong.",
				description: "Your sign in request failed. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
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
							type="password"
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
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="displayName">
							Display Name
						</Label>
						<Input
							id="displayName"
							placeholder="Display Name"
							type="displayName"
							autoCapitalize="none"
							autoComplete="displayName"
							autoCorrect="off"
							disabled={isLoading || isGitHubLoading}
							{...register("displayName")}
						/>
						{errors?.displayName && (
							<p className="px-1 text-xs text-red-600">
								{errors.displayName.message}
							</p>
						)}
					</div>
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="frstName">
							First Name
						</Label>
						<Input
							id="firstName"
							placeholder="First Name"
							type="firstName"
							autoCapitalize="none"
							autoComplete="firstName"
							autoCorrect="off"
							disabled={isLoading || isGitHubLoading}
							{...register("firstName")}
						/>
						{errors?.firstName && (
							<p className="px-1 text-xs text-red-600">
								{errors.firstName.message}
							</p>
						)}
					</div>
					<div className="grid gap-1">
						<Label className="sr-only" htmlFor="lastName">
							LastName
						</Label>
						<Input
							id="lastName"
							placeholder="Last Name"
							type="lastName"
							autoCapitalize="none"
							autoComplete="lastName"
							autoCorrect="off"
							disabled={isLoading || isGitHubLoading}
							{...register("lastName")}
						/>
						{errors?.lastName && (
							<p className="px-1 text-xs text-red-600">
								{errors.lastName.message}
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
						Sign Up with Email
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
			<button
				type="button"
				className={cn(buttonVariants({ variant: "outline" }))}
				onClick={() => {
					setIsGitHubLoading(true);
					signIn("github");
				}}
				disabled={isLoading || isGitHubLoading}
			>
				{isGitHubLoading ? (
					<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
				) : (
					<Icons.gitHub className="mr-2 h-4 w-4" />
				)}{" "}
				Github
			</button>
		</div>
	);
}
