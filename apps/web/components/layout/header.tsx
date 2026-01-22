"use client";

import { IconBolt } from "@tabler/icons-react"
import { Button } from "../ui/button"
import { signOut, useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "../ui/menubar";
import Link from "next/link";
import { ModeToggle } from "../ui/toggle-theme";
import HamburgerMenu from "../ui/hamburger";

export const Header = () => {
    const session = useSession();
    const isAuthenticated = session.status === "authenticated";
    return <header className="w-full z-1000 bg-linear-to-br from-cyan-100/60 to-stone-50/50 h-14 backdrop-blur-sm sticky top-0 border-b border-stone-200 dark:from-cyan-950/50 dark:to-cyan-950/5 dark:border-stone-800">
        <nav className="flex items-center h-full px-6 justify-between">
            <div className="flex items-center space-x-4">
                <Link href="/" className="flex gap-x-2">
                    <div className="p-1 bg-linear-to-br from-cyan-400 to-cyan-400/50 rounded-md">
                        <IconBolt className="text-stone-50" />
                    </div>
                    <h1 className="font-medium text-lg md:text-xl transition-all duration-300 ease-in-out">QuantumAPI</h1>
                </Link>
                <Link href="/browse" className="text-stone-500 text-sm dark:text-stone-100 hidden md:inline">Browse APIs</Link>
                <Link href="/contact" className="text-stone-500 text-sm dark:text-stone-100 hidden md:inline">Contact</Link>
            </div>
            <div className="md:hidden">
                <HamburgerMenu />
            </div>
            <div className="hidden md:flex space-x-2">
                <ModeToggle />
                {isAuthenticated ?
                    <>
                        <Menubar className="shadow-none border-0 bg-transparent">
                            <MenubarMenu>
                                <MenubarTrigger className="shadow-none border-0 bg-transparent px-0 py-0 rounded-full">
                                    <div className="flex space-x-2 items-center">
                                        <Avatar>
                                            {session.data?.user?.image && (
                                                <AvatarImage
                                                    src={session.data.user.image}
                                                    alt={session.data.user.name ?? "User avatar"}
                                                />
                                            )}
                                            <AvatarFallback>
                                                {session.data?.user?.email ? session.data?.user?.email[0].toLocaleUpperCase() : "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem>
                                        {session.data?.user?.name || session.data.user.email}
                                    </MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem>
                                        Dashboard
                                    </MenubarItem>
                                    <MenubarItem>
                                        Subscriptions
                                    </MenubarItem>
                                    <MenubarItem>
                                        <button
                                            onClick={() => signOut({
                                                callbackUrl: '/auth/login'
                                            })}>
                                            Logout
                                        </button>
                                    </MenubarItem>

                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu></MenubarMenu>

                        </Menubar>

                    </> :
                    <>
                        <Button variant={'outline'}>
                            <Link href={'/auth/login'}>
                                Login
                            </Link>
                        </Button>
                        <Button>
                            <Link href={'/auth/register'}>
                                Sign Up
                            </Link>
                        </Button>
                    </>
                }
            </div>
        </nav>

    </header>
}