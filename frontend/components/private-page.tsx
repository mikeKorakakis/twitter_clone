import React from "react";
import { redirect } from "next/navigation";
import me from "@/lib/me";

export default async function PrivatePage({
	children,
    role
}: {
	children: React.ReactElement;
    role?: 'admin' | 'user' | 'premium' | 'moderator';
}) {
	const user = await me();
    if(role && user?.role !== role) {
        redirect("/login");
    }
	if (!user) {
		redirect("/login");
	}

	return children;
}