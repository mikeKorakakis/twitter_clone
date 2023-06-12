"use client";

import { Search } from "lucide-react";
import * as React from "react";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	SearchUsersDocument,
	SearchUsersQuery,
	SearchUsersQueryVariables,
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

const frameworks = [
	{
		value: "next.js",
		label: "Next.js",
	},
	{
		value: "sveltekit",
		label: "SvelteKit",
	},
	{
		value: "nuxt.js",
		label: "Nuxt.js",
	},
	{
		value: "remix",
		label: "Remix",
	},
	{
		value: "astro",
		label: "Astro",
	},
];

async function searchUsers(searchTerm: string) {
	const client = gqlClient();
	const res = await client.request<
		SearchUsersQuery,
		SearchUsersQueryVariables
	>(SearchUsersDocument, { searchTerm });
	const users = res.searchUsers;
	return users;
}

export function UserSearch() {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");
	const [users, setUsers] = React.useState<UserType[]>([]);

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
			<PopoverContent className="w-[200px] p-0">
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
								<span className="text-sm align-middle font-bold leading-9 pl-2">
									{user?.displayName}
								</span>
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
