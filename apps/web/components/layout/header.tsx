"use client";

import { IconBolt } from "@tabler/icons-react"
import { Button } from "../ui/button"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../ui/menubar";
import Link from "next/link";
import { ModeToggle } from "../ui/toggle-theme";

export const Header = () => {
    const session = useSession();
    const isAuthenticated = session.status === "authenticated";
    return <header className="w-full bg-stone-50/60 h-14 backdrop-blur-sm sticky top-0 border-b border-stone-200 dark:bg-stone-950 dark:border-stone-800">
        <nav className="flex items-center h-full px-6 justify-between">
            <div className="flex items-center space-x-4">
                <Link href="/" className="flex gap-x-2">
                    <div className="p-1 bg-linear-to-br from-cyan-400 to-cyan-400/50 rounded-md">
                        <IconBolt className="text-stone-50" />
                    </div>
                    <h1 className="font-medium text-xl">QuantumAPI</h1>
                </Link>
                <Link href="/browse" className="text-stone-500 text-sm dark:text-stone-100">Browse APIs</Link>
                <Link href="/contact" className="text-stone-500 text-sm dark:text-stone-100">Contact</Link>
            </div>
            <div className="flex space-x-2">
                <ModeToggle />
                {isAuthenticated ?
                    <>
                        <Menubar className="shadow-none border-0 bg-transparent">
                            <MenubarMenu>
                                <MenubarTrigger className="bg-transparent">
                                    <div className="flex space-x-2 items-center">
                                        <p className="text-xs text-stone-500 dark:text-stone-100">{session.data.user.name}</p>
                                        <Avatar>
                                            {session.data.user.image && <AvatarImage src={session.data.user.image} alt="@shadcn" />}
                                            <AvatarFallback>{session.data.user.name}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem>
                                        Dashboard
                                    </MenubarItem>
                                    <MenubarItem>
                                        Subscriptions
                                    </MenubarItem>

                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu></MenubarMenu>

                        </Menubar>

                    </> :
                    <>
                        <Button variant={'outline'}>Login</Button>
                        <Button>Sign Up</Button>
                    </>
                }



            </div>
        </nav>

    </header>
}