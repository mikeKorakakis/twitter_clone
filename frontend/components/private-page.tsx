import React from "react";
import { redirect } from "next/navigation";
import me from "@/lib/me";

export default async function PrivatePage({
	children,
}: {
	children: React.ReactElement;
}) {
	const user = await me();
	if (!user) {
		redirect("/login");
	}

	return children;
}
