"use client";
import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "./toggle-theme";


const MENU_ITEMS = [
    {
        url: '/browse',
        title: "Browse APIs"
    },
    {
        url: '/contact',
        title: "Contact"
    }
]

function SidebarMenu({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (v: boolean) => void;
}) {
    return (
        <>
            {/* Overlay */}
            <div
                onClick={() => setOpen(false)}
                className={`fixed inset-0 z-40 bg-black/10 transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
            />

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-500 h-screen w-72 bg-white dark:bg-stone-950 shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <nav className="mt-24 px-6">
                    <div className="space-y-2 font-medium flex flex-col">
                        <div className="flex space-x-2 items-center">
                            <p className="text-stone-500 text-xs">Appearance :</p>
                            <ModeToggle />
                        </div>
                        {MENU_ITEMS.map(menu => {
                            return <Link href={menu.url} onClick={() => setOpen(false)} key={menu.url}>{menu.title}</Link>
                        })}
                    </div>
                </nav>
            </aside>
        </>
    );
}

export default function HamburgerMenu() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="relative z-60 h-10 w-10"
                aria-label="Toggle menu"
            >
                <span
                    className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 bg-black dark:bg-white transition-all duration-300 ${open ? "rotate-45" : "-translate-y-2"
                        }`}
                />
                <span
                    className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 bg-black dark:bg-white transition-all duration-300 ${open ? "opacity-0" : ""
                        }`}
                />
                <span
                    className={`absolute left-1/2 top-1/2 h-0.5 w-6 -translate-x-1/2 -translate-y-1/2 bg-black dark:bg-white transition-all duration-300 ${open ? "-rotate-45" : "translate-y-2"
                        }`}
                />
            </button>

            <SidebarMenu open={open} setOpen={setOpen} />
        </>
    );
}