import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { UserNameForm } from "@/components/user-name-form";
import { useAuth } from "@/contexts/AuthContext";
import me from "@/lib/me";

export const metadata = {
	title: "Settings",
	description: "Manage account and website settings.",
};

export default async function SettingsPage() {
	//   const user = await getCurrentUser()
	//   const  { user } = useAuth()

	const user = await me();
	if (!user) {
		redirect(authOptions?.pages?.signIn || "/login");
	}

	return (
		<DashboardShell>
			<DashboardHeader
				heading="Settings"
				text="Manage account and website settings."
			/>
			<div className="grid gap-10">
				<UserNameForm
					user={{
						id: user.id,
						displayName: user.displayName || "",
						firstName: user.firstName,
						lastName: user.lastName,
						email: user.email,
					}}
				/>
			</div>
		</DashboardShell>
	);
}
