import { IconArrowRight, IconBolt, IconCode, IconRocket, IconSearch } from "@tabler/icons-react"
import { Button } from "../ui/button"


const HOW_IT_WORKS = [
    {
        title: "Find an API",
        subtitle: "Browse our catalog of 500+ APIs across various categories.",
        icon: IconSearch
    },
    {
        title: "Test in Playground",
        subtitle: "Try endpoints directly in our interactive playground.",
        icon: IconCode
    },
    {
        title: "Integrate & Build",
        subtitle: "Subscribe and start integrating the API into your app.",
        icon: IconRocket
    }
]

export default function Homepage() {
    return <div className="flex flex-col items-center justify-center px-8 py-16">
        <main className="my-16 w-full flex flex-col items-center">
            <p className="flex space-x-1 text-xs px-2 border w-fit text-neutral-600 dark:text-neutral-400 rounded-2xl">
                <IconBolt className="w-4 h-4" />
                <span>500+ APIs Available</span>
            </p>
            <h2 className="font-bold text-2xl md:text-4xl lg:text-5xl mt-2 mb-4 text-center">
                Discover, Test & Integrate <span className="text-cyan-500">APIs</span> in Minutes
            </h2>
            <p className="text-neutral-400  md:w-1/2 lg:w-96 text-center">The modern marketplace for APIs. Find the perfect API for your project, test it in our playground, and start building faster.</p>
            <div
                className="flex space-x-0 md:space-x-2 my-8 flex-col md:flex-row space-y-2 md:space-y-0"
            >
                <Button className="bg-cyan-500 dark:bg-cyan-500! px-6! text-sm md:text-md py-5!">
                    <span>Browse API</span>
                    <IconArrowRight />
                </Button>
                <Button
                    className="px-6! text-sm md:text-md py-5!"
                    variant={'outline'}
                >
                    <span>Sign Up</span>
                </Button>
            </div>
        </main>
        <section className="my-6 py-6 w-full bg-linear-to-r from-transparent via-neutral-200/20 dark:via-neutral-50/5 to-transparent flex flex-col items-center">
            <h4 className="text-3xl font-bold">How It Works</h4>
            <p className="text-neutral-600 dark:text-neutral-400 my-3">Get started with any API in three simple steps.</p>

            <div className="grid grid-cols-3 my-8">
                {HOW_IT_WORKS.map(item => {
                    return <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-18 h-18 bg-linear-to-br from-cyan-500 to-cyan-300/70 flex items-center justify-center rounded-2xl">
                            <item.icon className="w-10 h-10 text-white"/>
                        </div>
                        <h5 className="text-xl font-semibold ">{item.title}</h5>
                        <p className="text-neutral-600 w-2/3">{item.subtitle}</p>
                    </div>
                })}
            </div>
        </section>
    </div>
}