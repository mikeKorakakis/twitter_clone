import me from "@/lib/me";
import PrivatePage from "@/components/private-page"

export default async function Protected() {
	const user = await me();
    {/* @ts-expect-error Server Component */}
	return <PrivatePage><div>{user?.email}</div></PrivatePage>;
}
