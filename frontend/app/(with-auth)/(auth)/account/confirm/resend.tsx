"use client";
import { toast } from "@/components/ui/use-toast";
import {
	ResendConfirmationEmailDocument,
	ResendConfirmationEmailMutation,
	ResendConfirmationEmailMutationVariables,
} from "@/gql/graphql";
import { gqlClient } from "@/lib/client";
import React from "react";

async function resendConfirmationEmail() {
	const res = await gqlClient().request<
		ResendConfirmationEmailMutation,
		ResendConfirmationEmailMutationVariables
	>(ResendConfirmationEmailDocument, {});
    if(res.resendConfirmationEmail.success) {
        toast({
            title: "Success",
            description: res.resendConfirmationEmail.message,
            variant: "default",
        });
    }else{
        toast({
            title: "Error",
            description: res.resendConfirmationEmail.message,
            variant: "destructive",
        });
    }
}

export default function ResendConfirmationLink() {
	return (
		<p className="pt-2 px-8 text-center text-sm text-slate-500 dark:text-slate-400">
			<button
				onClick={resendConfirmationEmail}
				className="hover:text-brand underline underline-offset-4 cursor-pointer"
			>
				Resend Confirmation Link
			</button>
		</p>
	);
}
