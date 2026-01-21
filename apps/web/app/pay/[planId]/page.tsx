import { getServerSession } from "next-auth";
import CheckoutPage from "../../../components/paddle_pay";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Unauthorized from "@/components/ui/unauthorized";
import jwt from "jsonwebtoken";
import { BACKEND_URL, JWT_SECRET } from "@/lib/config";




export default async function Page({ params }: { params: Promise<{ planId: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <Unauthorized />;
    }
    const planId = (await params).planId;
    const authToken = jwt.sign({ id: session.user.id }, JWT_SECRET);
    return (
        <CheckoutPage priceId={planId} authToken={authToken} />
    )
}
