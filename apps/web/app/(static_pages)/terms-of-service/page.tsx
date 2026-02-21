
const TERMS = [
    {
        title: "Acceptance of Terms",
        term: 'By accessing or using QuantumAPI ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. We reserve the right to update these terms at any time, and continued use of the Service constitutes acceptance of any modifications.'
    },
    {
        title: "Description of Service",
        term: 'QuantumAPI is a marketplace platform that connects API providers with developers. We facilitate the discovery, testing, subscription, and integration of APIs. We act as an intermediary and do not guarantee the availability, accuracy, or reliability of third-party APIs listed on our platform.'
    },
    {
        title: "User Accounts",
        term: 'You must create an account to access certain features. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must provide accurate, current, and complete information during registration and keep your account information updated.'
    },
    {
        title: "API Provider Obligations",
        term: 'API providers are responsible for ensuring their APIs comply with all applicable laws and regulations. Providers must maintain reasonable uptime, provide accurate documentation, and promptly address security vulnerabilities. QuantumAPI reserves the right to remove any API that violates these terms or poses a risk to our users.'
    },
    {
        title: "API Consumer Obligations",
        term: "Consumers must use APIs in accordance with each API's terms of use, rate limits, and applicable subscription plans. Abuse, reverse engineering, or unauthorized redistribution of API data is strictly prohibited. You agree not to use any API for illegal, harmful, or unauthorized purposes."
    },
    {
        title: "Payments & Billing",
        term: "Payments are processed through Paddle, our merchant of record. By subscribing to a paid plan, you agree to Paddle's terms of service. Subscription fees are billed in advance on a recurring basis. All fees are non-refundable except as outlined in our Refund Policy."
    },
    {
        title: "Intellectual Property",
        term: "All content, trademarks, and intellectual property on QuantumAPI belong to their respective owners. You retain ownership of your APIs and data. By listing an API on our platform, you grant QuantumAPI a non-exclusive license to display and promote your API within the marketplace."
    },
    {
        title: "Limitation of Liability",
        term: "QuantumAPI is provided \"as is\" without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim."
    },
    {
        title: "Termination",
        term: "We may suspend or terminate your account at our sole discretion if you violate these terms. Upon termination, your right to use the Service ceases immediately. Provisions that by their nature should survive termination shall remain in effect."
    },
    {
        title: "Governing Law",
        term: "These terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms shall be resolved through binding arbitration."
    }
]

export default function TermsOfService() {
    return <div className="flex flex-col items-center px-8 my-12">
        <div className="flex flex-col w-full">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Terms of Service</h1>
            <p className="text-neutral-500">Last updated: February 13, 2026</p>
        </div>
        <ul className="">
            {TERMS.map((term, idx) => {
                return <div key={term.term} className="my-8">
                    <h3 className="text-md md:text-lg lg:text-xl font-semibold">{idx+1}. {term.title}</h3>
                    <p className="text-sm md:text-base text-neutral-500">{term.term}</p>
                </div>
            })}
        </ul>



    </div>
}