const POLICIES = [
    {
        title: "Information We Collect",
        description: `We collect information in the following ways:</br>

<b>Account Information:</b> Name, email address, and password when you create an account
<b>Payment Information:</b> Billing details processed securely through Paddle — we never store your full card details
<b>Usage Data:</b> API call logs, request metadata, and platform interaction analytics
Technical Data: IP address, browser type, device information, and cookies`
    }
]

export default function Page() {
    return <div className="flex flex-col items-center px-8 my-12">
        <div className="flex flex-col w-full">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Terms of Service</h1>
            <p className="text-neutral-500">Last updated: February 13, 2026</p>
        </div>
        <ul className="">
            {POLICIES.map((policy, idx) => {
                return <div key={policy.title} className="my-8">
                    <h3 className="text-md md:text-lg lg:text-xl font-semibold">{idx + 1}. {policy.title}</h3>
                    <p className="text-sm md:text-base text-neutral-500" dangerouslySetInnerHTML={{ __html: policy.description }}></p>
                </div>
            })}
        </ul>



    </div>
}