import me from "@/lib/me";
import ProtectedPage from "@/components/protected-page"

export default async function Protected() {
	const user = await me();
    {/* @ts-expect-error Server Component */}
	return <ProtectedPage><div>{user?.email}</div></ProtectedPage>;
}
