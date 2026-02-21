"use client";

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ContactSubjects } from "@repo/types"
import { IconHelp, IconMail, IconMessage, IconSend } from "@tabler/icons-react"

const BOXES = [
    {
        icon: IconMail,
        title: "Email Support",
        subtitle: "support@joybiswas.com",
        description: "Response within 1-2 business days"
    },
    {
        icon: IconMessage,
        title: "Live Chat",
        subtitle: "Available Mon-Fri",
        description: "9 AM - 6 PM UTC"
    },
    {
        icon: IconHelp,
        title: "Help Center",
        subtitle: "Browse our documentation",
        description: "FAQs, guides & tutorials"
    }
]

export default function Contact() {
    return <div className="flex flex-col items-center my-16 font-inter">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">Contact Us</h1>
        <p className="text-neutral-500 dark:text-neutral-400 my-2 text-sm md:text-base px-8">Have a question, issue, or partnership inquiry? We'd love to hear from you.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {BOXES.map(item => {
                return <div className="border rounded-md flex flex-col items-center px-4 md:px-6 lg:px-10 py-5">
                    <div className="bg-cyan-50 dark:bg-cyan-50/10 rounded-md w-10 h-10 flex items-center justify-center my-4">
                        <item.icon className="w-7 h-7 text-cyan-500" />
                    </div>
                    <h3 className="font-semibold my-1 text-sm md:text-base">{item.title}</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs md:text-sm mb-1">{item.subtitle}</p>
                    <p className="text-neutral-500 dark:text-neutral-400 text-[0.65rem] md:text-xs">{item.description}</p>
                </div>
            })}
        </div>
        <div className="border rounded-md p-8 w-3/4 lg:w-1/2 my-8">
            <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-5">
                    <Field>
                        <FieldLabel htmlFor="name">
                            Name
                        </FieldLabel>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="email">
                            Email
                        </FieldLabel>
                        <Input
                            id="email"
                            name="email"
                            placeholder="johndoe@gmail.com"
                        />
                    </Field>
                </div>
                <Field>
                    <FieldLabel htmlFor="subject">
                        Subject
                    </FieldLabel>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Subject</SelectLabel>
                                <SelectItem value={ContactSubjects.GENERAL_INQUIRY}>General Inquiry</SelectItem>
                                <SelectItem value={ContactSubjects.BILLING_PAYMENT}>Billing & Payment</SelectItem>
                                <SelectItem value={ContactSubjects.TECHNICAL_SUPPORT}>Technical Support</SelectItem>
                                <SelectItem value={ContactSubjects.REPORT_A_BUG}>Report a bug</SelectItem>
                                <SelectItem value={ContactSubjects.PARTNERSHIP}>Partnership</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
                <Field className="my-5">
                    <FieldLabel htmlFor="message">Message</FieldLabel>
                    <Textarea
                        placeholder="How can we help?"
                        className="h-28"
                        maxLength={500}
                    />
                </Field>
                <Button className="w-full cursor-pointer bg-cyan-500! hover:bg-cyan-500/90!">
                    <IconSend/>
                    <span>Send Message</span>
                </Button>
            </form>
        </div>

    </div>
}