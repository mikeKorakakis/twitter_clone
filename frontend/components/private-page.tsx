import React from "react";
import { redirect } from "next/navigation";
import me from "@/lib/me";

export default async function PrivatePage({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await me();
	if (!user) {
		redirect("/login");
	}

	return children;
}
