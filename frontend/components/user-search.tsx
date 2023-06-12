"use client";

import { Search } from "lucide-react";
import * as React from "react";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	FollowUserDocument,
	FollowUserMutation,
	FollowUserMutationVariables,
	SearchUsersDocument,
	SearchUsersQuery,
	SearchUsersQueryVariables,
	UnfollowUserDocument,
	UnfollowUserMutation,
	UnfollowUserMutationVariables,
} from "@/gql/graphql";
import { gqlClient } from "@/lib/client";
import { useDebounce } from "@/lib/use-debounce";
import { UserType } from "@/types";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import { useEffect } from "react";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

async function searchUsers(searchTerm: string) {
	const client = gqlClient();
	const res = await client.request<
		SearchUsersQuery,
		SearchUsersQueryVariables
	>(SearchUsersDocument, { searchTerm });
	const users = res.searchUsers;
	return users;
}

async function followUser(userId: string) {
	const client = gqlClient();
	const res = await client.request<
		FollowUserMutation,
		FollowUserMutationVariables
	>(FollowUserDocument, { userId });
	return res.followUser;
}

async function unfollowUser(userId: string) {
	const client = gqlClient();
	const res = await client.request<
		UnfollowUserMutation,
		UnfollowUserMutationVariables
	>(UnfollowUserDocument, { userId });
	return res.unfollowUser;
}

export function UserSearch() {
	const { user: me } = useAuth();
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");
	const [users, setUsers] = React.useState<UserType[]>([]);

	async function handleFollowUser(userId: string) {
		const updatedUsers = users.map((user) =>
			user.id === userId
				? { ...user, isFollowed: true } // or switch the isFollowed status depending on your use-case
				: user
		);
		setUsers(updatedUsers);
		const res = await followUser(userId);
		if (!res.success) {
			setUsers(users);
		}
	}

	async function handleUnfollowUser(userId: string) {
		const updatedUsers = users.map((user) =>
			user.id === userId
				? { ...user, isFollowed: false } // or switch the isFollowed status depending on your use-case
				: user
		);
		setUsers(updatedUsers);
		const res = await unfollowUser(userId);
		if (!res.success) {
			setUsers(users);
		}
	}

	const val = useDebounce(value, 500);
	useEffect(() => {
		async function search() {
			const users = await searchUsers(val);
			setUsers(users);
		}
		search();
	}, [val]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Search className="shrink-0 opacity-50 hover:cursor-pointer hover:opacity-100" />
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0 mr-20 mt-2">
				<Input
					placeholder="Search users..."
					onChange={(e) => setValue(e.target.value)}
					value={value}
				></Input>
				<ScrollArea
					className={users.length === 0 ? "h-0 w-48 " : "h-min w-48"}
				>
					<div className="p-4">
						{users.map((user) => (
							<React.Fragment key={user?.id}>
								<div className="flex pt-2">
									<Avatar>
										<AvatarImage
											src={
												user?.image
													? user?.image
													: "https://github.com/shadcn.png"
											}
											alt="@shadcn"
										/>
									</Avatar>
									<div className="flex flex-col">
										<span className="text-sm  font-bold  pl-2">
											{user?.displayName}
										</span>
										{me?.id !== user?.id && (
											<Button
												size="sm"
												className="h-5 ml-2"
												// disabled={user?.isFollowed}
												onClick={() =>
													user?.isFollowed
														? handleUnfollowUser(
																user?.id
														  )
														: handleFollowUser(
																user?.id
														  )
												}
											>
												{user?.isFollowed
													? "Unfollow"
													: "Follow"}
											</Button>
										)}
									</div>
								</div>
								<Separator className="my-2" />
							</React.Fragment>
						))}
					</div>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	);
}
