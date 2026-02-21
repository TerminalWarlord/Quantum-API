"use client";

import { IconBolt, IconBrandFacebook, IconBrandInstagram, IconBrandYoutube } from "@tabler/icons-react";
import Link from "next/link";

export default function Footer() {
    return <div className="flex flex-col items-center justify-center px-4">
        <footer className="grid grid-cols-1 md:grid-cols-4 gap-3 border-t border-b py-8 w-full">
            <div className="flex flex-col justify-center md:px-8 lg:px-16">
                <Link href="/" className="flex gap-x-2">
                    <div className="p-1 bg-linear-to-br from-cyan-400 to-cyan-400/50 rounded-md w-fit h-fit">
                        <IconBolt className="text-stone-50" />
                    </div>
                    <h1 className="font-medium text-md md:text-lg transition-all duration-300 ease-in-out">QuantumAPI</h1>
                </Link>
                <div className="">
                    <p className="my-1 text-sm text-neutral-500 dark:text-neutral-400">The marketplace for modern APIs. Find, test, and integrate APIs in minutes.</p>
                </div>
            </div>
            <div className="flex flex-col text-neutral-500 dark:text-neutral-400 text-sm space-y-1">
                <h6 className="font-semibold text-neutral-700 dark:text-neutral-200">Product</h6>
                <Link href={'/browse-api'}>Browse APIs</Link>
                <Link href={'/tutorial'}>Tutorial</Link>
            </div>
            <div className="flex flex-col text-neutral-500 dark:text-neutral-400 text-sm space-y-1">
                <h6 className="font-semibold text-neutral-700 dark:text-neutral-200">Company</h6>
                <Link href={'/about'}>About</Link>
                <Link href={'/contact'}>Contact</Link>
                <div className="flex space-x-1">
                    <Link href={'#'}><IconBrandInstagram/></Link>
                    <Link href={'#'}><IconBrandYoutube/></Link>
                    <Link href={'#'}><IconBrandFacebook/></Link>
                </div>
            </div>
            <div className="flex flex-col text-neutral-500 dark:text-neutral-400 text-sm space-y-1">
                <h6 className="font-semibold text-neutral-700 dark:text-neutral-200">Legal</h6>
                <Link href={'/terms-of-service'}>Terms of Service</Link>
                <Link href={'/privacy-policy'}>Privacy Policy</Link>
                <Link href={'/disclaimer'}>Disclaimer</Link>
                <Link href={'/refund-policy'}>Refund Policy</Link>
            </div>
        </footer>
        <div>
            <p className="mt-4 text-neutral-500 text-sm mb-8">
                &copy; 2026 QuantumAPI. All rights reserved.
            </p>
        </div>
    </div>
}