import me from "@/lib/me";
import PrivatePage from "@/components/private-page"

export default async function Protected() {
	const user = await me();
	return <PrivatePage><div>{user?.email}</div></PrivatePage>;
}
