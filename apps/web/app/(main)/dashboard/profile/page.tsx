
import { signJwt } from "@/actions/auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Unauthorized from "@/components/ui/unauthorized";
import EditProfile from "@/components/user_dashboard/edit_profile";
import { getServerSession } from "next-auth";



export default async function Page() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <Unauthorized />
    }
    return <EditProfile />
}