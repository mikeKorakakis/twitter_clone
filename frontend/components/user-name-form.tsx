"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// import { User } from "@prisma/client"
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { userNameSchema } from "@/lib/validations/user";
import { buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import {
	UpdateUserDocument,
	UpdateUserMutation,
	UpdateUserMutationVariables,
	User,
} from "@/gql/graphql";
import { gqlClient } from "@/lib/client";

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
	user: Pick<User, "id" | "displayName" | "firstName" | "lastName" | "email">;
}

type FormData = z.infer<typeof userNameSchema>;

export const updateUser = async (data: FormData) => {
	const client = await gqlClient();
	const res = client.request<UpdateUserMutation, UpdateUserMutationVariables>(
		UpdateUserDocument,
		{
			updateUserDto: data,
		}
	);
	return res;
};

export function UserNameForm({ user, className, ...props }: UserNameFormProps) {
	const router = useRouter();
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(userNameSchema),
		defaultValues: {
			displayName: user?.displayName || "",
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
		},
	});
	const [isSaving, setIsSaving] = React.useState<boolean>(false);

	async function onSubmit(data: FormData) {
		setIsSaving(true);

		const res = await updateUser(data);

		// const response = await fetch(`/api/users/${user.id}`, {
		//   method: "PATCH",
		//   headers: {
		//     "Content-Type": "application/json",
		//   },
		//   body: JSON.stringify({
		//     name: data.name,
		//   }),
		// })

		setIsSaving(false);

		if (res?.updateUser?.success) {
			toast({
				description: "Your name has been updated.",
			});
			router.refresh();
		} else {
			toast({
				title: "Something went wrong.",
				description:
					res?.updateUser?.error?.message || "Please try again.",
				variant: "destructive",
			});
		}

		// if (!response?.ok) {
		//   return toast({
		//     title: "Something went wrong.",
		//     description: "Your name was not updated. Please try again.",
		//     variant: "destructive",
		//   })
		// }
	}

	return (
		<form
			className={cn(className)}
			onSubmit={handleSubmit(onSubmit)}
			{...props}
		>
			<Card>
				<CardHeader>
					<CardTitle>Your Profile Details</CardTitle>
					<CardDescription>
						Please enter your full name or a display name you are
						comfortable with.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-y-4">
						<div className="grid gap-1">
							<Label htmlFor="name">Email</Label>
							<Input
								disabled
								id="email"
								className="w-[400px]"
								size={32}
								value={user?.email}
							/>
						</div>
						<div className="grid gap-1">
							<Label htmlFor="name">Display Name</Label>
							<Input
								id="name"
								className="w-[400px]"
								size={32}
								{...register("displayName")}
							/>
							{errors?.displayName && (
								<p className="px-1 text-xs text-red-600">
									{errors.displayName.message}
								</p>
							)}
						</div>
						<div className="grid gap-1">
							<Label htmlFor="firstName">First Name</Label>
							<Input
								id="firstName"
								className="w-[400px]"
								size={32}
								{...register("firstName")}
							/>
							{errors?.firstName && (
								<p className="px-1 text-xs text-red-600">
									{errors.firstName.message}
								</p>
							)}
						</div>
						<div className="grid gap-1">
							<Label htmlFor="firstName">Last Name</Label>
							<Input
								id="lastName"
								className="w-[400px]"
								size={32}
								{...register("lastName")}
							/>
							{errors?.lastName && (
								<p className="px-1 text-xs text-red-600">
									{errors.lastName.message}
								</p>
							)}
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<button
						type="submit"
						className={cn(buttonVariants(), className)}
						disabled={isSaving}
					>
						{isSaving && (
							<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
						)}
						<span>Save</span>
					</button>
				</CardFooter>
			</Card>
		</form>
	);
}
