"use client"
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { gqlClient } from "@/lib/client";
import {
	GetTweetsDocument,
	GetTweetsQuery,
	GetTweetsQueryVariables,
} from "@/gql/graphql";

async function getTweets() {
	const client = await gqlClient();
	const res = client.request<GetTweetsQuery, GetTweetsQueryVariables>(
		GetTweetsDocument,{
            args: {
                take: 10,
                page: 1
            }
        }
	);
    return res
}

export default async function page() {

    const res = await getTweets()
    const tweets = res?.tweets.data
    const meta = res?.tweets.meta

	return (
		<div className=" w-full mt-10">
			<div className="flex  justify-center space-x-4 sm:w-[38rem] m-auto w-full px-4">
				<Textarea placeholder="What is happening?!" />
				<Button className="ml-4 ">Tweet</Button>
			</div>
            {
                tweets?.map(tweet => (
                   <div key={tweet.id}>
                        {tweet.content}
                   </div>
                ))
            }
		</div>
	);
}
