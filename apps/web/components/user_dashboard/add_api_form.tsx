"use client";

import { IconLink, IconLoader, IconPhoto, IconSend, IconUpload } from "@tabler/icons-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { FormEvent, useEffect, useState } from "react";
import { Field, FieldLabel } from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import useSWR from "swr";
import { BACKEND_URL } from "@/lib/config";
import { Api, Category } from "@repo/types";
import { uploadImage } from "@/lib/upload_image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { createToken } from "@/lib/create_token";
import { useSearchParams } from "next/navigation";

const fetcher = async (url: string) => fetch(url).then(res => (res.json() as Promise<{ results: Category[] }>).then(r => r.results));

type AddApiForm = {
    api?: Api
}

export default function AddApiForm({ api }: AddApiForm) {
    const session = useSession();
    const { data: categories, isLoading, error } = useSWR(`${BACKEND_URL}/categories`, fetcher);
    const [thumbnail, setThumbnail] = useState<string | undefined>(api?.thumbnail_url);
    const [thumbnailPath, setThumbnailPath] = useState<string>();
    const [isThumbUploading, setIsThumbUploading] = useState(false);
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!session || !session.data?.user.id) return;
        const btn = document.getElementById('upload_btn') as HTMLButtonElement;
        const input = document.getElementById('thumbnail') as HTMLInputElement;
        if (!btn || !input) return;

        btn.addEventListener("click", () => {
            console.log("CLIECK ")
            input.click();
        });
        input.onchange = async () => {
            if (!input.files || !input.files.length) return;
            const file = input.files[0];
            setIsThumbUploading(true);
            try {
                const { image_url, path } = await uploadImage(file, session.data);
                console.log(image_url);
                setThumbnail(image_url);
                setThumbnailPath(path)
            }
            catch (err: any) {
                toast.error(err.error || err.message || "Failed to update thumbnail");
            }
            setIsThumbUploading(false);

        }
    }, [session, categories]);

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center">
            <IconLoader className="animate-spin" />
        </div>
    }

    const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!session || !session.data?.user.id) {
                throw new Error("You must be logged in to create an API");
            }
            const formData = new FormData(e.currentTarget);
            const { thumbnail: thumb, ...body } = Object.fromEntries(formData);
            if (thumbnailPath) {
                body.image_url = (thumbnailPath ?? "") as FormDataEntryValue;
            }
            console.log(body);
            const token = await createToken(session.data);

            const api_url = `${BACKEND_URL}/manage/${api ? 'edit/api/' + api.slug : 'create-api'}`;
            const res = await fetch(api_url, {
                method: api ? "PATCH" : "POST",
                headers: {
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(body)
            });
            const resData = await res.json();
            if (!res.ok) {
                // TODO: fix error toasts
                console.log(resData.message || "Failed to submit data");
                throw new Error(error || "Failed to submit data");
            }
            toast.success("Successfully created API");
            window.location.reload();
        }
        catch (err: any) {
            console.log(err)
            toast.error(err.message || "Failed to create API");
        }
    }

    return <div className="px-4 md:px-8 font-inter my-6">
        <div className="pb-8">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold">{api ? "Edit API" : "Create New API"}</h1>
            <p className="text-neutral-600 dark:text-neutral-400 tracking-tight">Fill in the details to publish your API on the marketplace</p>
        </div>
        <Card className="gap-0 py-6 px-6">
            <form onSubmit={submitFormHandler}>
                <div>
                    <h2 className="text-md md:text-lg lg:text-xl font-semibold">API Details</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 tracking-tight">Provide basic information about your API</p>
                </div>
                <div className="flex flex-col md:flex-row space-x-0 md:space-x-4 md:items-center py-4">
                    <div className="flex flex-col space-y-2">
                        <p className="text-neutral-700 dark:text-neutral-400 font-medium text-sm">Thumbnail</p>
                        <div className="w-18 h-18 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-md overflow-clip border-dashed border-neutral-300 dark:border-neutral-500 border-2 text-neutral-600 dark:text-neutral-300 flex items-center justify-center bg-neutral-100 dark:bg-neutral-600">
                            {isThumbUploading ? <IconLoader className="w-8 h-8 animate-spin" /> : <>
                                {(thumbnail) ? <img src={thumbnail} className="object-cover aspect-square" /> : <IconPhoto className="w-8 h-8" />}
                            </>}

                        </div>
                    </div>
                    <div className="my-2 md:my-0">
                        <Button variant={'outline'} id="upload_btn" type="button">
                            <IconUpload />
                            <span>Upload Image</span>
                            <input type="file" id="thumbnail" hidden accept="image/*" name="thumbnail" />
                        </Button>
                        <p className="text-neutral-600 dark:text-neutral-400 text-xs my-2">Recommended: 200x200px, PNG or JPG</p>
                    </div>
                </div>
                <div className="flex flex-col space-y-6">
                    <Field className="">
                        <FieldLabel htmlFor="title">API Title
                            <span className="text-red-600">*</span>
                        </FieldLabel>
                        <Input
                            placeholder="A cool API Title..."
                            name="title"
                            defaultValue={api ? api.title : undefined}
                        />
                    </Field>
                    <Field className="">
                        <FieldLabel htmlFor="description">Description
                            <span className="text-red-600">*</span>
                        </FieldLabel>
                        <Textarea
                            placeholder="A cool description about your API..."
                            name="description"
                            defaultValue={api ? api.description : undefined}
                        />
                    </Field>
                    <Field className="">
                        <FieldLabel htmlFor="inline-start-input">Base URL
                            <span className="text-red-600">*</span>
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                placeholder="eg.: https://api.mycoolapi.com/v1"
                                name="base_url"
                                className="focus:outline-none! focus:border-cyan-500! focus:ring-2 focus:ring-cyan-200!"
                                defaultValue={api?.base_url}

                            />
                            <InputGroupAddon>
                                <IconLink />
                            </InputGroupAddon>
                        </InputGroup>
                    </Field>
                    <Field className="w-full">
                        <FieldLabel htmlFor="inline-start-input">Category
                            <span className="text-red-600">*</span>
                        </FieldLabel>
                        <Select
                            name="category_slug"
                            defaultValue={api?.category_slug}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a category" />
                            </SelectTrigger>
                            <SelectContent className="w-full">
                                <SelectGroup className="w-full">
                                    <SelectLabel>Category</SelectLabel>
                                    {categories?.map(cat => {
                                        return <SelectItem value={cat.slug} key={cat.slug}>{cat.name}</SelectItem>
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <div className="flex items-center justify-end my-2">
                        <Button
                            variant={'outline'}
                            type="submit"
                            className="bg-cyan-400 hover:bg-cyan-400/80 hover:text-white dark:hover:bg-cyan-500/80 dark:bg-cyan-500 text-white shadow text-sm"
                        >
                            <IconSend />
                            {api ? "Edit API" : "Create API"}
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    </div>
}