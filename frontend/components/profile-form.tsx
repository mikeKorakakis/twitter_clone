"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
// import { User } from "@prisma/client"
import { useForm } from "react-hook-form";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { profileSchema } from "@/lib/validations/user";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
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

import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/react-hook-form/form";

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
	user: Pick<User, "id" | "displayName" | "firstName" | "lastName" | "email">;
}

type FormData = z.infer<typeof profileSchema>;

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

export function ProfileForm({ user, className, ...props }: UserNameFormProps) {
	const router = useRouter();
	const form = useForm<FormData>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			displayName: user?.displayName || "",
			firstName: user?.firstName || "",
			lastName: user?.lastName || "",
		},
	});
	const {
		formState: { errors },
	} = form;
	const [isSaving, setIsSaving] = React.useState<boolean>(false);

	async function onSubmit(data: FormData) {
		setIsSaving(true);

		const res = await updateUser(data);

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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									disabled
									placeholder={user?.email}
									{...field}
								/>
							</FormControl>
							<FormDescription>
								This is the email you subscribed with. You
								cannot change this.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="displayName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Display Name</FormLabel>
							<FormControl>
								<Input placeholder="Display Name" {...field} />
							</FormControl>
							<FormDescription>
								This is your public display name. It can be your
								real name or a pseudonym.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input placeholder="First Name" {...field} />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="lastName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input placeholder="Last Name" {...field} />
							</FormControl>
							<FormDescription></FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Update profile</Button>
			</form>
		</Form>
	);
}
