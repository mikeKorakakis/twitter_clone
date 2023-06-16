"use client";
import React, { use, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { gqlClient } from "@/lib/client";
import {
	CreateTweetDocument,
	CreateTweetMutation,
	CreateTweetMutationVariables,
	GetTweetsDocument,
	GetTweetsQuery,
	GetTweetsQueryVariables,
} from "@/gql/graphql";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { timeSince } from "@/lib/time";
import { ws_client } from "@/lib/gql_client_ws";
import { gql } from "graphql-tag";

async function getTweets() {
	const client = await gqlClient();
	const res = client.request<GetTweetsQuery, GetTweetsQueryVariables>(
		GetTweetsDocument,
		{
			args: {
				take: 10,
				page: 1,
			},
		}
	);
	return res;
}

type TweetsType = GetTweetsQuery["tweets"]["data"];
type MetaType = GetTweetsQuery["tweets"]["meta"];

async function createTweet(value: string) {
	const client = await gqlClient();
	const res = client.request<
		CreateTweetMutation,
		CreateTweetMutationVariables
	>(CreateTweetDocument, {
		tweet: {
			content: value,
		},
	});
	return res;
}

export default function TweetsPage() {
	const [value, setValue] = useState("");
	const [tweets, setTweets] = useState<TweetsType>([]);
	const [meta, setMeta] = useState<MetaType>();

	useEffect(() => {
		async function subscribeToTweets() {
			const client = await ws_client();
			const subscription = client.subscribe(
				gql`
					subscription {
						newTweet {
							id
							content
							createdAt
							author {
								id
								email
								firstName
								lastName
								displayName
								role
								image
								isFollowed
							}
						}
					}
				`,
				{
					next: (data) => {
						console.log(data);
						setTweets((prev) => [data.newTweet, ...(prev ?? [])]);
					},
					complete: () => {
						console.log("done");
					},
				}
			);
			return subscription;
		}
		subscribeToTweets();

		async function getTweetsFunc() {
			const res = await getTweets();
			setTweets(res?.tweets.data);
			setMeta(res?.tweets.meta);
		}
		getTweetsFunc();
	}, []);

	// const res = await getTweets();
	// const tweets = res?.tweets.data;
	// const meta = res?.tweets.meta;

	return (
		<div className=" w-full mt-10">
			<div className="flex  justify-center space-x-4 sm:w-[38rem] m-auto w-full px-4">
				<Textarea
					placeholder="What is happening?!"
					value={value}
					onChange={(e) => {setValue(e.target.value)}}
				/>
				<Button
					className="ml-4"
					onClick={async () => {
                        await createTweet(value);
                        setValue("");
                    }}
				>
					Tweet
				</Button>
			</div>
			{/* <div className="space-y-8"> */}
			<div className="flex-col space-y-8 sm:w-[38rem] m-auto w-full px-4 mt-10 ">
				{tweets?.map((tweet) => (
					<div key={tweet.id} className="ease-in transition duration-500">
						<div className="space-y-8 ">
							<div className="flex ">
								<Avatar className="h-9 w-9">
									<AvatarImage
										src={tweet.author.image}
										alt="Avatar"
									/>
									<AvatarFallback>OM</AvatarFallback>
								</Avatar>
								<div className="ml-4 space-y-1 ">
									<span className="text-sm font-medium leading-none ease-in transition-all duration-500 animate-slide-fade-in">
										<span className="font-bold">
											{tweet.author.displayName}
										</span>{" "}
										<span className="pl-4">
											{timeSince(
												new Date(tweet.createdAt)
											)}
										</span>{" "}
										ago
									</span>
									<p className="text-sm text-muted-foreground">
										{tweet.content}
									</p>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
