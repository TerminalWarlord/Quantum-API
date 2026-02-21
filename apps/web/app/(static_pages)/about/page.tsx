import { IconBolt, IconGlobe, IconShield, IconUsers } from "@tabler/icons-react"
import Link from "next/link"

const ITEMS = [
    {
        icon: IconBolt,
        title: "Fast Integration",
        description: "Go from discovery to integration in minutes with auto-generated code snippets and interactive testing."
    },
    {
        icon: IconUsers,
        title: "Developer-First",
        description: "Built by developers, for developers. Every feature is designed to reduce friction and save time."
    },
    {
        icon: IconGlobe,
        title: "Global Marketplace",
        description: "Connect with API providers worldwide. One subscription, one dashboard, unlimited potential."
    },
    {
        icon: IconShield,
        title: "Trusted & Secure",
        description: "Every API is reviewed for quality and security. Your data and API keys are encrypted and protected."
    }
]

export default function Page() {
    return <div className="flex flex-col items-center px-8 my-12">
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold">About QuantumAPI</h1>
            <p className="text-neutral-500 w-5/6 md:w-2/3 lg:w-1/2 text-center dark:text-neutral-400 my-2">We're building the modern marketplace for APIs - making it effortless for developers to discover, test, and integrate the tools they need to build amazing products.</p>
        </div>
        <div className="flex flex-col items-start my-4">
            <h2 className="text-base sm:text-xl md:text-2xl font-semibold">Our Mission</h2>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">APIs power the modern internet, yet finding and integrating the right one remains unnecessarily complex. QuantumAPI exists to change that. We provide a unified platform where developers can browse hundreds of APIs, test them instantly in our interactive playground, and integrate them into their projects within minutes - not days.</p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 my-16">
            {ITEMS.map(item => {
                return <div className="p-4 border rounded-lg flex flex-col space-y-1 md:max-w-86">
                    <div className="w-10 h-10 bg-cyan-100/70 dark:bg-cyan-500/15 flex items-center justify-center rounded-md">
                        <item.icon className="text-cyan-500" />
                    </div>
                    <h3 className="font-medium mt-2">{item.title}</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">{item.description}</p>
                </div>
            })}
        </ul>

        <div className="flex flex-col items-start my-4">
            <h2 className="text-base sm:text-xl md:text-2xl font-semibold">For Providers</h2>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">APIHub gives API providers a powerful distribution channel. List your API, define pricing plans, and let us handle billing, analytics, and developer onboarding. Focus on building a great product - we'll help you reach the developers who need it.</p>
        </div>

        <div className="flex flex-col items-start my-4 w-full">
            <h2 className="text-base sm:text-xl md:text-2xl font-semibold">Contact Us</h2>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">Have questions or want to partner with us? Reach out at <a href="mailto:contact@joybiswas.com" className="url">contact@joybiswas.com</a> or visit our <Link href={'/contact'} className="url">Contact page</Link>.</p>
        </div>

        {/* <div className="flex flex-col items-start my-4">
            <h2 className="text-base sm:text-xl md:text-2xl font-semibold">Our Mission</h2>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400">APIs power the modern internet, yet finding and integrating the right one remains unnecessarily complex. QuantumAPI exists to change that. We provide a unified platform where developers can browse hundreds of APIs, test them instantly in our interactive playground, and integrate them into their projects within minutes - not days.</p>
        </div> */}
    </div>
}