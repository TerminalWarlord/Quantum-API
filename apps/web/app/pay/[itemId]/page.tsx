import CheckoutPage from "../../../components/paddle_pay";

export default async function Page({ params }: { params: Promise<{ itemId: string }> }) {
    const itemId = (await params).itemId;
    return (
        <CheckoutPage priceId={itemId} />
    )
}
